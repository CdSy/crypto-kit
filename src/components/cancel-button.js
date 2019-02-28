import React from 'react';
import { withNamespaces as withLangs } from 'react-i18next';

const withNamespaces = withLangs();

export const CancelButton = withNamespaces(({ t, onClick }) => (
    <button 
        className="app-button danger small inline"
        onClick={onClick}
    >
        {t('cancel')}
    </button>
));