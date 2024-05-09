import { createI18n } from "vue-i18n";
import en from "@/i18n/en-US.json";
import ch from "@/i18n/zh-TW.json";

export default new createI18n({
    legacy: false,
    locale: localStorage.getItem("lang") ?? "zh_TW",
    messages: {
        'zh_TW': ch,
        'en_US': en
    },
    fallbackLocale: "en_US",
});