<script setup>
defineProps({
  progress: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <el-progress :percentage="progress" />
</template>
