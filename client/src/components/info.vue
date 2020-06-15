<template>
    <v-scroll-y-transition mode="out-in">
        <div
                v-if="!item"
                class="title grey--text text--lighten-1 font-weight-light"
                style="align-self: center;"
        >
            Select a User
        </div>
        <v-card
                v-else
                :key="item.id"
                class="pt-4 mx-auto"
                flat
                max-width="400"
        >
            <v-card-text>
                <h3 class="headline mb-2">
                    {{ item.name }}
                </h3>
                <div class="blue--text mb-2">{{ item.id }}</div>
                <div class="blue--text subheading font-weight-bold">{{ item.parent_id }}</div>
            </v-card-text>

        </v-card>
    </v-scroll-y-transition>
</template>

<script>
    export default {
        name: "info",
        props: [
            'item'
        ],
        data: () => {

        }
    }
</script>

<style scoped>

</style>