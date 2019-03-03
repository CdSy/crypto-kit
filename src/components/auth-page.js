import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import AppModal from './app-modal';
import AppInput from './app-form/app-input';
import NumberInput from "./app-form/number-input";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { login, register, getUrlParameter } from "../api/auth-api";
import { startSessionAndRedirect } from "../services/session-manager";
import { withNamespaces as withLangs } from 'react-i18next';

const withNamespaces = withLangs();

@withNamespaces
@withRouter
export class AuthPage extends React.Component {
    static getDerivedStateFromProps(nextProps, state) {
        if (nextProps.type) {
            return { type: nextProps.type };
        }
        return null;
    }

    state = {
        type: "login",
        error: null,
        isPending: false,
        isSuccessShowed: false,
        isTFAShowed: false,
        TFACode: '',
        isReferral: false,
        loginForm: {
            email: '',
            password: ''
        },
        registerForm: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    };

    emailRegex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    componentDidMount() {
        const username = getUrlParameter('username');
        const password = getUrlParameter('password');
        const isReferral = this.props.location.state &&
            this.props.location.state.type &&
            this.props.location.state.type === 'register';

        if (username && password) {
            this.setState({isPending: false, isSuccessShowed: true});
        }

        if (isReferral) {
            this.setState({type: "register", isReferral: true});
        }
    }

    onChange = (form) => (value, name) => {
        this.setState({[form]: {...this.state[form], [name]: value}});
    }

    onChangeTfaCode = (value) => {
        this.setState({TFACode: value});
    }
    // setEmailRef = emailRef => { this.emailRef = emailRef; };
    // setPasswordRef = passwordRef => { this.passwordRef = passwordRef; };
    // setPasswordRepeatRef = passwordRepeatRef => { this.passwordRepeatRef = passwordRepeatRef; };

    setTypeLogin = () => {
        this.setState({
            type: "login",
            error: null,
            loginForm: {
                email: '',
                password: ''
            }
        });
    };

    setTypeRegister = () => {
        this.setState({
            type: "register",
            error: null,
            registerForm: {
                email: '',
                password: '',
                confirmPassword: ''
            }
        });
    };

    handleRegisterKeyPress = e => {
        if (e.key === "Enter") {
            this.handleRegisterSubmit();
        }
    };

    handleLoginKeyPress = e => {
        if (e.key === "Enter") {
            this.handleLoginSubmit();
        }
    }

    handleRegisterSubmit = () => {
        const { t } = this.props;
        const { email, password, confirmPassword } = this.state.registerForm;

        if (email.length === 0 || !this.emailRegex.test(email)) {
            this.setState({ error: t('enterCorrectEmail') });
            return;
        }

        if (password.length < 6) {
            this.setState({ error: t('shortPassword') });
            return;
        }

        if (password !== confirmPassword) {
            this.setState({ error: t('passwordsDontMatch') });
            return;
        }

        this.setState({ isPending: true, error: null }, () => {
            const { isReferral } = this.state;
            const refData = this.props.commonStore.getReferralData();
            const request = isReferral ? register(email, password, refData) : register(email, password);

            request.then(data => {
                    this.setState({isPending: false, isSuccessShowed: true});
                })
                .catch(e => {
                    this.setState({ isPending: false, error: t('emailAlreadyRegistered') });
                });
        });
    };

    handleLoginSubmit = e => {
        e.preventDefault();

        this.setState({ isPending: true, error: null }, () => {
            const email = this.state.loginForm.email.trim().toLowerCase();
            const password = this.state.loginForm.password.trim();

            this.logIn(email, password);
        });
    };

    logIn = (email, password, tfa) => {
        const { initialize } = this.props;
        const { t } = this.props;

        login(email, password, tfa)
            .then(data => {
                startSessionAndRedirect(data);
                initialize();
                this.props.history.push('/');
            })
            .catch((err) => {
                const isTFAEnabled = err.status === 406;

                if (isTFAEnabled) {
                    this.open2FAModal();
                }

                this.setState({ isPending: false, error: t('invalidEmailOrPassword') });
            });
    }

    loginWithTFA = () => {
        const email = this.state.loginForm.email.trim().toLowerCase();
        const password = this.state.loginForm.password.trim();
        const tfa = this.state.TFACode;

        this.logIn(email, password, tfa);
    }

    renderError() {
        if (this.state.error) {
            return <div className="auth-window__error">{this.state.error}</div>;
        }
    }

    renderSuccessRegisterModal = () => {
        const { t } = this.props;

        return (
            <AppModal
                open={this.state.isSuccessShowed}
                onClose={this.closeModal}
                center
                showCloseIcon={true}
                animationDuration={500}
                className={'app-notification-modal success'}
            >
                <div className="content">
                    <div className="modal-title">{t('registerConfirmEmail')}</div>
                    <div className="icon-wrapper">
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="icon"
                        />
                    </div>
                    {/* <div className="paragraph">You have been successfully registered.</div>
                    <div className="paragraph">
                        Check your email for details.
                    </div> */}
                </div>
            </AppModal>
        );
    }

    renderConfirm2FAModal() {
        const { t } = this.props;
        const { TFACode } = this.state;
        const isDisabled = TFACode.length === 0;

        return (
            <AppModal
                open={this.state.isTFAShowed}
                onClose={this.close2FAModal}
                center
                showCloseIcon={true}
                animationDuration={500}
                className={'app-notification-modal success'}
            >
                <div className="content">
                    <div className="modal-title">{t('putConfirmCode')}</div>
                    <div className="form-group">
                        <div className="form-label accent">{t('yourTFAcode')}</div>
                        <NumberInput
                            className="form-control form-control-sm"
                            name="token"
                            value={TFACode}
                            onChange={this.onChangeTfaCode}
                        />
                    </div>
                </div>
                <button
                    type="button"
                    className="app-button success"
                    onClick={this.loginWithTFA}
                    disabled={isDisabled}
                >
                    {t('signIn')}
                </button>
            </AppModal>
        );
    }

