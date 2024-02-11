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
    jwtHeader(jwt) {
      return {'Authorization': 'Bearer ' + jwt}
    },
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
      axios.get("/api/1/user/auth", {
        headers: this.jwtHeader(jwt)
      }).then(response => this.user = response.data).catch(() => {
        this.$root.$emit("on-logout")
        this.$root.$emit("on-notify", "error", "Error while authentication.")
      })
    });

    this.$root.$on("on-login", (from, login, password) => {
      if (!this.notBlankAndEmit(`on-${from}-error`, ['Login', 'Password'],
          login, password)) {
        return;
      }

      axios.post("/api/1/jwt", {
        "login": login.trim(), "password": password.trim()
      }).then(response => {
        localStorage.setItem("jwt", response.data);
        this.$root.$emit("on-jwt", response.data);

        if (router.currentRoute.path !== "/") {
          router.push('/')
        }

        this.$root.$emit("on-notify", "success", "You have been authenticated!")
      }).catch(error => this.$root.$emit(`on-${from}-error`, error.response.data));
    });

    this.$root.$on("on-logout", () => {
      this.$root.$emit("on-notify", "message", "Good bye!")
      localStorage.removeItem("jwt");
      this.user = null;
    });

    this.$root.$on('on-register', (name, login, password, passwordRe) => {
      if (!this.notBlankAndEmit('on-register-error',
          ['Name', 'Login', 'Password', 'Repeat Password'],
          name, login, password, passwordRe)) {
        return;
      }

      if (password.trim() !== passwordRe.trim()) {
        this.$root.$emit('on-register-error', "Passwords are not the same.")
        return;
      }

      axios.post('/api/1/user/register', {"login": login.trim(), "name": name.trim(), "password": password.trim()})
          .then(() => this.$root.$emit("on-login", 'register', login.trim(), password.trim()))
          .catch(error => this.$root.$emit('on-register-error', error.response.data))
    })

    this.$root.$on("on-write-article", (text) => {
      if (!localStorage.getItem('jwt')) {
        this.$root.$emit("on-write-article-error", "Error authenticating.")
        return
      }

      if (!this.notBlankAndEmit("on-write-article-error",
          ["Text"], text)) {
        return;
      }

      axios.post('/api/1/post', {text}, {
        headers: this.jwtHeader(localStorage.getItem('jwt'))
      }).then(() => {
        this.$router.push("/")
        this.$root.$emit("on-notify", "success", "Post successfully published")
      })
          .catch(error => this.$root.$emit("on-write-article-error", error))
    })

    this.$root.$on("on-update", info => {
      if (!localStorage.getItem('jwt')) {
        this.$root.$emit("on-update-error", "Error authenticating.")
        return
      }

      if (this.notBlankAndEmit("on-update-error", ["Name"], info.name)) {
        info.name = info.name.trim()
        info.about = info.about.trim()
        info.city = info.city.trim()
        axios.put('/api/1/user',
            info,
            {
              headers: this.jwtHeader(localStorage.getItem('jwt')),
              params: {
                "name": info.name
              }
            })
            .then(() => this.$root.$emit("on-notify", "success", "Updated successfully"))
            .catch(error => this.$root.$emit("on-update-error", error))
      }
    })

    this.$root.$on("on-get-image", (from, id) => {
      axios.get("/api/1/user/avatar", {params: {"id": id}})
          .then(response => {
            this.$root.$emit(from, response.data)
          })
          .catch(error => {
            if (error.response.status !== 404)
              this.$root.$emit("on-notify", "error", "Server error. Try again later. " + error)
          })
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
