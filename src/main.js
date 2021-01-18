import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueAxios from "vue-axios";
import axios from "axios"
import VueI18n from "vue-i18n";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios.create({
    baseURL: process.env.VUE_APP_BASE
}));
//TODO:Apply multi-language support
Vue.use(VueI18n);
const labels = {
    en: {
        button: {
            execute: "Execute!"
        },
        title: {
            executionResults: "Execution Results"
        }
    },
    zh: {
        button: {
            execute: "执行!"
        },
        title: {
            executeResult: "执行结果"
        }
    },
}

// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
    locale: 'en', // 设置地区
    labels
});
new Vue({
    i18n,
    vuetify,
    render: h => h(App)
}).$mount('#app')
