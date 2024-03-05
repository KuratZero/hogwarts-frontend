<script>
import {errorEvent, notBlank} from "@/assets/apies";

export default {
  props: ["event", "header", "submit", "labels", "types", "form", "info"],
  data() {
    return {
      typesToClass: {
        'text': 'field',
        'password': 'field',
        'textarea': 'textarea',
      },
      texts: [],
      error: ""
    }
  },
  methods: {
    onSubmit() {
      this.error = "Submitting..."
      const result = this.texts.map(it => it.trim())
      const validate = notBlank(this.labels, ...result)
      if (validate) {
        this.error = validate
        return;
      }
      if (this.info)
        this.$root.$emit(this.event, this.info, result)
      else
        this.$root.$emit(this.event, result)
    }
  },
  beforeMount() {
    this.$root.$on(errorEvent(this.event), error => this.error = error)

    for (let i = 0; i < this.labels.length; i++) {
      this.$set(this.texts, i, "")
    }
  }
}
</script>

<template>
  <div :class="form">
    <div class="header">{{ header }}</div>
    <div class="body">
      <form @submit.prevent="onSubmit">

        <div v-for="(label, ind) in labels" v-bind:key="label">
          <div :class="typesToClass[types[ind]]">
            <div class="name">
              <label :for="label">{{ label }}</label>
            </div>

            <div class="value">

              <textarea v-if="types[ind] === 'textarea'"
                        :id="label" :name="label" type="text"
                        v-model="texts[ind]" :placeholder="label"/>

              <input v-if="types[ind] === 'text' || types[ind] === 'password'"
                     autofocus :id="label" :name="label" :type="types[ind]"
                     v-model="texts[ind]" :placeholder="label"/>
            </div>

          </div>
        </div>

        <div class="field error">{{ error }}</div>

        <div class="button-field">
          <input type="submit" :value="submit">
        </div>

      </form>
    </div>
  </div>
</template>