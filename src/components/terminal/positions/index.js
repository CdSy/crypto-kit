import React, { Component, Fragment } from 'react';
import PositionsComponent from "./positions";
import { PositionsStore, POSITIONS as POSITIONS_TYPE } from '../../../stores/positions-store';

class PositionsContainer extends Component {
    id = POSITIONS_TYPE;
    constructor(props) {
        super(props);
        this.store = new PositionsStore(this.props.botId);
    }

    componentDidMount() {
        this.store.getApiKeysData();
        this.store.getSchema(this.id);
        this.store.loadData().then(() => this.store.startAutoUpdate());
    }

    componentWillUnmount() {
        this.store.stopAutoUpdate();
    }

    render() {
        const isBotPositions = this.props.botId !== undefined;

        return (
            <Fragment>
                <PositionsComponent store={this.store} withoutControls={isBotPositions}/>
            </Fragment>
        )
    }
}

export default PositionsContainer;
