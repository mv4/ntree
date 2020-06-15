<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card>


        <v-layout>
            <v-flex>
                <v-card-text>
                    <v-treeview
                            :items="root"
                            :load-children="fetch"

                            active-class="grey lighten-4 indigo--text"
                            selected-color="indigo"

                            :active.sync="active"
                            class="grey lighten-5"

                    >
                        <template v-slot:append="{ item, op}">
                            <v-btn
                                    fab
                                    dark
                                    small
                                    color="yellow"
                                    @click="getInfo(item.id)"

                            >
                                <v-icon>preview</v-icon>
                            </v-btn>

                            <v-btn v-if="!item.root"
                                   fab
                                   dark
                                   small
                                   color="green"
                                   @click="getItemEdit(item.id)"
                            >
                                <v-icon>edit</v-icon>
                            </v-btn>
                            <v-btn
                                    fab
                                    dark
                                    small
                                    color="indigo"
                            >
                                <v-icon>add</v-icon>
                            </v-btn>
                            <v-btn v-if="!item.root"
                                   fab
                                   dark
                                   small
                                   color="red"
                                   @click="deleteItem(parent)"

                            >
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </template>
                    </v-treeview>
                </v-card-text>

            </v-flex>
            <v-divider vertical></v-divider>
            <v-flex
                    xs12
                    md8
            >
                <v-card-text>

                    <m-form
                            :item="itemEdit"
                    ></m-form>

                    <m-info
                            :item="info"
                    ></m-info>
                </v-card-text>
            </v-flex>

            <v-divider vertical></v-divider>


        </v-layout>


    </v-card>


</template>


<script>
    import axios from 'axios'
    import MForm from './form'
    import MInfo from './info'

    export default {
        components: {
            MForm,
            MInfo
        },
        data: () => ({
            root: [],
            active: [],
            info: null,
            itemEdit: null
        }),
        created() {
            let vm = this;
            axios.post(
                'http://localhost:3012/graphql', {
                    query: '{root{_id,node,isLeaf}}'
                }).then(function (res) {
                let root = res.data.data.root;
                vm.root = [
                    {
                        id: root._id,
                        name: root.node,
                        root: true,
                        children: root.isLeaf ? null : []
                    }
                ];
            });
        },

        methods: {
            async fetch(item) {
                console.log('i am fetch')
                let res = await axios.post(
                    'http://localhost:3012/graphql', {
                        query: '{getChildren(parent_id:"' + item.id + '"){_id,node,isLeaf}}'
                    });

                if (res.data.data.getChildren) {
                    item.children = res.data.data.getChildren.map(function (child) {
                        let leaf = {
                            id: child._id,
                            name: child.node,
                        };
                        if (!child.isLeaf) {
                            leaf.children = [];
                        }
                        return leaf;
                    });
                }
            },

            async getInfo(id) {
                console.log('id =', id)
                let res = await axios.post(
                    'http://localhost:3012/graphql', {
                        query: '{getInfo(id:"' + id + '"){_id,node,parent_id}}'
                    });
                let info = res.data.data.getInfo;
                this.itemEdit = null;
                this.info = {
                    id: info._id,
                    name: info.node,
                    parent_id: info.parent_id
                }
            },

            async getItemEdit(id) {
                let res = await axios.post(
                    'http://localhost:3012/graphql', {
                        query: '{getInfo(id:"' + id + '"){_id,node,parent_id}}'
                    });
                let item = res.data.data.getInfo;
                this.info = null;
                this.itemEdit = {
                    id: item._id,
                    name: item.node,
                    parent_id: item.parent_id
                }
            },

             deleteItem(id) {

                console.log(id)
                 console.log(this.value)
                //
                // console.log(this.root)
                // let obj = this.root.find(o => o.id === id);
                //
                // console.log(obj);

            }
        }
    }
</script>