    open2FAModal = () => {
        this.setState({
            isTFAShowed: true
        });
    }

    close2FAModal = () => {
        this.setState({
            isTFAShowed: false,
            TFACode: ''
        });
    }

    closeModal = () => {
        this.setState({
            isSuccessShowed: false,
        });
    }

    renderLogin() {
        const { t } = this.props;
        const isPending = this.state.isPending;
        const { email, password } = this.state.loginForm;

        return (
            <div className="auth-window">
                <div className="dialog app-modal">
                    <div className="content">
                        <div className="header">
                            <h5 className="modal-title">{t('signIn')}</h5>
                        </div>
                        <div className="body">
                            <form className="auth-window__form" autoComplete="on" onSubmit={this.handleLoginSubmit}>
                                <div className="form-group">
                                    <AppInput
                                        value={email}
                                        type="email"
                                        name="email"
                                        label={t('emailAddress')}
                                        onChange={this.onChange('loginForm')}
                                        className='accent'
                                        floatLabel
                                    />
                                </div>
                                <div className="form-group">
                                    <AppInput
                                        value={password}
                                        type="password"
                                        name="password"
                                        label={t('password')}
                                        onChange={this.onChange('loginForm')}
                                        className='accent'
                                        floatLabel
                                    />
                                    <div className="flex-wrapper between">
                                        <span
                                            className="app-link"
                                            onClick={this.setTypeRegister}
                                        >
                                            {t('orSignUp')}
                                        </span>
                                        <Link className="accent-text" to="/forgot-password">
                                            {t('forgotPassword')}
                                        </Link>
                                    </div>
                                </div>
                                <div className="auth-window__form-buttons">
                                    <button
                                        className="submit-button"
                                        disabled={isPending}
                                        type="submit"
                                    >
                                        {t('signIn')}
                                    </button>
                                    {this.renderError()}
                                </div>
                                <div className="terms-block">
                                    <div className="accent-text">
                                        {t('agree')}
                                    </div>
                                    <a href="#" className="app-link"> {t('terms')}</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderRegister() {
        const { t }= this.props;
        const isPending = this.isPending;
        const { email, password, confirmPassword } = this.state.registerForm;

        return (
            <div className="auth-window">
                <div className="dialog app-modal">
                    <div className="content">
                        <div className="header">
                            <h5 className="modal-title">{t('imperativeSignUp')}</h5>
                            <div className="auth-window__subtitle">{t('signUpSubtitle')}</div>
                        </div>
                        <div className="body">
                            <form className="auth-window__form" autoComplete="off">
                                <div className="form-group">
                                    <AppInput
                                        value={email}
                                        type="email"
                                        name="email"
                                        label={t('emailAddress')}
                                        onChange={this.onChange('registerForm')}
                                        className='accent'
                                        floatLabel
                                    />
                                </div>
                                <div className="form-group">
                                    <AppInput
                                        value={password}
                                        type="password"
                                        name="password"
                                        label={t('password')}
                                        onChange={this.onChange('registerForm')}
                                        onKeyPress={this.handleRegisterKeyPress}
                                        className='accent'
                                        floatLabel
                                    />
                                </div>
                                <div className="form-group">
                                    <AppInput
                                        value={confirmPassword}
                                        type="password"
                                        name="confirmPassword"
                                        label={t('confirmPassword')}
                                        onChange={this.onChange('registerForm')}
                                        onKeyPress={this.handleRegisterKeyPress}
                                        className='accent'
                                        floatLabel
                                    />
                                    <span
                                        className="app-link"
                                        disabled={isPending}
                                        onClick={this.setTypeLogin}
                                    >
                                        {t('orSignIn')}
                                    </span>
                                </div>
                                <div className="auth-window__form-buttons">
                                    <button
                                        className="submit-button"
                                        disabled={isPending}
                                        type="button"
                                        onClick={this.handleRegisterSubmit}
                                    >
                                        {t('signUp')}
                                    </button>
                                    {this.renderError()}
                                </div>
                                <div className="terms-block">
                                    <div className="accent-text">
                                        {t('agree')}
                                    </div>
                                    <a href="#" className="app-link"> {t('terms')}</a>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* <div className="socials-wrapper">
                        {this.renderSocials()}
                    </div> */}
                </div>
            </div>
        );
    }

    renderHeader() {
        const { t } = this.props;

        return (
            <nav className="app-topbar high app-topbar--no-fixed navbar navbar-expand-sm justify-content-between">
                <div className="container">
                    <ul className="navbar-nav ml-auto app-topbar__lang"></ul>
                    <div className="sign-in-btn" onClick={this.setTypeLogin}>
                        <FontAwesomeIcon
                            icon={faUser}
                            className="icon"
                        />
                        {t('signIn')}
                    </div>
                    <div className="sign-up-btn" onClick={this.setTypeRegister}>
                        {t('signUp')}
                    </div>
                </div>
            </nav>
        );
    }

    render() {
        const { t } = this.props;

        return (
            <div id="auth" className="dark">
                {this.renderConfirm2FAModal()}
                {this.renderSuccessRegisterModal()}
                {this.renderHeader()}

                <div className="project-description">
                  <div className="text">
                    Bitmex Copy trade service
                  </div>
                  <div className="small-text">
                    Fast and stable service for copy bots or traders actions to many accounts
                  </div>
                </div>
                {this.state.type === "login" ?
                    this.renderLogin() :
                    this.renderRegister()
                }
            </div>
        );
    }
}
