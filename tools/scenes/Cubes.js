/*
From: https://playground.babylonjs.com/#KVLBG5
*/

import * as BABYLON from 'babylonjs'
import 'babylonjs-materials';

export function createScene(engine) {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine)

  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  const box = BABYLON.MeshBuilder.CreateBox('box', { diameter: 2, segments: 32 }, scene)
  box.position.y = 5
  box.position.z = -10

  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 1000, height: 1000 }, scene)

  // ground.material =  new BABYLON.GridMaterial("mat", scene);
  // const mat = BABYLON.NodeMaterial.ParseFromSnippetAsync("#I4DJ9Z#4", scene);
  // ground.material = mat;

  const box1 = BABYLON.Mesh.CreateBox('box1', 5, scene)
  box1.rotation.x = Math.PI / 3
  box1.position.y -= 1

  const meshes = []
  for (let x = 0; x < 11; x++) {
    for (let z = 0; z < 11; z++) {
      const box1 = BABYLON.MeshBuilder.CreateBox(
        'box',
        { width: 4.9, height: 4.9, depth: 4.9 },
        scene
      )
      box1.position.x = (x - 5) * 6
      box1.position.y = 5 + z * 5
      box1.position.z = 100 // (25+z)*5;
      meshes.push(box1)
    }
  }

  // // Create imposters
  // for (let i = 0; i < meshes.length; i++) {
  //   meshes[i].physicsImpostor = new BABYLON.PhysicsImpostor(
  //     meshes[i],
  //     BABYLON.PhysicsImpostor.BoxImpostor,
  //     { mass: 5, friction: 0.01, restitution: 0 },
  //     scene
  //   )
  // }

  // const transformForce = function (mesh, vec) {
  //   const mymatrix = new BABYLON.Matrix()
  //   mesh.rotationQuaternion.toRotationMatrix(mymatrix)
  //   return BABYLON.Vector3.TransformNormal(vec, mymatrix)
  // }

  // const rotate = function (mesh, direction, power) {
  //   // console.log("rotate happening", direction.scale(power));
  //   mesh.physicsImpostor.setAngularVelocity(
  //     mesh.physicsImpostor.getAngularVelocity().add(direction.scale(power))
  //   )
  // }

  // const translate = function (mesh, direction, power) {
  //   mesh.physicsImpostor.setLinearVelocity(
  //     mesh.physicsImpostor.getLinearVelocity().add(transformForce(mesh, direction.scale(power)))
  //   )
  // }

  // const mf = false
  // const mb = false
  // const rl = false
  // const rr = false

  // function update() {
  //   if (mf === true) {
  //     translate(box, new BABYLON.Vector3(0, 0, 1), 0.5)
  //   }
  //   if (mb === true) {
  //     translate(box, new BABYLON.Vector3(0, 0, -1), 0.5)
  //   }
  //   if (rl === true) {
  //     rotate(box, new BABYLON.Vector3(0, -1, 0), 0.2)
  //   }
  //   if (rr === true) {
  //     rotate(box, new BABYLON.Vector3(0, 1, 0), 0.2)
  //   }
  // }

  // scene.registerBeforeRender(function () {
  //   update()
  // })

  return scene
}
