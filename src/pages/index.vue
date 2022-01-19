<script setup lang="ts">

const now = ref(true)

const active = 'm-2 w-20 border-2 border-green-500 rounded-lg p-2'
const inactive = 'm-2 w-20 border border-gray-500/50 rounded-lg p-2'

const { t } = useI18n()
</script>

<template>
  <div>
    <p class="text-6xl">
      <emojione:tear-off-calendar class="inline-block" />
    </p>
    <p class="mb-4">
      <a rel="noreferrer" href="https://github.com/nohehf/notp" target="_blank" class="text-4xl">
        notp ?
      </a>
    </p>

    <button :class="now ? active : inactive" @click="()=>{now = true}">
      <p class="text-xl">
        <mdi-timer-outline class="inline-bloc" />
        Now
      </p>
    </button>
    <button :class="now ? inactive : active" @click="()=>{now = false}">
      <p class="text-xl">
        <mdi-numeric-positive-1 class="inline-bloc" />
        <br>
        Next
      </p>
    </button>
    <p class="mt-4">
      <em class="opacity-75">{{ (now ? t('currently') : t('plustwo')) + ' @N7:' }}</em>
    </p>
    <rooms-list :now="now" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
