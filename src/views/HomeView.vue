<script>
import axios from "axios"
export default {
  name: 'HomeView',
  data() {
    return {
      posts: [
        // {
        //   id: 1,
        //   time: 'five seconds ago',
        //   text: 'Hello, my name scripserit tibique veritus interdum intellegebat tractatos saepe nunc nostra nostra ridiculus graecis enim inani imperdiet elaboraret has mucius purus repudiandae feugait mattis animal fusce contentiones augue efficitur pellentesque epicurei consetetur animal quod facilisis eleifend ad iudicabit interesset mutat possim utamur assueverit consetetur sonet adversarium ornare nonumy consetetur conubia ridens potenti quis tacimates audire mauris mentitum ei legimus vix donec accumsan leo evertitur justo facilisis tation percipit ornatus verterem senectus impetus reque omnesque ex conceptam adolescens contentiones aperiri expetendis putent ligula ius solum vocibus vestibulum ne arcu duo pri semper dolore aliquid quas adhuc hac suas elementum aliquip deserunt possim viverrais Dambldor',
        //   user: {nick: 'dambldor', name: 'Albus Fon Dambldor'}
        // },
        // {id: 2, time: 'ten years age', text: 'Hello, my name is Garry', user: {nick: 'garry', name: 'Harry Potter'}}
      ]
    }
  },
  beforeMount() {
    axios.get("/api/1/posts")
        .then(response => this.posts = response.data)
        .catch(() => {
          this.$root.$emit("on-notify", "error", "Server error. Try again later.")
        })
  }
}
</script>

<template>
  <main>
    <article v-for="post in posts" v-bind:key="post.id">
      <div class="left">
        <router-link :to="'/user/' + post.user.login">
          <div class="ico">
            <img :src="'/icoes/' + post.user.login + '.jpg'" :alt="post.user.login + ' ico'">
          </div>
        </router-link>
      </div>
      <div class="right">
        <div class="person">
          <router-link :to="'/user/' + post.user.login">
          <span class="person-name">
            {{ post.user.name }}
          </span>
          </router-link>
          <span class="person-nick">
            @{{ post.user.login }}
          </span>
          <span class="time">
             · {{ post.time }}
          </span>
        </div>
        <div class="body">{{ post.text }}</div>
      </div>
      <div class="footer">
        <span>Like </span>
        <span>Comment</span>
      </div>
    </article>
  </main>
</template>
