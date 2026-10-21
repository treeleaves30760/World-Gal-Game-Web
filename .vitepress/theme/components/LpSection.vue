<script setup lang="ts">
defineProps<{ id: string; title: string; en: string; alt?: boolean }>()
</script>

<template>
  <section :id="id" class="lp-section" :class="{ alt }">
    <div class="lp-wrap">
      <div class="lp-head">
        <h2 class="lp-h2">{{ title }}</h2>
        <p class="lp-h2-en">{{ en }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>
