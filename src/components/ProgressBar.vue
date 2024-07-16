<template>
  <el-progress :percentage="progress" />
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true,
    },
  },
};
</script>