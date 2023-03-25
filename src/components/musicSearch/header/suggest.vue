<template>
  <el-button @click="closeSuggest">123</el-button>
</template>

<script>
export default {
  name: "suggest",
  props:['drawer'],
  methods:{
    closeSuggest(){
      this.drawer.SuggestWord.handleClose()
    },

  }
}
</script>

<style scoped>

</style>