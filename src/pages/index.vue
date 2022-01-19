<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const user = useUserStore()
const name = ref(user.savedName)

const active = 'm-2 w-20 border-2 border-green-500 rounded-lg p-2'
const inactive = 'm-2 w-20 border border-gray-500/50 rounded-lg p-2'

const router = useRouter()
const go = () => {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}

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

    <button :class="active">
      <p class="text-xl">
        <mdi-timer-outline class="inline-bloc" />
        Now
      </p>
    </button>
    <button :class="inactive">
      <p class="text-xl">
        <mdi-numeric-positive-1 class="inline-bloc" />
        <br>
        h +1
      </p>
    </button>
    <p class="mt-4">
      <em class="opacity-75">{{ t('intro.desc') + ' @N7:' }}</em>
    </p>
    <rooms-list :now="false" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
