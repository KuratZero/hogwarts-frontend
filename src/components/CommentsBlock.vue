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
  </div>
</template>
