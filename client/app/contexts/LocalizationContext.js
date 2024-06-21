import React from 'react';
import i18n from "i18n-js";

export const LocalizationContext = React.createContext({ 
    translate: (key, options) => i18n.t(key, options),
    locale: 'en',
    setLocale: () => {}
  });
