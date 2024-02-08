<script>
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
    onRegister() {
      this.$root.$emit("on-register", this.name, this.login, this.password, this.passwordRe);
    }
  },
  beforeMount() {
    this.$root.$on("on-register-validation-error", (error) => this.error = error);
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