<script>
import axios from "axios";

export default {
  name: "ArticlesBlock",
  props: ["articles", "user"],
  data() {
    return {
      images: {}
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

    updateImages() {
      for (let i = 0; i < this.articles.length; i++) {
        if (this.images[this.articles[i].user.name]) {
          continue;
        }
        axios.get("/api/1/user/avatar", {params: {"id": this.articles[i].user.id}})
            .then(response => {
              this.$set(this.images, this.articles[i].user.name, response.data)
            })
            .catch(error => {
              if (error.response.status !== 404)
                this.$root.$emit("on-notify", "error", error.response.data)
            })
      }
    }
  },
  beforeMount() {
    this.updateImages()
  }
}
</script>

<template>
  <div class="articles">
    <div v-if="articles.length === 0">
      Not found no one post.
    </div>
    <article v-for="article in articles" v-bind:key="article.id">
      <div class="left">
        <router-link :to="'/user/' + article.user.login">
          <div class="ico">
            <img v-if="!images[article.user.name]" src="../../public/icoes/load.gif"
                 :alt="article.user.login + ' ico'"/>
            <img v-else :src="images[article.user.name]" :alt="article.user.login + ' ico'"/>
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
        <div class="body">{{ article.text }}</div>
      </div>
      <div class="footer">
        <span>Like </span>
        <span>Comment </span>
        <span v-if="user && article.user && user.id === article.user.id">Edit or Delete</span>
      </div>
    </article>
  </div>
</template>
