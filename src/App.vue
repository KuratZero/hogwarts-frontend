<script>
import {defineComponent} from "vue";
import HeaderBlock from "@/components/HeaderBlock.vue";
import axios from "axios";
import router from "@/router";
import {errorEvent, events, jwtHeader, notify, notifyOptions, usersHandlers} from "@/assets/apies";

export default defineComponent({
  components: {HeaderBlock},
  data() {
    return {
      user: null
    }
  },
  methods: {
    notBlankAndEmit(error, names, ...texts) {
      for (let i = 0; i < texts.length; i++) {
        let arg = texts[i].trim();
        if (arg === '') {
          this.$root.$emit(error, names[i] + ' is required')
          return false
        }
      }
      return true
    }
  }, beforeMount() {

    this.$root.$on(notify.event, (method, message) => {
      switch (method) {
        case "message":
          this.$toasted.info(message, notifyOptions);
          break;
        case "success":
          this.$toasted.success(message, notifyOptions);
          break;
        case "error":
          this.$toasted.error(message, notifyOptions);
          break;
      }
    })

    this.$root.$on(events.auth, (jwt) => {
      localStorage.setItem("jwt", jwt);

      axios.get(usersHandlers.auth, {headers: jwtHeader(jwt)})
          .then(response => this.user = response.data)
          .catch(() => {
            this.$root.$emit(events.logout)
            this.$root.$emit(notify.event, notify.error, "Error while authentication.")
          })
    });

    this.$root.$on(events.login, (from, login, password) => {
      if (!this.notBlankAndEmit(`on-${from}-error`,
          ['Login', 'Password'], login, password)) {
        return;
      }

      axios.post(usersHandlers.login, {login, password})
          .then(response => {
            this.$root.$emit(events.auth, response.data);

            if (router.currentRoute.path !== "/") {
              router.push('/')
            }

            this.$root.$emit(notify.event, notify.success, "You have been authenticated!")
          })
          .catch(error => this.$root.$emit(`on-${from}-error`, error.response.data));
    });

    this.$root.$on(events.logout, () => {
      this.$root.$emit(notify.event, notify.message, "Good bye!")
      localStorage.removeItem("jwt");
      this.user = null;
    });

    this.$root.$on(events.getImage, (from, id) => {
      axios.get(usersHandlers.avatar, {params: {"id": id}})
          .then(response => this.$root.$emit(from, response.data))
          .catch(error => {
            if (error.response.status !== 404)
              this.$root.$emit(notify.event, notify.error, "Server error. Try again later. " + error)
          })
    })

    this.$root.$on(events.updateInfo, info => {
      if (this.notBlankAndEmit(errorEvent(events.updateInfo), ["Name"], info.name)) {
        info.name = info.name.trim()
        info.about = info.about.trim()
        info.city = info.city.trim()
        axios.put(usersHandlers.updateInfo,
            info,
            {
              headers: jwtHeader(localStorage.getItem('jwt')),
              params: {"name": info.name}
            })
            .then(() => this.$root.$emit(notify.event, notify.success, "Updated successfully"))
            .catch(error => this.$root.$emit(errorEvent(events.updateInfo), error))
      }
    })

    if (!this.user && localStorage.getItem("jwt"))
      this.$root.$emit(events.auth, localStorage.getItem("jwt"));
  }
})
</script>

<template>
  <div id="app">
    <HeaderBlock :user="user"/>
    <router-view :user="user"/>
  </div>
</template>

<style>
</style>
