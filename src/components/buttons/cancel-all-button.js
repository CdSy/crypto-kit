import React from 'react';
import { withNamespaces as withLangs } from 'react-i18next';

const withNamespaces = withLangs();

export const CancelAllButton = withNamespaces(({ t, style, disabled, onClick }) => (
    <button 
        className="app-button danger small inline"
        onClick={onClick}
        disabled={disabled}
        style={style}
    >
        {t('cancelAll')}
    </button>
));