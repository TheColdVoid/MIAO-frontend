<template>
    <v-timeline
            align-top
            dense
    >
        <v-slide-x-reverse-transition
                group
                hide-on-leave
        >
            <v-timeline-item
                    :key="-returnValue.timestamp"
                    color="white"
                    fill-dot
                    small
                    v-for="(returnValue,index) in returnValues"
            >
                <div>
                    <div class="font-weight-normal">
                        <strong>第{{getCurrentReturnValueIndex(index)}}次执行</strong>
                        @{{returnValue.displayTime}}
                    </div>
                    <div v-html="lineBreakConvert(returnValue.value)"></div>
                </div>
            </v-timeline-item>
        </v-slide-x-reverse-transition>
    </v-timeline>
</template>
<script>
    export default {
        name: 'TextResultList',
        props: {
            returnValues: {}
        },
        methods: {
            getCurrentReturnValueIndex(index) {
                return this.returnValues.length - index

            },
            lineBreakConvert(src) {
                if (src?.replace) {
                    return src?.replace(/\n/g, "<br>");
                } else
                    return src;
            },
        }
    }
</script>










