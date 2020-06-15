<template>
    <v-scroll-y-transition mode="out-in">

    <v-form v-if="item"
            ref="form"
            v-model="valid"
            lazy-validation
    >
        <v-text-field
                v-model="name"
                :counter="10"
                :rules="nameRules"
                label="Node name"
                value=item.name
                required
        ></v-text-field>

        <v-textarea
                name="description"
                label="Description"
                value=""
                hint="Hint text"
        ></v-textarea>
        <v-btn
                :disabled="!valid"
                color="success"
                @click="validate"
        >
            Validate
        </v-btn>

        <v-btn
                color="error"
                @click="reset"
        >
            Reset Form
        </v-btn>

        <v-btn
                color="warning"
                @click="resetValidation"
        >
            Reset Validation
        </v-btn>
    </v-form>
    </v-scroll-y-transition>

</template>


<script>
    export default {
        props: [
            'item'
        ],
        data: () => ({
            valid: true,
            name: '',
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 10) || 'Name must be less than 10 characters'
            ],
        }),

        methods: {
            validate() {
                if (this.$refs.form.validate()) {
                    this.snackbar = true
                }
            },
            reset() {
                this.$refs.form.reset()
            },
            resetValidation() {
                this.$refs.form.resetValidation()
            }
        }
    }
</script>