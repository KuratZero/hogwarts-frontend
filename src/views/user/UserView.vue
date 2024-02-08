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

      axios.get("/api/1/user/avatar", {params: {"id": personId}})
          .then(response => {
            if (response.data) {
              this.image = response.data
            }
          })
          .catch(error => this.$root.$emit("on-notify", "error", "Server error. Try again later. " + error))
    },

    updatePerson(personName) {
      this.person = null
      this.error = null
      this.image = null

      axios.get("/api/1/user", {params: {"login": personName}})
          .then(response => {
            if (response.data) {
              this.person = response.data
              this.updateImage(this.person.id)
            } else {
              this.error = "Not found such user."
            }
          })
          .catch(error => this.error = "Server error. Try again later. " + error)


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
          About: {{person.info.about}}
          <br/>
          City: {{person.info.city}}
        </div>
        <div class="info" v-else>
          Nothing here
        </div>
      </div>

      <div class="footer">Likes, Posts</div>

    </div>
    <h2 v-if="this.error">{{ error }}</h2>
  </div>
</template>

<style scoped>

</style>