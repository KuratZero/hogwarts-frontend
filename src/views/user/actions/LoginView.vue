<script>
export default {
  name: "LoginView",
  data: function () {
    return {
      login: "",
      password: "",
      error: ""
    }
  },
  methods: {
    onLogin() {
      this.$root.$emit("on-login", 'login', this.login, this.password);
    }
  },
  beforeMount() {
    this.$root.$on("on-login-validation-error", (error) => this.error = error);
  }
}
</script>

<template>
  <div class="enter form-box">
    <div class="header">Log In</div>
    <div class="body">
      <form @submit.prevent="onLogin">
        <div class="field">
          <div class="name">
            <label for="login">Login</label>
          </div>
          <div class="value">
            <input id="login" name="login" type="text" v-model="login"/>
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
        <div class="field error">{{ error }}</div>
        <div class="button-field">
          <input type="submit" value="Login">
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>