<script>
import axios from "axios";

export default {
  name: "UserView",
  props: ["user"],
  data() {
    return {
      person: null,
      error: null,
      image: null
    }
  },
  computed: {
    isOwner() {
      return this.user && this.person && this.person.id === this.user.id
    }
  }
  ,
  methods: {
    updateImage(personId) {
      this.image = null

      this.$root.$emit("on-get-image", 'user-image', personId)
    },

    updatePerson(personName) {
      this.person = null
      this.error = null
      this.image = null

      axios.get("/api/1/user", {params: {"login": personName}})
          .then(response => {
            this.person = response.data
            this.updateImage(this.person.id)
          })
          .catch(error => this.error = error.response.data)
    }
  },
  created() {
    this.$watch(
        () => this.$route.params.name,
        (newName) => {
          this.updatePerson(newName)
        }
    )
  },
  beforeMount() {
    this.updatePerson(this.$route.params.name)
    this.$root.$on("user-image", image => this.image = image)
  }
}
</script>

<template>
  <div class="user-block">
    <div class="user" v-if="this.person">

      <div class="person">
        <span class="person-name">{{ person.name }}</span>
        <span class="person-nick"> · @{{ person.login }}</span>
      </div>

      <div class="avatar">
        <img v-if="!image" src="../../../public/icoes/load.gif" alt="loading..."/>
        <img v-else :src="image" :alt="'avatar of' + person.name"/>
      </div>

      <div class="body">
        <router-link v-if="isOwner" :to="this.$route.path + '/update'">
          Update info.
        </router-link>
        <div class="info" v-if="person.info">
          About: {{ person.info.about }}
          <br/>
          City: {{ person.info.city }}
        </div>
        <div class="info" v-else>
          Nothing here
        </div>
      </div>

      <div class="footer">
        <router-link :to="'/user/' + person.login + '/posts'">Posts</router-link>
      </div>

    </div>
    <h2 v-if="this.error">{{ error }}</h2>
  </div>
</template>

<style scoped>

</style>