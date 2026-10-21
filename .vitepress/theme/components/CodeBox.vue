<script setup lang="ts">
import type { Seg } from '../highlight'
defineProps<{ title?: string; lines: { segs: Seg[]; indent?: boolean }[] }>()
</script>

<template>
  <figure class="lp-code">
    <figcaption v-if="title" class="lp-code-title">{{ title }}</figcaption>
    <pre class="lp-pre"><code><div v-for="(l, i) in lines" :key="i" :class="{ indent: l.indent }"><span v-for="(s, k) in l.segs" :key="k" :class="s.c">{{ s.t }}</span>{{ l.segs.length ? '' : ' ' }}</div></code></pre>
  </figure>
</template>
