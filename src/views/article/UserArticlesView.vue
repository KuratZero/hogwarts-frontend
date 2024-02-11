<script>
import axios from "axios";
import ArticlesBlock from "@/components/ArticlesBlock.vue";

export default {
  name: "UserPostsView",
  components: {ArticlesBlock},
  props: ["user"],
  data() {
    return {
      articles: null,
      message: "Loading articles..."
    }
  },
  beforeMount() {
    axios.get("/api/1/posts/" + this.$route.params.name)
        .then(response => this.articles = response.data)
        .catch(error => this.message = error.response.data)
  }
}
</script>

<template>
  <ArticlesBlock v-if="articles" :user="user" :articles="articles" clss="articles"/>
  <div v-else>
    {{ message }}
  </div>
</template>
