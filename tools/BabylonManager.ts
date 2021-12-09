import { Engine, Scene } from 'babylonjs'
import createScene from '~/tools/SceneManager'

export default class BabylonManager {
  renderCanvas: HTMLCanvasElement
  engine: Engine
  scene: Scene

  constructor(renderCanvas: HTMLCanvasElement) {
    this.renderCanvas = renderCanvas

    // Load 3D engine
    this.engine = new Engine(this.renderCanvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    })
    this.engine.setHardwareScalingLevel(1 / window.devicePixelRatio)

    // call the createScene function
    this.scene = createScene(this.engine, this.renderCanvas)
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

  showDebug() {
    this.scene.debugLayer.show()
  }

  hideDebug() {
    this.scene.debugLayer.hide()
  }
}
