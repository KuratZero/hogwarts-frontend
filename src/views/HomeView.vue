<script>
import axios from "axios"
import ArticlesBlock from "@/components/ArticlesBlock.vue";

export default {
  name: 'HomeView',
  props: ["user"],
  components: {ArticlesBlock},
  data() {
    return {
      articles: null
    }
  },
  beforeMount() {
    axios.get("/api/1/posts")
        .then(response => {
          this.articles = response.data
        })
        .catch(() => {
          this.$root.$emit("on-notify", "error", "Server error. Try again later.")
        })
  }
}
</script>

<template>
  <main>
    <ArticlesBlock v-if="articles" :user="user" :articles="articles"/>
    <div v-else>Loading...</div>
  </main>
</template>
