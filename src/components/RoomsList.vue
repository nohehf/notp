<script setup lang="ts">
import Vue from 'vue'
const props = defineProps({
  now: Boolean,
})
const emptyRoomsNow = ref<string[]>([])
const emptyRoomsAfter = ref<string[]>([])
const lastUpdate = ref<string>()
const refreshState = ref(false)
const apiEndpoint = 'http://localhost:3000'

const currentList = computed(() => props.now ? emptyRoomsNow.value : emptyRoomsAfter.value)
// const ical = ICAL.parse(calTest)
fetch(apiEndpoint, {
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
}).then((response) => { return response.json() })
  .then((data) => {
    console.log(data)
    emptyRoomsNow.value = data.freeNow
    emptyRoomsAfter.value = data.freeAfter
    lastUpdate.value = data.lastUpdate
  })
  .catch(err => alert('error'))
</script>

<template>
  <div>
    <div class="m-auto flex justify-center max-w-150 flex-wrap">
      <div v-for="(room, index) in currentList" :key="index" class="w-18 border-2 opacity-90 border-current p-2 rounded-lg m-2">
        {{ room }}
      </div>
    </div>
    <div>
      <p class="opacity-50">
        last update: {{ lastUpdate ?? "?" }}
      </p>
      <br>
      <!-- <button @click="() => {$forceUpdate}">
        <mdi-refresh :class="refreshState ? 'animate-spin' : '' " />
      </button> -->
    </div>
  </div>
</template>
