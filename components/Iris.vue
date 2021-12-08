<script>
import {
  load,
  SupportedPackages,
} from '@tensorflow-models/face-landmarks-detection'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-cpu'
import { Camera } from '@mediapipe/camera_utils'

export default {
  name: 'IrisDetection',
  data: () => {
    return {
      run_inference: false,
      video: null,
      model: null,
    }
  },
  computed: {
    inputVideo() {
      return this.$refs.input_video
    },
  },
  mounted() {
    const toggleInferenceButton = this.$refs.toggle_inference
    toggleInferenceButton.onclick = () => {
      console.log("aaa")
      console.log(this.run_inference)
      this.run_inference = !this.run_inference
    }

    const camera = new Camera(this.inputVideo, {
      onFrame: async () => {
        if (this.run_inference) await this.run_frame({ image: this.inputVideo })
      },
      width: 1280,
      height: 720,
    })

    load(SupportedPackages.mediapipeFacemesh).then((model) => {
      this.model = model
      camera.start()
    })
  },
  methods: {
    async run_frame(data) {
      const faces = await this.model.estimateFaces({ input: data.image })
      console.log(faces)
    },
  },
}
</script>

<template>
  <div class="container">
    <video ref="input_video" width="1%" height="1%"></video>
    <button ref="toggle_inference" type="button">Toggle Inference</button>
  </div>
</template>
