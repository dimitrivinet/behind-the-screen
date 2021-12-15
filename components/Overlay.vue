<template>
  <div v-show="showPortal" ref="portalOverlay" class="portal-overlay">
    <img src="~/static/portal-left.png" class="left" alt="" />
    <img src="~/static/portal-right.png" class="right" alt="" />
    <div id="warpWrapper"><img src="portal-warp.png" class="warp" alt="" /></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { EventBus } from '~/tools/EventBus'

@Component({})
export default class Overlay extends Vue {
  @Watch("showPortal")
  onshowPortalChanged() {
    const portal = this.$refs.portalOverlay as HTMLElement
    portal.style.display = this.showPortal ? 'flex' : 'none'
  }

  showPortal: boolean = true

  created() {
    EventBus.$on('hide-portal', () => {
      this.showPortal = !this.showPortal
    })
  }
}
</script>

<style scoped>
.portal-overlay {
  padding: 0px;
  margin: 0px;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: calc(100% - 5vh);

  position: fixed;
  top: 5vh;

  pointer-events: none;

  background: transparent;
}

img {
  height: 100%;
  position: fixed;
  z-index: 5;
}

img.left {
  left: 0px;
}

img.right {
  right: 0px;
}

img.warp {
  z-index: -1;
  animation: warp;
  animation-iteration-count: infinite;
  animation-duration: 9s;
}

#warpWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: spin;
  animation-iteration-count: infinite;
  animation-duration: 180s;
}

@media screen and (orientation: landscape) {
  img.warp {
    width: 180vw;
    height: auto;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}
@keyframes warp {
  0% {
    margin-left: -5px;
    margin-top: -3px;
    filter: blur(2px);
    transform: rotate(2deg);
  }

  12.5% {
    margin-left: 4px;
    margin-top: 2px;
    filter: blur(4px);
  }

  25% {
    margin-left: -3px;
    margin-top: -2px;
    filter: blur(2px);
    transform: rotate(-1deg);
  }

  37.5% {
    margin-left: 2px;
    margin-top: 4px;
    filter: blur(0px);
  }

  50% {
    margin-left: -4px;
    margin-top: -2px;
    filter: blur(4px);
    transform: rotate(1.5deg);
  }

  62.5% {
    margin-left: 5px;
    margin-top: -5px;
    filter: blur(1px);
  }

  75% {
    margin-left: -4px;
    margin-top: 4px;
    filter: blur(6px);
    transform: rotate(0.5deg);
  }

  87.5% {
    margin-left: 3px;
    margin-top: 3px;
    filter: blur(3px);
  }

  100% {
    margin-left: -2px;
    margin-top: -3px;
    filter: blur(0px);
    transform: rotate(2deg);
  }
}
</style>
