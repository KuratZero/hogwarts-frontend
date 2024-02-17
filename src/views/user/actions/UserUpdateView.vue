<script>
import axios from "axios";
import {errorEvent, events, jwtHeader, notify, usersHandlers} from "@/assets/apies";

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
      this.$root.$emit(events.getImage, 'user-update-image', personId)
    },

    onUpdate() {
      this.$root.$emit(events.updateInfo, this.info)
    },

    uploadImage(event) {
      if (!localStorage.getItem("jwt")) {
        this.$root.$emit(notify.event, notify.error, "You have to authorize")
        return;
      }

      let data = new FormData();
      data.append('file', event.target.files[0]);

      axios.put(usersHandlers.avatar, data,
          {headers: jwtHeader(localStorage.getItem("jwt"))}
      ).then(() => {
        this.$root.$emit(notify.event, notify.success, "Uploaded image successfully!")
        this.updateImage(this.person.id)
      }).catch(error => this.$root.$emit(notify.event, notify.error, "Error: " + error.response.data))
    },

    deleteImage() {
      if (!localStorage.getItem("jwt")) {
        this.$root.$emit(notify.event, notify.error, "You have to authorize")
        return;
      }

      axios.delete(usersHandlers.avatar, {headers: jwtHeader(localStorage.getItem("jwt"))})
          .then(() => {
            this.$root.$emit(notify.event, notify.success, "Avatar deleted successfully!")
            this.updateImage(this.person.id)
          })
          .catch(error => this.$root.$emit(notify.event, notify.error, "Error: " + error.response.data))
    }
  },
  beforeCreate() {
    this.person = null

    axios.get(usersHandlers.get, {params: {"login": this.$route.params.name}})
        .then(response => {
          this.person = response.data

          if (!this.isOwner) {
            this.$root.$emit(notify.event, notify.message, "You are not the owner")
            this.$router.push('/')
            return;
          }

          if (this.person.info)
            this.info = this.person.info

          this.info.name = this.person.name
          this.updateImage(this.person.id)

        })
        .catch(error => {
          this.$root.$emit(notify.event, notify.error, error.response.data)
          this.$router.push('/')
        })
  },
  beforeMount() {
    this.$root.$on('user-update-image', image => this.image = image)
    this.$root.$on(errorEvent(events.updateInfo), error => this.error = error)
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
          <input type="file" accept="image/*" @change="uploadImage($event)">
          <span>Update image</span>
        </label>
      </form>
      <form class="delete-button" @submit.prevent="deleteImage">
        <input type="submit" value="Delete avatar">
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