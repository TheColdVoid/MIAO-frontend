import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            dark: false,
            light: {
                primary: colors.teal.darken1, // #E53935
                secondary: colors.green, // #FFCDD2
                accent: colors.lightBlue.base, // #3F51B5
            },
        },
    },
})
