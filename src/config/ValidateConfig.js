// VeeValidate 元件跟功能
import {
    Field, Form, ErrorMessage, defineRule, configure,
} from 'vee-validate';
// VeeValidate 的驗證規則
import * as AllRules from '@vee-validate/rules';
// VeeValidate 的 i18n 功能
import { localize, setLocale } from '@vee-validate/i18n';

const getUserLocale = () => {
    let userLanguage = navigator.language || navigator.userLanguage;
    let userLocale;
    if (userLanguage.startsWith('zh')) {
        userLocale = 'zh_TW';
    } else if (userLanguage.startsWith('en')) {
        userLocale = 'en';
    } else if (userLanguage.startsWith('es')) {
        userLocale = 'es';
    } else if (userLanguage.startsWith('fr')) {
        userLocale = 'fr';
    } else {
        userLocale = 'en';
    }
    return userLocale;
};
let userLocale = getUserLocale();
import(`@vee-validate/i18n/dist/locale/${userLocale}.json`)
    .then((locale) => {
        configure({
            generateMessage: localize({ [userLocale]: locale.default}),
            validateOnInput: true,
        })
        setLocale(userLocale)
    })
    .catch(error => {
        console.error('Failed to load language file:', error);
    });

Object.keys(AllRules).forEach((rule) => {
    defineRule(rule, AllRules[rule]);
});

export default { Field, Form, ErrorMessage };