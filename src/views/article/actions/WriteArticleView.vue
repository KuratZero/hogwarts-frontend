<script>
export default {
  name: "WritePostView",
  props: ["user"],
  data() {
    return {
      text: "",
      error: ""
    }
  },
  methods: {
    onWritePost() {
      this.$root.$emit("on-write-article", this.text)
    }
  },
  beforeMount() {
    this.$root.$on("on-write-article-error", error => this.error = error)
  }
}
</script>

<template>
  <div class="write-post form-text">
    <div class="header">Write Post</div>
    <div class="body">
      <form @submit.prevent="onWritePost">
        <div class="textarea">
          <div class="name">
            <label for="text">Text</label>
          </div>
          <div class="value">
            <textarea id="text" name="text" type="text" v-model="text"/>
          </div>
        </div>
        <div class="field error">{{ error }}</div>
        <div class="button-field">
          <input type="submit" value="Publish post">
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>