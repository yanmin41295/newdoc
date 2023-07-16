<script setup lang="ts">
import {computed, defineProps, reactive} from "vue";
import {nanoid} from "nanoid";
import CodeBlock from 'vue3-code-block';
import 'highlight.js/styles/base16/onedark.css';

const form = defineProps<{ label: string, template: string }>();

const boxData = reactive({
  id: 'copyBox_' + nanoid(),
  value: "",
})

const text = computed(() => {
  return form.template.replace("{}", boxData.value)
})

</script>

<template>
  <a-form layout="inline">
    <a-form-item :label="form.label">
      <a-input v-model:value="boxData.value"/>
    </a-form-item>
  </a-form>
  <div style="border-style: solid;border-radius: 10px;border-color: #75b8e3 ;margin: 10px">
    <CodeBlock style="padding: 0" :highlightjs="true" :code="text" :theme="false" lang="bash"/>
  </div>
</template>

<style scoped>
@use 'highlight.js/styles/base16/onedark.css';
</style>