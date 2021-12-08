<template>
  <div class="container">
    <video ref="input_video" width="1%" height="1%"></video>
    <canvas
      class="output_canvas"
      ref="output_canvas"
      width=1300rem
      height=800rem
    ></canvas>
  </div>
</template>
<script>
import {
  Holistic,
  POSE_CONNECTIONS,
  FACEMESH_TESSELATION,
  HAND_CONNECTIONS,
} from '@mediapipe/holistic'
import { Camera } from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'

export default {
  name: 'HolisticModel',
  data: () => {
    return {
      number: null,
      ctx: null,
      width: null,
      height: null,
    }
  },
  computed: {
    inputVideo() {
      return this.$refs.input_video
    },
  },
  mounted() {
    this.ctx = this.$refs.output_canvas.getContext('2d')
    this.init()
  },
  methods: {
    onResults(results) {
      const canvasElement = this.$refs.output_canvas
      this.ctx.save()
      this.ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
      //   this.ctx.drawImage(
      //     results.segmentationMask,
      //     0,
      //     0,
      //     canvasElement.width,
      //     canvasElement.height
      //   )

      // Only overwrite existing pixels.
      this.ctx.globalCompositeOperation = 'source-in'
      this.ctx.fillStyle = '#00FF00'
      this.ctx.fillRect(0, 0, canvasElement.width, canvasElement.height)

      // Only overwrite missing pixels.
      this.ctx.globalCompositeOperation = 'destination-atop'
      this.ctx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      )

      this.ctx.globalCompositeOperation = 'source-over'
      drawConnectors(this.ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 4,
      })
      drawLandmarks(this.ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 2,
      })
      drawConnectors(this.ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
        color: '#C0C0C070',
        lineWidth: 1,
      })
      drawConnectors(this.ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: '#CC0000',
        lineWidth: 5,
      })
      drawLandmarks(this.ctx, results.leftHandLandmarks, {
        color: '#00FF00',
        lineWidth: 2,
      })
      drawConnectors(this.ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: '#00CC00',
        lineWidth: 5,
      })
      drawLandmarks(this.ctx, results.rightHandLandmarks, {
        color: '#FF0000',
        lineWidth: 2,
      })
      this.ctx.restore()
    },
    init() {
      const holistic = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
        },
      })
      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
      holistic.onResults(this.onResults)

      const camera = new Camera(this.inputVideo, {
        onFrame: async () => {
          await holistic.send({ image: this.inputVideo })
        },
        width: 1280,
        height: 720,
      })
      camera.start()
    },
  },
}
</script>
