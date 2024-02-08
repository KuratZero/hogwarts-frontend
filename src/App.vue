<script>
import {defineComponent} from "vue";
import HeaderBlock from "@/components/HeaderBlock.vue";
import axios from "axios";
import router from "@/router";

export default defineComponent({
  components: {HeaderBlock},
  data() {
    return {
      user: null
    }
  },
  methods: {
    notBlankAndEmit(error, name, ...text) {
      for (let i = 0; i < text.length; i++) {
        let arg = text[i].trim();
        if (arg === '') {
          this.$root.$emit(error, name[i] + ' is required')
          return false
        }
      }
      return true
    }
  }, beforeMount() {
    this.$root.$on("on-notify", (method, message) => {
      const notifyOptions = {
        theme: "bubble",
        position: "bottom-right",
        duration: 2500
      }
      switch (method) {
        case "message":
          this.$toasted.show(message, notifyOptions);
          break;
        case "success":
          this.$toasted.success(message, notifyOptions);
          break;
        case "error":
          this.$toasted.error(message, notifyOptions);
          break;
      }
    })


    this.$root.$on("on-jwt", (jwt) => {
      localStorage.setItem("jwt", jwt);
      axios.get("/api/1/users/auth", {
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      }).then(response => {
        this.user = response.data;
      }).catch(() => {
        this.$root.$emit("on-logout")
        this.$root.$emit("on-notify", "error", "Error while authentication.")
      })
    });

    this.$root.$on("on-login", (from, login, password) => {
      if (!this.notBlankAndEmit(`on-${from}-validation-error`, ['Login', 'Password'],
          login, password)) {
        return;
      }
      axios.post("/api/1/jwt", {
        login: login.trim(), password: password.trim()
      }).then(response => {
        localStorage.setItem("jwt", response.data);
        this.$root.$emit("on-jwt", response.data);
        if (router.currentRoute.path !== "/") {
          router.push('/')
        }
        this.$root.$emit("on-notify", "success", "You have been authenticated!")
      }).catch(error => {
        this.$root.$emit(`on-${from}-validation-error`, error.response.data);
      });
    });

    this.$root.$on("on-logout", () => {
      this.$root.$emit("on-notify", "message", "Good bye!")
      localStorage.removeItem("jwt");
      this.user = null;
    });

    this.$root.$on('on-register', (name, login, password, passwordRe) => {
      if (this.notBlankAndEmit('on-register-validation-error',
          ['Name', 'Login', 'Password', 'Repeat Password'],
          name, login, password, passwordRe)) {
        if (password.trim() !== passwordRe.trim()) {
          this.$root.$emit('on-register-validation-error', "Passwords are not the same.")
          return;
        }
        axios.post('/api/1/users', {"login": login.trim(), "name": name.trim(), "password": password.trim()})
            .then(() => {
              this.$root.$emit("on-login", 'register', login, password)
            })
            .catch(error => this.$root.$emit('on-register-validation-error', error.response.data))
      }
    })

    this.$root.$on("on-update", info => {
      if (!localStorage.getItem('jwt')) {
        this.$root.$emit("on-update-error", "Error authenticating.")
      }
      if (this.notBlankAndEmit("on-update-error", ["Name"], info.name)) {
        info.name = info.name.trim()
        info.about = info.about.trim()
        info.city = info.city.trim()
        axios.put('/api/1/user',
            info,
            {
              headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
              },
              params: {
                "name": info.name
              }
            })
            .then(() => this.$root.$emit("on-notify", "success", "Updated successfully"))
            .catch(error => this.$root.$emit("on-update-error", error))
      }
    })

    if (localStorage.getItem("jwt") && !this.user) {
      this.$root.$emit("on-jwt", localStorage.getItem("jwt"));
    }
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
