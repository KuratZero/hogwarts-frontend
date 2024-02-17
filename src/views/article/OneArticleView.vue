<script>
import ArticlesBlock from "@/components/ArticlesBlock.vue";
import axios from "axios";

export default {
  name: "OnePostView",
  components: {ArticlesBlock},
  props: ["user"],
  data() {
    return {
      article: null,
      status: "Loading..."
    }
  },
  beforeMount() {
    axios.get('/api/1/post/' + this.$route.params.id)
        .then(response => this.article = response.data)
        .catch(error => this.status = error.response.data)
  }
}
</script>

<template>
  <ArticlesBlock class="articles"
                 :status="status"
                 :articles="article ? [article] : null"
                 :user="user"
                 :viewComments="true"
                 :viewAll="false"
  />
</template>