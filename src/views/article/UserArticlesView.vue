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
      status: "Loading..."
    }
  },
  beforeMount() {
    axios.get("/api/1/posts/" + this.$route.params.name)
        .then(response => this.articles = response.data)
        .catch(error => this.status = error.response.data)
  }
}
</script>

<template>
  <ArticlesBlock class="articles"
                 :status="status"
                 :user="user"
                 :articles="articles"
                 :viewComments="false"
                 :viewAll="true"
  />
</template>
