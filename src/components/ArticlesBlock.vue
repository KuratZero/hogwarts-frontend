<script>
import axios from "axios";
import {watch} from "vue";
import {articlesHandlers, errorEvent, events, jwtHeader, notify, usersHandlers} from "@/assets/apies";
import CommentsBlock from "@/components/CommentsBlock.vue";
import OneArticleBlock from "@/components/OneArticleBlock.vue";
import TextFormBlock from "@/components/TextFormBlock.vue";

export default {
  name: "ArticlesBlock",
  computed: {
    events() {
      return events
    }
  },
  components: {TextFormBlock, OneArticleBlock, CommentsBlock},
  props: ["viewAll", "viewComments", "articles", "status", "user"],
  data() {
    return {
      images: {},
      maxWords: 500
    }
  },
  methods: {
    updateAvatars() {
      if (!this.articles)
        return

      for (let i = 0; i < this.articles.length; i++) {
        axios.get(usersHandlers.avatar, {params: {"id": this.articles[i].user.id}})
            .then(response => this.$set(this.images, this.articles[i].user.login, response.data))
            .catch(error => {
              if (error.response.status !== 404)
                this.$root.$emit("on-notify", "error", error.response.data)
            })
      }
    }
  },
  beforeMount() {
    this.updateAvatars()

    this.$root.$on(events.writeComment, (id, texts) => {
      let [text] = texts
      axios.post(articlesHandlers.writeComment + id, {text},
          {headers: jwtHeader(localStorage.getItem('jwt'))})
          .then(() => {
            this.$root.$emit(notify.event, notify.success, "Comment published.")
            this.$root.$emit(events.updateArticles)
          })
          .catch(error =>
              this.$root.$emit(errorEvent(events.writeComment), error.response.data))
    })
  },
  created() {
    watch(
        () => this.articles,
        () => this.updateAvatars()
    )
  }
}
</script>

<template>
  <div v-if="articles" class="articles">
    <div v-if="articles.length === 0">
      No one articles found.
    </div>
    <div class="article-comment" v-for="article in articles" v-bind:key="article.id">
      <OneArticleBlock :article="article" :user="user" :image="images[article.user.login]"
                       :viewAll="viewAll" :viewComments="viewComments"/>

      <TextFormBlock v-if="viewComments && user"
                     :event="events.writeComment"
                     header="Write comment" submit="Publish"
                     :labels="['Text comment']"
                     :types="['textarea']"
                     form="form-text" :info="article.id"/>

<!--      {{ article.comments }}-->

      <CommentsBlock v-if="viewComments" :article="article" :user="user"/>
    </div>
  </div>

  <div v-else class="status-field">
    {{ status }}
  </div>
</template>
