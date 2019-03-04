import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";

export const resources  = {};

const lang = require('./en-translation.js');
resources['en'] = {...lang.default};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: true,
      prefix: "%",
      suffix: "%"
    }
  });

export default i18n;
