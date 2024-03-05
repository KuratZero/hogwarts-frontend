<script>
import {articlesHandlers, errorEvent, events, jwtHeader, notify} from "@/assets/apies";
import TextFormBlock from "@/components/TextFormBlock.vue";
import axios from "axios";

export default {
  name: "WritePostView",
  computed: {
    events() {
      return events
    }
  },
  data() {
    return {
      labels: ['Text']
    }
  },
  components: {TextFormBlock},
  beforeMount() {
    this.$root.$on(events.writeArticle, (texts) => {
      let [text] = texts
      axios.post(articlesHandlers.writeArticle, {text},
          {headers: jwtHeader(localStorage.getItem('jwt'))})
          .then(() => {
            if (this.$route.path !== '/')
              this.$router.push("/")
            this.$root.$emit(notify.event, notify.success, "Post successfully published.")
          })
          .catch(error => this.$root.$emit(errorEvent(events.writeArticle), error))
    })
  }
}
</script>

<template>
  <TextFormBlock :event="events.writeArticle"
                 header="Write Article" submit="Publish article"
                 :labels="labels" :types="['textarea']"
                 form="form-text"/>
</template>
