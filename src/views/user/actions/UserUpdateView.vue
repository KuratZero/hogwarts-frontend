<script>
import axios from "axios";

export default {
  name: "UserUpdateView",
  props: ["user"],
  data() {
    return {
      person: null,
      image: null,
      info: {
        name: "",
        about: "",
        city: ""
      },
      error: ""
    }
  },
  computed: {
    isOwner() {
      return this.user && this.person && this.person.id === this.user.id
    }
  },
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

    onUpdate() {
      this.$root.$emit("on-update", this.info)
    },

    uploadImage(event) {
      let data = new FormData();
      data.append('file', event.target.files[0]);

      axios.put(
          '/api/1/user/avatar',
          data,
          {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem("jwt"),
              'Content-Type': 'image/png'
            }
          }
      ).then(() => {
        this.$root.$emit("on-notify", "success", "Uploaded image successfully!")
        this.updateImage(this.person.id)
      }).catch(error => this.$root.$emit("on-notify", "error", "Error while uploading: " + error))
    }
  },
  beforeCreate() {
    this.person = null

    axios.get("/api/1/user", {params: {"login": this.$route.params.name}})
        .then(response => {
          if (response.data) {
            this.person = response.data
            if (!this.isOwner) {
              this.$root.$emit("on-notify", "message", "You are not the owner")
              this.$router.push('/')
            }
            if (this.person.info) {
              this.info = this.person.info
            }
            this.info.name = this.person.name
            this.updateImage(this.person.id)
          } else {
            this.$root.$emit("on-notify", "error", "Not found such user.")
            this.$router.push('/')
          }
        })
        .catch(() => {
          this.$root.$emit("on-notify", "error", "Server error. Try again later.")
          this.$router.push('/')
        })
  },
  beforeMount() {
    this.$root.$on("on-update-error", error => this.error = error)
  }
}
</script>

<template>
  <div v-if="isOwner" class="update form-box">
    <div class="update-image">
      <img v-if="!image" src="../../../../public/icoes/load.gif" alt="loading..."/>
      <img v-else :src="image" :alt="'avatar of' + person.name"/>
      <form>
        <label class="input-file">
          <input type="file" accept="image/*" @change="uploadImage($event)" id="avatar-input">
          <span>Update image</span>
        </label>
      </form>
    </div>

    <form @submit.prevent="onUpdate">
      <div class="field">
        <div class="name">
          <label for="name">Name</label>
        </div>
        <div class="value">
          <input id="name" name="name" type="text" v-model="info.name"/>
        </div>
      </div>
      <div class="field">
        <div class="name">
          <label for="about">About</label>
        </div>
        <div class="value">
          <input id="about" name="about" type="text" v-model="info.about"/>
        </div>
      </div>
      <div class="field">
        <div class="name">
          <label for="city">City</label>
        </div>
        <div class="value">
          <input id="city" name="city" type="text" v-model="info.city"/>
        </div>
      </div>
      <div class="field error">{{ error }}</div>
      <div class="button-field">
        <input type="submit" value="Update info">
      </div>
    </form>

  </div>
  <div v-else>
    Loading...
  </div>
</template>

<style scoped>

</style>