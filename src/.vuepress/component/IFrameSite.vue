<script setup lang="ts">
import {defineProps} from "vue"

const prop = defineProps<{ site: string }>()

</script>

<template>
  <iframe :src="prop.site" style="width: 100%;height: 500px;"
          frameborder="0"></iframe>
</template>

<style scoped>

</style>