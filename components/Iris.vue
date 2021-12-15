<template>
  <div class="container">
    <video
      v-show="showWebcam"
      ref="inputVideo"
      class="inputVideo"
      width="640"
      height="480"
    ></video>
  </div>
</template>

<script lang="ts">
import Stats from 'stats.js'
import { Component, Vue, Ref } from 'vue-property-decorator'

import IrisRunner from '~/tools/Iris'
import { EventBus } from '~/tools/EventBus'

@Component({})
export default class Iris extends Vue {
  @Ref('toggleInference') readonly toggleInferenceButton!: HTMLButtonElement
  @Ref('inputVideo') readonly inputVideo!: HTMLVideoElement

  statsShown: boolean = false
  stats: Stats
  irisRunner: IrisRunner

  showPerformance: Boolean = false
  showWebcam: Boolean = false

  constructor() {
    super()
    this.stats = new Stats()
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom

    EventBus.$on('show-performance', () => {
      if (this.statsShown) document.body.removeChild(this.stats.dom)
      else document.body.appendChild(this.stats.dom)

      this.statsShown = !this.statsShown
    })

    this.irisRunner = new IrisRunner(this.stats)

    // setup events
    EventBus.$on('toggle-inference', () => {
      this.toggleInference()
    })

    EventBus.$on('show-webcam', () => {
      this.toggleShowWebcam()
    })
  }

  mounted() {
    this.irisRunner.start(this.$refs.inputVideo as HTMLVideoElement)
  }

  toggleInference() {
    this.irisRunner.toggleInferenceFlag()
  }

  toggleShowWebcam() {
    this.showWebcam = !this.showWebcam
  }
}
</script>

<style scoped>
.inputVideo {
  position: fixed;
  left: 1rem;
  top: 1rem;
  z-index: 90;

  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
</style>
