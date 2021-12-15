import * as BABYLON from 'babylonjs'
// import 'babylonjs-loaders'

import { createScene as createSceneBall } from '~/tools/scenes/BallAndPlane'
import { createScene as createSceneCubes } from '~/tools/scenes/Cubes.js'
import { createScene as createSceneBottle } from '~/tools/scenes/Bottle.js'
import { createScene as createSceneCastle } from '~/tools/scenes/Castle.js'

interface SceneConfig {
  scene: BABYLON.Scene
  camera: BABYLON.FreeCamera
  offsets: {
    positionOffsetX: number
    positionOffsetY: number
    // rotationOffsetX: number = 0.4636476090008061
    rotationOffsetX: number
    rotationOffsetY: number
  }
}

export class BabylonManager {
  renderCanvas: HTMLCanvasElement
  engine: BABYLON.Engine
  scenes: SceneConfig[]
  sceneIndex: number
  camera!: BABYLON.FreeCamera

  constructor(renderCanvas: HTMLCanvasElement) {
    this.renderCanvas = renderCanvas

    // Load 3D engine
    this.engine = new BABYLON.Engine(this.renderCanvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    })
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio)

    this.scenes = []
    this.sceneIndex = 0

    const ball = createSceneBall(this.engine)
    this.scenes.push({
      scene: ball,
      camera: new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), ball),
      offsets: {
        positionOffsetX: 0,
        positionOffsetY: 5,
        // rotationOffsetX: number = 0.4636476090008061
        rotationOffsetX: 0.46,
        rotationOffsetY: 0,
      },
    })

    const cubes = createSceneCubes(this.engine)
    this.scenes.push({
      scene: cubes,
      camera: new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), cubes),
      offsets: {
        positionOffsetX: 0,
        positionOffsetY: 5,
        // rotationOffsetX: number = 0.4636476090008061
        rotationOffsetX: 0,
        rotationOffsetY: 0,
      },
    })

    const castle: BABYLON.Scene = createSceneCastle(this.engine)
    this.scenes.push({
      scene: castle,
      camera: castle.activeCamera as BABYLON.FreeCamera,
      offsets: {
        positionOffsetX: 0,
        positionOffsetY: 10,
        rotationOffsetX: 0,
        rotationOffsetY: -1.58,
      },
    })

    createSceneBottle(this.engine).then((bottle) => {
      this.scenes.push({
        scene: bottle,
        camera: new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), bottle),
        offsets: {
          positionOffsetX: 0,
          positionOffsetY: 0.1,
          // rotationOffsetX: number = 0.4636476090008061
          rotationOffsetX: 0,
          rotationOffsetY: 0,
        },
      })
    })

    this.camera = this.scenes[this.sceneIndex].camera
    this.setupCamera()

    console.log(this.scenes)
  }

  start() {
    // run the render loop
    // const scene = this.scene
    this.engine.runRenderLoop(() => {
      this.scenes[this.sceneIndex].scene.render()
    })

    // the canvas/window resize event handler
    const engine = this.engine
    window.addEventListener('resize', function () {
      engine.resize()
    })
  }

  moveCamera(axis: string, value: number) {
    // console.log(`position: ${this.camera.position}`)
    // console.log(`rotation: ${this.camera.rotation}`)

    switch (axis) {
      case 'x':
        this.camera.position.x = value + this.scenes[this.sceneIndex].offsets.positionOffsetX
        break

      case 'y':
        this.camera.position.y = value + this.scenes[this.sceneIndex].offsets.positionOffsetY
        break

      case 'z':
        break

      case 'roll':
        this.camera.rotation.x = value + this.scenes[this.sceneIndex].offsets.rotationOffsetX
        break

      case 'pitch':
        this.camera.rotation.y = value + this.scenes[this.sceneIndex].offsets.rotationOffsetY
        break

      case 'yaw':
        break

      default:
        break
    }
  }

  showDebug(): void {
    this.scenes[this.sceneIndex].scene.debugLayer.show()
  }

  hideDebug(): void {
    this.scenes[this.sceneIndex].scene.debugLayer.hide()
  }

  toggleDebug(isDebugShown: boolean): void {
    isDebugShown ? this.hideDebug() : this.showDebug()
  }

  calibrate(): void {
    // position
    this.scenes[this.sceneIndex].offsets.positionOffsetX = this.camera.position.x
    this.scenes[this.sceneIndex].offsets.positionOffsetY = this.camera.position.y

    // rotation
    this.scenes[this.sceneIndex].offsets.rotationOffsetX = this.camera.rotation.x
    this.scenes[this.sceneIndex].offsets.rotationOffsetY = this.camera.rotation.y

    console.log('calibrated')
    console.log(this.scenes[this.sceneIndex].offsets)
  }

  nextScene(): void {
    this.sceneIndex += 1
    this.sceneIndex = this.sceneIndex % this.scenes.length

    this.camera = this.scenes[this.sceneIndex].camera
    this.setupCamera()
  }

  setupCamera(): void {
    this.camera.speed = 0.01
    this.camera.inverseRotationSpeed = 0.01
    this.camera.setTarget(BABYLON.Vector3.Zero())
    this.camera.attachControl(this.renderCanvas, false)

    this.camera.position.x = this.scenes[this.sceneIndex].offsets.positionOffsetX
    this.camera.position.y = this.scenes[this.sceneIndex].offsets.positionOffsetY
    this.camera.rotation.x = this.scenes[this.sceneIndex].offsets.rotationOffsetX
    this.camera.rotation.y = this.scenes[this.sceneIndex].offsets.rotationOffsetY
  }
}
