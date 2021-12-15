import { Engine, Scene, Vector3, FreeCamera, SceneLoader } from 'babylonjs'
// import 'babylonjs-loaders'

import { createScene as createSceneBall } from '~/tools/scenes/BallAndPlane'
// import { createScene as createSceneFish } from '~/tools/scenes/Fish'
import { createScene as createSceneCubes } from '~/tools/scenes/Cubes.js'
import { createScene as createSceneBottle } from '~/tools/scenes/Bottle.js'

interface SceneConfig {
  scene: Scene
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
  engine: Engine
  scenes: Array<SceneConfig>
  sceneIndex: number
  camera!: FreeCamera

  constructor(renderCanvas: HTMLCanvasElement) {
    this.renderCanvas = renderCanvas

    // Load 3D engine
    this.engine = new Engine(this.renderCanvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    })
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio)

    this.scenes = []

    const ball = createSceneBall(this.engine)
    this.scenes.push({
      scene: ball,
      offsets: {
        positionOffsetX: 0,
        positionOffsetY: 5,
        // rotationOffsetX: number = 0.4636476090008061
        rotationOffsetX: 0,
        rotationOffsetY: 0,
      },
    })
    this.sceneIndex = 0

    this.camera = new FreeCamera(
      'camera1',
      new Vector3(0, 5, -10),
      this.scenes[this.sceneIndex].scene
    )
    // this.camera.inputs.clear()
    // console.log(this.camera.inputs)
    this.camera.speed = 0.01
    this.camera.inverseRotationSpeed = 0.01
    this.camera.setTarget(Vector3.Zero())
    this.camera.attachControl(this.renderCanvas, false)

    const cubes = createSceneCubes(this.engine)
    this.scenes.push({
      scene: cubes,
      offsets: {
        positionOffsetX: 0,
        positionOffsetY: 5,
        // rotationOffsetX: number = 0.4636476090008061
        rotationOffsetX: 0,
        rotationOffsetY: 0,
      },
    })

    createSceneBottle(this.engine).then((bottle) => {
      this.scenes.push({
        scene: bottle,
        offsets: {
          positionOffsetX: 0,
          positionOffsetY: 5,
          // rotationOffsetX: number = 0.4636476090008061
          rotationOffsetX: 0,
          rotationOffsetY: 0,
        },
      })
    })
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
        this.camera.position.y = value + this.scenes[this.sceneIndex].offsets.positionOffsetX
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

  calibrate(): void {
    // position
    this.scenes[this.sceneIndex].offsets.positionOffsetX = this.camera.position.x
    this.scenes[this.sceneIndex].offsets.positionOffsetY = this.camera.position.y

    // rotation
    this.scenes[this.sceneIndex].offsets.rotationOffsetX = this.camera.rotation.x
    this.scenes[this.sceneIndex].offsets.rotationOffsetY = this.camera.rotation.y

    console.log('calibrated')
  }

  nextScene(): void {
    this.sceneIndex += 1
    this.sceneIndex = this.sceneIndex % this.scenes.length

    this.camera = new FreeCamera('camera1', new Vector3(0, 5, -10), this.scenes[this.sceneIndex].scene)
    // this.camera.inputs.clear()
    // console.log(this.camera.inputs)
    this.camera.speed = 0.01
    this.camera.inverseRotationSpeed = 0.01
    this.camera.setTarget(Vector3.Zero())
    this.camera.attachControl(this.renderCanvas, false)

    this.camera.position.x = this.scenes[this.sceneIndex].offsets.positionOffsetX
    this.camera.position.y = this.scenes[this.sceneIndex].offsets.positionOffsetX
    this.camera.rotation.x = this.scenes[this.sceneIndex].offsets.positionOffsetX
    this.camera.rotation.y = this.scenes[this.sceneIndex].offsets.positionOffsetX

  }
}
