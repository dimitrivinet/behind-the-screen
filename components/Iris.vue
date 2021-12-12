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
import { Component, Vue, Ref } from 'vue-property-decorator'
import IrisRunner from '~/tools/Iris'
import { EventBus } from '~/tools/EventBus'

@Component({})
export default class Iris extends Vue {
  @Ref('toggleInference') readonly toggleInferenceButton!: HTMLButtonElement
  @Ref('inputVideo') readonly inputVideo!: HTMLVideoElement

  irisRunner: IrisRunner

  showPerformance: Boolean = false
  showWebcam: Boolean = false

  constructor() {
    super()
    this.irisRunner = new IrisRunner()

    // setup events
    EventBus.$on('toggle-inference', () => {
      this.toggleInference()
    })

    EventBus.$on('show-performance', () => {
      this.showPerformance = !this.showPerformance
    })

    EventBus.$on('show-webcam', () => {
      this.toggleShowWebcam()
    })

    EventBus.$on('calibrate', () => {
      console.log('TODO: call function instead of toggling calibrate')
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
