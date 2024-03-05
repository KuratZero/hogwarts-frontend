<script>
import {articlesHandlers, events, jwtHeader, notify} from "@/assets/apies";
import axios from "axios";

export default {
  props: ["user", "article", "viewAll", "viewComments", "image"],
  data() {
    return {
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
    onDelete() {
      axios.delete(articlesHandlers.deleteArticle + this.article.id,
          {headers: jwtHeader(localStorage.getItem('jwt'))}
      ).then(() => {
        this.$root.$emit(notify.event, notify.success, "Article deleted.")
        if (this.$route.path !== '/')
          this.$router.push("/")
        this.$root.$emit(events.updateArticles)
      }).catch(error => this.$root.$emit('on-notify', "error", error.response.data))
    }
  }
}
</script>

<template>
  <article>
    <div class="left">
      <router-link :to="'/user/' + article.user.login">
        <div class="ico">
          <img v-if="!image" src="../../public/icoes/load.gif"
               :alt="article.user.login + ' ico'"/>

          <img v-else :src="image" :alt="article.user.login + ' ico'"/>
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
</template>
