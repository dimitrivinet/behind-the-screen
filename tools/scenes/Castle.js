/*
From: https://playground.babylonjs.com/#L92PHY#36
*/

import * as BABYLON from 'babylonjs'

/**
 * Function to create and return the Scene object
 *
 * This function makes use of Viewports, Layer Masks, and SceneLoader.
 *
 * MultiViews Part 2:
 * https://doc.babylonjs.com/divingDeeper/cameras/multiViewsPart2
 *
 * Layer Masks and Multi-Cam Textures:
 * https://doc.babylonjs.com/divingDeeper/cameras/layerMasksAndMultiCam
 *
 * Loading Any File Type:
 * https://doc.babylonjs.com/divingDeeper/importers/loadingFileTypes
 *
 */
const createScene = function (engine) {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine)

  scene.clearColor = new BABYLON.Color3(0.35, 0.47, 0.56)

  // This creates our primary camera
  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, 0), scene)

  // Load glTF scene.  Once loaded, begin to configure everything.
  // BABYLON.SceneLoader.Append('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/', 'Sponza.gltf', scene, function (scene) {
  BABYLON.SceneLoader.Append('/Sponza/', 'Sponza.gltf', scene, function (scene) {
    const pipCamera = new BABYLON.FreeCamera('pipCamera', new BABYLON.Vector3(0, 20, 0), scene)
    pipCamera.setTarget(BABYLON.Vector3.Zero())

    // We want to preserve the square PIP look so we'll use the main camera's aspect ratio to adjust the sizes accordingly
    // Aspect ratio < 1 = Portrait, > 1 = Landscape
    const ar = engine.getAspectRatio(camera)
    const pipW = ar < 1 ? 0.3 : 0.3 * (1 / ar)
    const pipH = ar < 1 ? 0.3 * ar : 0.3
    const pipX = 1 - pipW
    const pipY = 1 - pipH

    // Specify location and amount of screen each camera should take
    // Note: All values for the viewport are going to be 0 to 1.  Think about it as a percentage of the screen.
    camera.viewport = new BABYLON.Viewport(0, 0, 1, 1)
    pipCamera.viewport = new BABYLON.Viewport(pipX, pipY, pipW, pipH)

    // We are setting layer masks for cameras (and later on, our meshes)
    // This is being done because there parts of the Sponza mesh that we won't want to display
    // on the PIP camera (logic found in castRay function).
    camera.layerMask = 0x30000000 // Set layer mask so that it can see 0x10000000 and 0x20000000 objects
    pipCamera.layerMask = 0x10000000 // Set layer mask to only see 0x10000000 objects

    // Add cameras to active camera list.
    // Each camera MUST be in the active camera list to be displayed with its defined viewport
    scene.activeCameras.push(camera)

    // Create head mesh to represent where the camera is looking.
    // const head = createHead(scene)
    // head.isPickable = false // We're turning off picking on the head mesh because we don't want it to be picked up by our overhead ray
    // head.setParent(camera)
    // head.position = BABYLON.Vector3.Zero()

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 1

    // For each part of the Sponza mesh, we want to increase the size and set its layer mask so that
    // it's visible to both cameras
    scene.meshes.forEach((mesh) => {
      mesh.scaling = new BABYLON.Vector3(3, 3, 3)
      mesh.layerMask = 0x10000000 // Set layer mask so that meshes are visible to all cameras
    })

    // Set camera to look down the hall and show face
    camera.setTarget(new BABYLON.Vector3(1, 6, 0))

    // Create a basic skybox
    createSkyBox(scene)
  })

  return scene
}

/**
 * Given a scene, create a basic skybox to surround the area.
 *
 * For more information on Skyboxes, check out the Skyboxes doc page:
 * https://doc.babylonjs.com/divingDeeper/environment/skybox
 */
const createSkyBox = function (scene) {
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene)
  skybox.layerMask = 0x10000000
  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene)
  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('textures/skybox', scene)
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
  skybox.material = skyboxMaterial
}

export { createScene }
