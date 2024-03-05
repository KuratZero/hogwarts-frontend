<script>
import ArticlesBlock from "@/components/ArticlesBlock.vue";
import axios from "axios";
import {events} from "@/assets/apies";

export default {
  name: "OnePostView",
  computed: {
    events() {
      return events
    }
  },
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
  <div class="one-article">
    <ArticlesBlock class="articles"
                   :status="status"
                   :articles="article ? [article] : null"
                   :user="user"
                   :viewComments="true"
                   :viewAll="false"
    />
  </div>
</template>