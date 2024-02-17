<script>
import axios from "axios"
import ArticlesBlock from "@/components/ArticlesBlock.vue";
import {articlesHandlers, events} from "@/assets/apies";

export default {
  name: 'HomeView',
  props: ["user"],
  components: {ArticlesBlock},
  data() {
    return {
      articles: null,
      status: "Loading..."
    }
  },
  methods: {
    updateArticles() {
      axios.get(articlesHandlers.getArticles)
          .then(response => this.articles = response.data)
          .catch(error => this.status = error.response.data)
    }
  },
  beforeMount() {
    this.updateArticles()

    this.$root.$on(events.updateArticles, () => this.updateArticles())
  }
}
</script>

<template>
  <main>
    <ArticlesBlock class="articles"
                   :status="status"
                   :user="user"
                   :articles="articles"
                   :viewComments="false"
                   :viewAll="true"
    />
  </main>
</template>
