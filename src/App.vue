<template>
    <v-app>
        <v-app-bar
                app
                color="primary"
                dark
        >
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <!--            <v-btn text >-->
            <!--                <span class="mr-2"></span>-->
            <!--            </v-btn>-->
        </v-app-bar>

        <v-main>
            <v-container class="ma-3" fluid>
                <v-row
                        align="start"
                        class="lighten-5 my-2"
                >
                    <MethodPanel
                            :key="method.hashcode"
                            :method="method"
                            class="mr-4 mb-4"
                            v-for="method in methodInfos"
                    />
                </v-row>

            </v-container>

        </v-main>
    </v-app>
</template>
<style>
    .list-complete-item {
        transition: all 1s;
    }

    .list-complete-enter, .list-complete-leave-to
        /* .list-complete-leave-active for below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(30px);
    }

    .list-complete-leave-active {
        position: absolute;
    }

</style>
<script>
    import MethodPanel from "./components/MethodPanel";

    export default {
        name: 'App',

        components: {MethodPanel},
        mounted: function () {
            console.log(process.env.VUE_APP_BASE);
            this.$http.get("meta-info").then((res) => {
                    document.title = res.data.title;
                    this.title = res.data.title;
                }
            );
            this.$http.get("scheme")
                .then((res) => this.methodInfos = res.data)
        },

        data: () => ({
            methodInfos: [],
            title: "Loading...",
        }),
        methods:
            {}
    };
</script>
