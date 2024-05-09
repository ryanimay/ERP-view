import { createI18n } from "vue-i18n";
import en from "@/i18n/en-US.json";
import ch from "@/i18n/zh-TW.json";

export default new createI18n({
    legacy: false,
    locale: localStorage.getItem("lang") ?? "zh-TW",
    messages: {
        'zh-TW': ch,
        'en-US': en
    },
    fallbackLocale: "en-US",
});