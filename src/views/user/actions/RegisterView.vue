<script>
import {errorEvent, events, notify, usersHandlers} from "@/assets/apies";
import axios from "axios";
import TextFormBlock from "@/components/TextFormBlock.vue";

export default {
  name: "RegisterView",
  computed: {
    events() {
      return events
    }
  },
  data() {
    return {
      labels: ['Name', 'Login', 'Password', "Repeat password"]
    }
  },
  components: {TextFormBlock},
  beforeMount() {
    this.$root.$on(events.register, (texts) => {
      let [name, login, password, passwordRe] = texts;
      if (password !== passwordRe) {
        this.$root.$emit(errorEvent(events.register), "Passwords are not the same")
        return;
      }

      axios.post(usersHandlers.register, {login, name, password})
          .then(() => {
            this.$root.$emit(notify.event, notify.success, "You have been registered!")
            this.$root.$emit(events.login, 'register', login, password)
          }).catch(error => this.$root.$emit(errorEvent(events.register), error.response.data))
    })
  }
}
</script>

<template>
  <TextFormBlock :event="events.register"
                 header="Register" submit="Register"
                 :labels="labels"
                 :types="['text', 'text', 'password', 'password']"
                 form="form-box"/>
</template>
