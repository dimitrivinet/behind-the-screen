import Stats from 'stats.js'
import {
  FaceLandmarksPackage,
  load,
  SupportedPackages,
} from '@tensorflow-models/face-landmarks-detection'
import '@tensorflow/tfjs-backend-webgl'
import { Camera } from '@mediapipe/camera_utils'
import { EventBus } from '~/tools/EventBus'
import * as IrisMaths from '~/tools/IrisMaths'

interface InputData {
  image: HTMLVideoElement
}

class IrisRunner {
  stats: Stats

  inferenceFlag: boolean = false
  model: FaceLandmarksPackage | null = null
  width: number
  height: number

  constructor(stats: Stats, width = 1280, height = 720) {
    this.stats = stats

    this.width = width
    this.height = height

    // load model
    load(SupportedPackages.mediapipeFacemesh).then((model) => {
      this.model = model
      // this.camera.start()
    })
  }

  start(inputVideo: HTMLVideoElement) {
    const camera = new Camera(inputVideo, {
      onFrame: async () => {
        this.stats.begin()
        if (this.inferenceFlag) await this.runFrame({ image: inputVideo })
        this.stats.end()
      },
      width: this.width,
      height: this.height,
    })
    camera.start()
  }

  async runFrame(data: InputData) {
    if (this.model === null) return
    const faces = await this.model.estimateFaces({ input: data.image })
    this.processFaces(faces)
  }

  processFaces(faces: any) {
    // console.log(faces)
    if (faces.length === 0) return

    // const annotations = faces[0].annotations
    const bbox = faces[0].boundingBox

    const facePosition = IrisMaths.faceCenter(bbox)

    // const toMoveX = this.normalizeAnnotations(facePosition.horizontal.center, this.width, 0.25)
    // const toMoveY = this.normalizeAnnotations(facePosition.vertical.center, this.height, 0.25)

    // const noseAngle = IrisMaths.noseAngle(facePosition, [
    //   annotations.noseTip[0][0],
    //   annotations.noseTip[0][1],
    // ])

    // const toMoveRoll = noseAngle[1] * 10
    // const toMovePitch = -noseAngle[0]
    // console.log(toMoveRoll * 100, toMovePitch * 100)


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
