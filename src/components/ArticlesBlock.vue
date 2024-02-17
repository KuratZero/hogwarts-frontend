<script>
import axios from "axios";
import {watch} from "vue";
import {articlesHandlers, events, jwtHeader, notify, usersHandlers} from "@/assets/apies";
import CommentsBlock from "@/components/CommentsBlock.vue";

export default {
  name: "ArticlesBlock",
  components: {CommentsBlock},
  props: ["viewAll", "viewComments", "articles", "status", "user"],
  data() {
    return {
      images: {},
      likes: {},
      maxWords: 500
    }
  },
  methods: {
    formatTimeAgo(timestamp) {
      const diff = new Date(Date.now() - new Date(timestamp));
      const timesFormat = [
        ["years", "FullYear"],
        ["months", "Month"],
        ["days", "Date"],
        ["hours", "Hours"],
        ["minutes", "Minutes"],
        ["seconds", "Seconds"]
      ]
      for (let timeFormat of timesFormat) {
        let time = diff["getUTC" + timeFormat[1]]()
        if (timeFormat[0] === "years") {
          time -= 1970
        } else if (timeFormat[0] === "days") {
          time -= 1
        }
        if (time > 0) {
          return time + " " + timeFormat[0] + " ago"
        }
      }
      return "just now"
    },

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
    },

    onDelete(id) {
      if (!localStorage.getItem('jwt')) {
        this.$root.$emit(notify.event, notify.error, "Login into site")
        return;
      }

      axios.delete(articlesHandlers.deleteArticle + id,
          {headers: jwtHeader(localStorage.getItem('jwt'))}
      ).then(() => {
        this.$root.$emit(notify.event, notify.success, "Article deleted.")
        if (this.$route.path !== '/')
          this.$router.push("/")
        this.$root.$emit(events.updateArticles)
      }).catch(error => this.$root.$emit('on-notify', "error", error.response.data))
    }
  },
  beforeMount() {
    this.updateAvatars()
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
      <article>
        <div class="left">
          <router-link :to="'/user/' + article.user.login">
            <div class="ico">
              <img v-if="!images[article.user.login]" src="../../public/icoes/load.gif"
                   :alt="article.user.login + ' ico'"/>

              <img v-else :src="images[article.user.login]" :alt="article.user.login + ' ico'"/>
            </div>
          </router-link>
        </div>

        <div class="right">
          <div class="person">

            <router-link :to="'/user/' + article.user.login">
          <span class="person-name">
            {{ article.user.name }}
          </span>
            </router-link>

            <span class="person-nick">
            @{{ article.user.login }}
          </span>

            <span class="time">
             · {{ formatTimeAgo(article.creationTime) }}
          </span>

          </div>

          <div class="body">
            <div class="article-body-text">
              {{
                article.text.length <= maxWords || !viewAll ? article.text : article.text.substring(0, maxWords) + "..."
              }}
            </div>
            <router-link v-if="viewAll" class="article-body-view" :to="'/post/' + article.id">
              View all
            </router-link>
          </div>
        </div>

        <div class="footer">
          <span>Like </span>
          <router-link v-if="!viewComments" :to="'/post/' + article.id">Comment</router-link>
          <a v-if="user && user.id === article.user.id" @click="onDelete(article.id)">Delete</a>
        </div>
      </article>

      <CommentsBlock v-if="viewComments" :article="article" :user="user"/>
    </div>
  </div>

  <div v-else class="status-field">
    {{ status }}
  </div>
</template>
