import { Engine, Scene, Vector3, FreeCamera } from 'babylonjs'
import createScene from '~/tools/scenes/BallAndPlane'
// import createScene from '~/tools/scenes/Fish'

export default class BabylonManager {
  renderCanvas: HTMLCanvasElement
  engine: Engine
  scene: Scene
  camera: FreeCamera
  positionOffsetX: number = 0
  positionOffsetY: number = 5
  rotationOffsetX: number = 0.4636476090008061
  rotationOffsetY: number = 0

  constructor(renderCanvas: HTMLCanvasElement) {
    this.renderCanvas = renderCanvas

    // Load 3D engine
    this.engine = new Engine(this.renderCanvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    })
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio)

    // call the createScene function
    this.scene = createScene(this.engine)

    this.camera = new FreeCamera('camera1', new Vector3(0, 5, -10), this.scene)
    // this.camera.inputs.clear()
    // console.log(this.camera.inputs)
    this.camera.speed += 10000
    this.camera.inverseRotationSpeed += 10000
    this.camera.setTarget(Vector3.Zero())
    this.camera.attachControl(this.renderCanvas, false)
    console.log(`speed: ${this.camera.speed}`)
    console.log(`rotation: ${this.camera.rotation}`)
  }

  start() {
    // run the render loop
    const scene = this.scene
    this.engine.runRenderLoop(function () {
      scene.render()
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
        this.camera.position.x = value + this.positionOffsetX
        break

      case 'y':
        this.camera.position.y = value + this.positionOffsetY
        break

      case 'z':
        break

      case 'roll':
        this.camera.rotation.y = value + this.rotationOffsetY
        break

      case 'pitch':
        this.camera.rotation.y = value + this.rotationOffsetY
        break

      case 'yaw':
        break

      default:
        break
    }
  }

  showDebug() {
    this.scene.debugLayer.show()
  }

  hideDebug() {
    this.scene.debugLayer.hide()
  }
}
