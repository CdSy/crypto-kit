import React from 'react';
import { withNamespaces as withLangs } from 'react-i18next';

const withNamespaces = withLangs();

export const ClearFiltersButton = withNamespaces(({ t, style, onClick }) => (
    <button 
        className="app-button danger small inline"
        onClick={onClick}
        style={style}
    >
        {t('clearFilters')}
    </button>
));