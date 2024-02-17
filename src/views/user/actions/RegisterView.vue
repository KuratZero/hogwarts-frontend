<script>
import {errorEvent, events, notify, usersHandlers} from "@/assets/apies";
import axios from "axios";

export default {
  name: "RegisterView",
  data: function () {
    return {
      name: "",
      login: "",
      password: "",
      passwordRe: "",
      error: ""
    }
  },
  methods: {
    notBlank(names, ...texts) {
      for (let i = 0; i < names.length; i++) {
        if (texts[i].toString() === "") {
          this.error = names[i] + " is required."
          return false
        }
      }
      return true
    },

    onRegister() {
      if (!this.notBlank(['Name', 'Login', 'Password', 'Repeat Password'],
          this.name, this.login, this.password, this.passwordRe)) {
        return;
      }

      if (this.password.trim() !== this.passwordRe.trim()) {
        this.$root.$emit(errorEvent(events.register), "Passwords are not the same.")
        return;
      }

      axios.post(usersHandlers.register, {
        "login": this.login.trim(),
        "name": this.name.trim(),
        "password": this.password.trim()
      }).then(() => {
        this.$root.$emit(notify.event, notify.success, "You have been registered!")
        this.$root.$emit(events.login, 'register', this.login.trim(), this.password.trim())
      }).catch(error => this.error = error.response.data)
    }
  }
}
</script>

<template>
  <div class="enter form-box">
    <div class="header">Register</div>
    <div class="body">
      <form @submit.prevent="onRegister">
        <div class="field">
          <div class="name">
            <label for="login">Name</label>
          </div>
          <div class="value">
            <input autofocus id="name" name="name" v-model="name"/>
          </div>
        </div>
        <div class="field">
          <div class="name">
            <label for="login">Login</label>
          </div>
          <div class="value">
            <input autofocus id="login" name="login" v-model="login"/>
          </div>
        </div>
        <div class="field">
          <div class="name">
            <label for="password">Password</label>
          </div>
          <div class="value">
            <input id="password" name="password" type="password" v-model="password"/>
          </div>
        </div>
        <div class="field">
          <div class="name">
            <label for="password-re">Repeat password</label>
          </div>
          <div class="value">
            <input id="password-re" name="password-re" type="password" v-model="passwordRe"/>
          </div>
        </div>
        <div class="field error">{{ error }}</div>
        <div class="button-field">
          <input type="submit" value="Register">
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>