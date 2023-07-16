<script setup lang="ts">

import {onMounted, reactive} from "vue";
import {service} from "../util/request";
import {nanoid} from "nanoid";

const umlBox = reactive({
  id: nanoid(),
  data: {
    name: "",
    text: "",
    images: []
  }
})

onMounted(async () => {
  let element = document.getElementById(umlBox.id);
  if (element === null) {
    return;
  }
  let result = await service.request({
    url: "render/svg",
    method: "post",
    data: {
      name: "",
      text: element.innerText,
    }
  });
  umlBox.data = result.data
})

</script>

<template>
  <div>
    <div v-show="false" :id="umlBox.id">
      <slot></slot>
    </div>
    <div v-for="svg in umlBox.data.images" v-html="svg"
         style="border-style: solid;border-color: #75b8e3;border-radius: 10px;padding: 10px;margin: 10px"></div>
  </div>
</template>

<style scoped>


</style>