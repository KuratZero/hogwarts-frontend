<script>
export default {
  name: "CommentsBlock",
  props: ["article", "user"],
  data() {
    return {
      images: []
    }
  }
}
</script>

<template>
  <div class="comments">
    <div v-if="article.comments || article.comments.length === 0">
      No one comments found
    </div>
    <div v-else class="comment" v-for="comment in article.comments" v-bind:key="comment.id">
      <div class="left">
        <router-link :to="'/user/' + comment.user.login">
          <div class="ico">
            <img v-if="!images[comment.user.name]" src="../../public/icoes/load.gif"
                 :alt="comment.user.login + ' ico'"/>

            <img v-else :src="images[comment.user.name]" :alt="comment.user.login + ' ico'"/>
          </div>
        </router-link>
      </div>

      <div class="right">
        <div class="person">

          <router-link :to="'/user/' + comment.user.login">
          <span class="person-name">
            {{ comment.user.name }}
          </span>
          </router-link>

          <span class="person-nick">
            @{{ comment.user.login }}
          </span>

          <span class="time">
             · {{ formatTimeAgo(comment.creationTime) }}
          </span>

        </div>

        <div class="body">
          <div class="comment-body-text">{{ comment.text }}</div>
        </div>
      </div>

      <div class="footer">
        <span>Like </span>
        <a v-if="user && user.id === comment.user.id" @click="onDeleteComment(comment.id)">Delete</a>
      </div>
    </div>
  </div>
</template>
