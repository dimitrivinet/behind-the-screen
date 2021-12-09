<template>
  <div class="container">
    <video
      ref="inputVideo"
      class="hideVideo"
      width="350"
      height="255"
      controls
    ></video>
    <!-- <button type="button" @click="toggleInferenceFlag()">
      Toggle Inference
    </button> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import IrisRunner from '~/tools/iris'

@Component({})
export default class Iris extends Vue {
  @Ref('toggleInference') readonly toggleInferenceButton!: HTMLButtonElement
  @Ref('inputVideo') readonly inputVideo!: HTMLVideoElement

  irisRunner: IrisRunner

  constructor() {
    super()
    this.irisRunner = new IrisRunner()
  }

  mounted() {
    this.inputVideo.style.display = 'none'
    this.irisRunner.start(this.inputVideo)
  }

  toggleInferenceFlag() {
    this.irisRunner.toggleInferenceFlag()
  }
}
</script>

<style scoped>
.hideVideo {
  display: block;
  z-index: 999;
  margin-top: 10px;
  margin-left: 10px;
}
</style>
