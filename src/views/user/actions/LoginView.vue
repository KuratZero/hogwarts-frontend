<script>
import TextFormBlock from "@/components/TextFormBlock.vue";
import {betweenEvent, events} from "@/assets/apies";

export default {
  name: "LoginView",
  methods: {betweenEvent},
  computed: {
    events() {
      return events
    }
  },
  components: {TextFormBlock},
  beforeMount() {
    this.$root.$on(betweenEvent(events.login), (texts) => {
      let [login, password] = texts
      this.$root.$emit(events.login, 'login-between', login, password);
    });
  }
}
</script>

<template>
  <TextFormBlock :event="betweenEvent(events.login)"
                 header="Login" submit="Login"
                 :labels="['Login', 'Password']"
                 :types="['text', 'password']"
                 form="form-box"/>
</template>
