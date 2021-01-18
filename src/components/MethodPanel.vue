<template>
    <v-card

            :min-width="fixedWidth?undefined:350"
            :width="fixedWidth?350:undefined"
            color="blue"
            dark

    >
        <v-card-title class="title">
            {{displayName}}
        </v-card-title>
        <v-card-subtitle style="">
            <div
            >
                {{description}}
            </div>
        </v-card-subtitle>
        <v-card-text class="white  pa-1">
            <v-container fluid>
                <v-row>
                    <v-col class="pt-0">
                        <v-text-field
                                :hint="param.typeName"
                                :key="index"
                                :label="getParameterName(param)"
                                :type="getInputType(param.typeName)"
                                color="primary"
                                light
                                v-for="(param,index) in method.parameterInfos"
                                v-model="parameters[index]"
                        >

                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn
                                :loading="isExecuting"
                                @click="execute"
                                block
                                class="mx-0"
                                color="primary"

                        >
                            执行!
                            <v-icon
                                    dark
                                    right
                            >
                                mdi-rocket-launch
                            </v-icon>
                        </v-btn>
                    </v-col>
                </v-row>

                <v-slide-x-reverse-transition
                        hide-on-leave
                >
                    <v-row>
                        <v-col class="pb-0 pt-0">
                            <v-expansion-panels v-model="resultPanelExpandState">
                                <v-expansion-panel
                                >
                                    <v-expansion-panel-header color="secondary">
                                        执行结果
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content
                                            class="pa-0"
                                            color="secondary"
                                            v-if="method.visualization &&method.visualization.type==='table'"
                                    >

                                        <v-data-table
                                                :footer-props="{
                                                    itemsPerPageText:''
                                                }"
                                                :headers="tableResultHeaders"
                                                :items="tableResultValues"
                                                :no-data-text="tableNoResultText"
                                                class="elevation-0"
                                                color="secondary"
                                                items-per-page="5"
                                                light
                                                style="border-radius: 0"
                                        >
                                        </v-data-table>

                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content color="secondary" v-else>
                                        <TextResultList
                                                :return-values="returnValues"
                                        />
                                    </v-expansion-panel-content>
                                </v-expansion-panel>

                            </v-expansion-panels>
                        </v-col>
                    </v-row>
                </v-slide-x-reverse-transition>
            </v-container>


        </v-card-text>

    </v-card>
</template>
<style>
    .v-expansion-panel-content.pa-0 > .v-expansion-panel-content__wrap {
        padding: 0 !important;
    }
</style>
<script>
    import TextResultList from "./TextResultList";

    const enumerate = (arr) => !arr ? [] : [...(arr.entries())];
    // eslint-disable-next-line no-unused-vars
    const copy = (obj) => JSON.parse(JSON.stringify(obj));
    const basicType = [String, Number, Boolean];
    const isBasicType = instance => !!basicType.find(it => it === instance.constructor);


    export default {
        name: 'MethodPanel',
        components: {TextResultList},
        props: {
            method: Object,
        },
        mounted() {
            this.method.parameterInfos.forEach(() => this.parameters.push(""))
        },
        data() {
            return {
                returnValues: [],
                parameters: [],
                resultPanelExpandState: [],
                isExecuting: false,
                isExecuted: false,
            }
        },
        methods: {
            async execute() {
                //TODO: add type check
                this.isExecuting = true;
                const parameters = [...this.parameters]
                for (let i = 0; i < this.method.parameterInfos.length; i++) {
                    switch (this.method.parameterInfos[i].typeName) {
                        case 'number':
                            parameters[i] = +parameters[i]
                            break;
                        case 'bool': {
                            const p = parameters[i];
                            const truthy = ['T', 'True', 'true', '1'];
                            const falsy = ['F', 'False', 'false', '0'];
                            if (truthy.find(p))
                                parameters[i] = true;
                            if (falsy.find(p))
                                parameters[i] = false;
                            break;
                        }
                        case 'string':
                        default:
                            break


                    }
                }

                try {
                    const req = await this.$http.post("call/" + this.method.hashcode, parameters);
                    console.dir(req);
                    if (req.status === 200) {
                        const date = new Date();
                        this.returnValues.unshift({
                            displayTime: this.getReadableTimeString(date),
                            timestamp: date.getTime(),
                            value: req.data
                        });
                        this.isExecuted = true
                        this.setResultPanelOpen();
                    } else {
                        //TODO:Change to a more friendly error message
                        alert(req.status + ":" + req.data)
                    }
                } catch (e) {
                    //TODO:Change to a more friendly error message
                    console.dir(e)
                    if (e.request.status === 412) {
                        console.log(e);
                        alert("找不到指定方法，请刷新页面以拉取最新的数据")
                    }

                } finally {
                    await this.$nextTick();
                    this.isExecuting = false;
                }
            },
            getReadableTimeString(date) {
                return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
            },

            setResultPanelOpen() {
                this.resultPanelExpandState = 0;
            },

            /*
            TODO:Add support for more detailed numeric types,
              such as support for more detailed display of real numbers and integers, etc.
             */
            getInputType(typename) {
                switch (typename) {
                    case 'string':
                        return 'text';
                    case 'number':
                        return 'number';
                    case 'bool':
                        //Add a selector for bool values, selecting true and false
                        return 'text';
                }
            },
            getParameterName(parameterInfo) {
                if (parameterInfo.displayName)
                    return parameterInfo.displayName;
                else return parameterInfo.name;
            },

        },
        computed: {
            displayName: vm => vm.method.displayName ?? vm.method.name,
            description: vm => vm.method.description ?? vm.method.name,
            tableNoResultText: vm => vm.isExecuted ? "返回结果为空" : "还未执行过呢",
            fixedWidth: vm => {
                const vis = vm.method.visualization;
                return (vis?.type === 'table') ? !!vm.tableIsBasicList : true;
            },
            tableIsBasicList: vm =>
                vm.method.visualization?.isBasicList
                    ? true
                    : vm.lastReturnValue?.length
                    ? isBasicType(vm.lastReturnValue[0])
                    : false,
            lastReturnValue: vm => vm.returnValues.length === 0
                ? []
                : ((vm.returnValues[0].value === "")
                        ? []
                        : vm.returnValues[0].value
                ),
            tableResultHeaders:
                vm => (vm.tableIsBasicList
                    //basic list
                    ? [
                        {
                            text: 'index',
                            value: 'index',
                        },
                        {
                            text: 'value',
                            value: 'value',
                        },
                    ]
                    //tables with column names already specified
                    : vm.method.visualization?.headers?.map(
                        (col) => {
                            return {
                                'text': col,
                                'value': col,
                            }
                        }
                    ))
                    //Table of unknown column names
                    ?? ((vm.tableResultValues?.length)
                        ? Object.getOwnPropertyNames(copy(vm.tableResultValues[0]))
                            .map(
                                it => (
                                    {
                                        value: it,
                                        text: it
                                    }
                                )
                            )
                        : [{
                            text: "无数据",
                            value: "value",
                        }])
            ,
            tableResultValues:
                vm => vm.tableIsBasicList
                    ? enumerate(vm.lastReturnValue).map(
                        ([i, v]) => {
                            return {
                                index: i,
                                value: v,
                            }
                        }
                    )
                    : vm.lastReturnValue
        }
    }
</script>

