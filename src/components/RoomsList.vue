<script setup lang="ts">
const props = defineProps({
  now: Boolean,
})
const emptyRoomsNow = ref<string[]>([])
const emptyRoomsAfter = ref<string[]>([])
const lastUpdate = ref<string>()
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
  <div class="m-auto flex justify-center max-w-150 flex-wrap">
    <div v-for="(room, index) in currentList" :key="index" class="w-18 border-2 border-light-500/50 p-2 rounded-lg m-2">
      {{ room }}
    </div>
    <div>
      <p>
        last update at {{ lastUpdate ?? "?" }}
        <br>
        <button>
          Refresh
        </button>
      </p>
    </div>
  </div>
</template>
