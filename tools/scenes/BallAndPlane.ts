import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  Mesh,
} from 'babylonjs'

// CreateScene function that creates and return the scene
function createScene(engine: Engine) {
  // Create a basic BJS Scene object
  const scene = new Scene(engine)

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)

  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  const sphere = Mesh.CreateSphere(
    'sphere1',
    16,
    2,
    scene,
    false,
    Mesh.FRONTSIDE
  )

  // Move the sphere upward 1/2 of its height
  sphere.position.y = 1

  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  const ground = Mesh.CreateGround('ground1', 6, 6, 2, scene, false)

  // Return the created scene
  return scene
}

export default createScene
