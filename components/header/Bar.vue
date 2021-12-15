<template>
  <div class="headerBar">
    <h1>Behind The Screen</h1>
    <HeaderButton ref="headerButton" @click.native="toggleMenu" />
    <HeaderMenu v-if="showMenu" ref="headerMenu"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class HeaderBar extends Vue {
  showMenu: boolean = false

  toggleMenu() {
    this.showMenu = !this.showMenu
  }
}
</script>

<style scoped>
.headerBar {
  padding: 0 10rem;

  height: 5vh;
  z-index: 100;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: #434957;
  color: #E5E5E5;
}

h1 {
  margin: 0;
  margin-left: 1rem;
  padding: 0;

  font-size: 2.6rem;
}
</style>
