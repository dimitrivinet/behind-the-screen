<template>
  <div class="headerButton">
    <img src="~/static/hamburger.png" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Menu extends Vue {}
</script>

<style scoped>
.headerButton {
  height: 5rem;
  width: 5rem;
}

img {
  width: 90%;
  height: 90%;
  padding: 5% 0;

  -webkit-filter: invert(1);
  filter: invert(1);
}
</style>
