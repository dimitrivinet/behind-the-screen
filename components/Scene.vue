<template>
  <div class="canvas-container">
    <canvas id="renderCanvas" ref="render_canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'

import { BabylonManager } from '~/tools/BabylonManager'
import { EventBus } from '~/tools/EventBus'

@Component({})
export default class Scene extends Vue {
  @Ref('render_canvas') readonly renderCanvas!: HTMLCanvasElement

  babylonManager: BabylonManager | undefined
  debugShown: boolean = false

  mounted() {
    this.babylonManager = new BabylonManager(this.renderCanvas)
    this.babylonManager.start()

    EventBus.$on('move-camera', (axis: string, value: number) => {
      this.babylonManager!.moveCamera(axis, value)
    })

    EventBus.$on('calibrate', () => {
      this.babylonManager!.calibrate()
    })

    EventBus.$on('change-scene', () => {
      this.babylonManager!.nextScene()
    })

    EventBus.$on('show-debug', () => {
      this.babylonManager!.toggleDebug(this.debugShown)
      this.debugShown = ! this.debugShown
    })
  }
}
</script>

<style scoped>
.canvas-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#renderCanvas {
  touch-action: none;
  height: 100%;
  width: 100%;

  /* Remove canvas highlight when clicked */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  outline: none;
}
</style>
