import Stats from 'stats.js'
import {
  FaceLandmarksPackage,
  load,
  SupportedPackages,
} from '@tensorflow-models/face-landmarks-detection'
import '@tensorflow/tfjs-backend-webgl'

// import { FaceDetection } from '@mediapipe/face_detection'

import { Camera } from '@mediapipe/camera_utils'
import { EventBus } from '~/tools/EventBus'
import * as IrisMaths from '~/tools/IrisMaths'

interface InputData {
  image: HTMLVideoElement
}

class IrisRunner {
  inferenceFlag: boolean = false

  stats: Stats

  model: FaceLandmarksPackage | null = null
  width: number
  height: number

  // faceDetection: FaceDetection

  constructor(stats: Stats, width = 1280, height = 720) {
    this.stats = stats

    this.width = width
    this.height = height

    // load model
    load(SupportedPackages.mediapipeFacemesh).then((model) => {
      this.model = model
    })

    // this.faceDetection = new FaceDetection({
    //   locateFile: (file) => {
    //     return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
    //   },
    // })
    // this.faceDetection.setOptions({
    //   minDetectionConfidence: 0.5,
    // })

    // this.faceDetection.onResults((results) => {
    //   this.processFaces(results)
    // })
  }

  start(inputVideo: HTMLVideoElement) {
    const camera = new Camera(inputVideo, {
      onFrame: async () => {
        this.stats.begin()
        if (this.inferenceFlag) {
            if (!(this.model === null)) await this.runFrame({ image: inputVideo })
            // await this.faceDetection.send({ image: inputVideo })
          }
        this.stats.end()
      },
      width: this.width,
      height: this.height,
    })

    camera.start()
  }

  async runFrame(data: InputData) {
    const faces = await this.model!.estimateFaces({ input: data.image })
    this.processFaces(faces)
  }

  processFaces(faces: any) {
    if (faces.length === 0) return

    // const annotations = faces[0].annotations
    const bbox = faces[0].boundingBox

    const facePosition = IrisMaths.faceCenter(bbox)

    const toMovePitch = this.normalizeAnnotations(facePosition.horizontal.center, this.width, 5)
    const toMoveRoll = -this.normalizeAnnotations(facePosition.vertical.center, this.height, 5)

    // EventBus.$emit('move-camera', 'x', toMoveX)
    // EventBus.$emit('move-camera', 'y', toMoveY)
    EventBus.$emit('move-camera', 'roll', toMoveRoll)
    EventBus.$emit('move-camera', 'pitch', toMovePitch)
  }

  toggleInferenceFlag() {
    this.inferenceFlag = !this.inferenceFlag
  }

  normalizeAnnotations(annotation: number, max: number, scale: number = 10) {
    let normalized = annotation - max / 2
    normalized = normalized / (max / 2)
    normalized = normalized / scale

    return normalized
  }
}

export default IrisRunner
