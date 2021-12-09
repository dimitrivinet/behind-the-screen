import {
  FaceLandmarksPackage,
  load,
  SupportedPackages,
} from '@tensorflow-models/face-landmarks-detection'
import '@tensorflow/tfjs-backend-webgl'
import { Camera } from '@mediapipe/camera_utils'

interface InputData {
  image: HTMLVideoElement
}

class IrisRunner {
  inferenceFlag: boolean = false
  model: FaceLandmarksPackage | null = null

  constructor() {
    // load model
    load(SupportedPackages.mediapipeFacemesh).then((model) => {
      this.model = model
      // this.camera.start()
    })
  }

  start(inputVideo: HTMLVideoElement) {
    const camera = new Camera(inputVideo, {
      onFrame: async () => {
        if (this.inferenceFlag) await this.runFrame({ image: inputVideo })
      },
      width: 1280,
      height: 720,
    })
    camera.start()
  }

  async runFrame(data: InputData) {
    if (this.model === null) return
    const faces = await this.model.estimateFaces({ input: data.image })
    this.processFaces(faces)
  }

  processFaces(faces: any) {
    console.log(faces)
  }

  toggleInferenceFlag() {
    this.inferenceFlag = !this.inferenceFlag
  }
}

export default IrisRunner
