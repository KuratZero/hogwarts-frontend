<script>
export default {
  name: "HeaderBlock",
  props: ["user"],
  data() {
    return {
      navigation: [
        ["Login", "/login"],
        ["Register", "/register"]
      ]
    }
  },
  methods: {
    onLogout() {
      this.$root.$emit('on-logout');
    }
  }
}
</script>

<template>
  <header>
    <router-link to="/">
      <img src="../assets/logo-hog.png" alt="hogwarts ico">
    </router-link>

    <div class="navbar">
      <nav>
        <router-link to="/">Home</router-link>
        |
        <router-link to="/info">Info</router-link>
        <span v-if="user">
          |
          <router-link to="/writePost">Post</router-link>
        </span>
      </nav>

      <div class="user-login" v-if="!user">
        <router-link to="/login">Login</router-link>
        ·
        <router-link to="/register">Register</router-link>
      </div>
      <div class="user-logout" v-else>
        <router-link :to="'/user/' + user.login" id="person-user-link">{{ user.name }}</router-link>
        ·
        <a @click="onLogout">LogOut</a>
      </div>
    </div>
  </header>
</template>

<style scoped>

</style>