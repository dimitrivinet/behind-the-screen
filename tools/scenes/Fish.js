/*
From https://playground.babylonjs.com/#LPTLZM
*/

import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import 'recast-detour'

function getRandomPos(navigationPlugin) {
  const radius = 9.5
  const randomAngle = Math.random() * Math.PI * 2.0
  const randomDist = radius * Math.random()
  const pos = new BABYLON.Vector3(
    Math.cos(randomAngle) * randomDist,
    0,
    Math.sin(randomAngle) * randomDist
  )
  return navigationPlugin.getClosestPoint(pos)
}

function padStart(num, size) {
  let s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

function fishesPickupNewDestination(navigationPlugin, crowd, fishes, time) {
  const agents = crowd.getAgents()
  for (let i = 1; i < agents.length; i++) {
    const angleInterpolationFactor = 0.05
    let positionInterpolationFactor = 0.01

    const agent = fishes[i] // agents[0] is camera
    const currentDestination = agent.destination
    const agentPos = crowd.getAgentPosition(agents[i])
    const distSqr =
      (currentDestination.x - agentPos.x) * (currentDestination.x - agentPos.x) +
      (currentDestination.z - agentPos.z) * (currentDestination.z - agentPos.z)

    if (time < 1.0 || distSqr > 4.0) {
      positionInterpolationFactor = 1
    }

    const velocity = crowd.getAgentVelocity(agents[i])

    if (velocity.length() > 0.01) {
      velocity.normalize()
      agent.velocity = velocity

      const dir = agent.direction

      agent.direction = new BABYLON.Vector3(
        dir.x + (agent.velocity.x - dir.x) * angleInterpolationFactor,
        dir.y + (agent.velocity.y - dir.y) * angleInterpolationFactor,
        dir.z + (agent.velocity.z - dir.z) * angleInterpolationFactor
      )
      agent.direction.normalize()

      const targetAngle = Math.PI * 0.5 - Math.atan2(agent.direction.z, agent.direction.x)

      agent.mesh.rotation.y = targetAngle

      const deltaDir =
        agent.direction.x * agent.velocity.x +
        agent.direction.y * agent.velocity.y +
        agent.direction.z * agent.velocity.z
      const crossy = agent.direction.z * agent.velocity.x - agent.direction.x * agent.velocity.z
      const angleYTarget = -(1.0 - deltaDir) * Math.sign(crossy)

      agent.AngleY.value = agent.AngleY.value + (angleYTarget - agent.AngleY.value) * 0.04
      if (Math.abs(agent.AngleY.value) < 0.001) {
        agent.AngleY.value = 0.001
      }
    }

    const targetPosition = agent.transform.position
    const angle = i * 0.867874 + time
    const offsetY = 1.0 + Math.cos(angle) * 0.7
    agent.mesh.rotation.x = Math.sin(angle) * 0.4
    agent.AngleX.value = Math.cos(angle - Math.PI * 0.1) * 0.015

    const agentMesh = agent.mesh

    agentMesh.position = new BABYLON.Vector3(
      agentMesh.position.x +
        (targetPosition.x - agentMesh.position.x) * positionInterpolationFactor,
      agentMesh.position.y +
        (targetPosition.y + offsetY - agentMesh.position.y) * positionInterpolationFactor,
      agentMesh.position.z + (targetPosition.z - agentMesh.position.z) * positionInterpolationFactor
    )

    if (distSqr < 5.0) {
      const newDestNav = getRandomPos(navigationPlugin)
      agent.destination = newDestNav
      crowd.agentGoto(agents[i], newDestNav)
    }
  }
}

export function createScene(engine) {
  const scene = new BABYLON.Scene(engine)
  const navigationPlugin = new BABYLON.RecastJSPlugin()
  const fishes = []
  let time = 0

  // setup fog in the scene
  scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR
  scene.fogStart = 5
  scene.fogEnd = 25
  scene.fogColor = new BABYLON.Color3(0.1, 0.08, 0.25)
  scene.fogDensity = 0.1

  // create a background cube
  const backgroundCube = BABYLON.MeshBuilder.CreateBox(
    'background',
    { size: 60, sideOrientation: 2 },
    scene
  )

  // setup the main camera for the scene and give it control limits
  // const mainCam = new BABYLON.ArcRotateCamera(
  //   'mainCam',
  //   BABYLON.Tools.ToRadians(100),
  //   BABYLON.Tools.ToRadians(85),
  //   10,
  //   new BABYLON.Vector3(-0.25, 1, 0),
  //   scene
  // )
  // mainCam.layerMask = 1
  // mainCam.lowerRadiusLimit = 10
  // mainCam.upperRadiusLimit = 10
  // mainCam.lowerBetaLimit = BABYLON.Tools.ToRadians(85)
  // mainCam.upperBetaLimit = BABYLON.Tools.ToRadians(85)

  // mainCam.attachControl(canvas, true)

  // setup the camera that will "record" the caustics pattern
  const textureCamera = new BABYLON.ArcRotateCamera(
    'textureCam',
    0,
    0,
    190,
    new BABYLON.Vector3.Zero(),
    scene
  )
  textureCamera.layerMask = 2
  textureCamera.mode = 1
  textureCamera.orthoLeft = -7
  textureCamera.orthoTop = 7
  textureCamera.orthoRight = 7
  textureCamera.orthoBottom = -7

  // create a spotlight that will project the cuastics pattern as light
  const light = new BABYLON.SpotLight(
    'spotLight',
    new BABYLON.Vector3(0, 30, 0),
    BABYLON.Vector3.Down(),
    BABYLON.Tools.ToRadians(50),
    8,
    scene
  )

  // create a high resolution plane to function as the basis for the water caustics
  const waterPlane = new BABYLON.Mesh.CreateGround('waterPlane', 15, 15, 400, scene)
  waterPlane.layerMask = 2

  // setup a render target texture from the view of the texture camera, recording the waterplane...also set the render target UVs to a higher resolution with a mirrored wrap mode
  const renderTarget = new BABYLON.RenderTargetTexture('RTT', 1024, scene)
  renderTarget.activeCamera = textureCamera
  scene.customRenderTargets.push(renderTarget)
  renderTarget.renderList.push(waterPlane)
  renderTarget.wrapU = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE
  renderTarget.wrapV = BABYLON.Constants.TEXTURE_MIRROR_ADDRESSMODE
  renderTarget.uScale = 2
  renderTarget.vScale = 2

  // instruct the spotlight to project the rendered target texture as a light projection
  light.projectionTexture = renderTarget

  // load the waterShader from a URL snippet and assign it to the high res water plane
  BABYLON.NodeMaterial.ParseFromSnippetAsync('7X2PUH', scene).then((nodeMaterial) => {
    nodeMaterial.name = 'causticMaterial'
    waterPlane.material = nodeMaterial
  })

  // setup the "god rays"
  // particle system variables
  const volumetricEmitter = new BABYLON.AbstractMesh('volumetricEmitter', scene)

  // set up animation sheet
  function setupAnimationSheet(
    system,
    texture,
    width,
    height,
    numSpritesWidth,
    numSpritesHeight,
    animationSpeed,
    isRandom
  ) {
    // assign animation parameters
    system.isAnimationSheetEnabled = true
    system.particleTexture = new BABYLON.Texture(
      texture,
      scene,
      false,
      false,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE
    )
    system.particleTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE
    system.particleTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE
    system.spriteCellWidth = width / numSpritesWidth
    system.spriteCellHeight = height / numSpritesHeight
    const numberCells = numSpritesWidth * numSpritesHeight
    system.startSpriteCellID = 0
    system.endSpriteCellID = numberCells - 1
    system.spriteCellChangeSpeed = animationSpeed
    system.spriteRandomStartCell = isRandom
    system.updateSpeed = 1 / 30
  }

  // particle system
  const volumetricSystem = new BABYLON.ParticleSystem('volumetricSystem', 100, scene, null, true)
  setupAnimationSheet(
    volumetricSystem,
    'https://models.babylonjs.com/Demos/UnderWaterScene/godRays/volumetricLight.png',
    1024,
    1024,
    4,
    1,
    0,
    true
  )
  volumetricSystem.emitter = volumetricEmitter.position
  const boxEmitter = volumetricSystem.createBoxEmitter(
    new BABYLON.Vector3(-1, 0, 0),
    new BABYLON.Vector3(1, 0, 0),
    new BABYLON.Vector3(-5, 5, -3),
    new BABYLON.Vector3(5, 5, 3)
  )
  boxEmitter.radiusRange = 0
  volumetricSystem.minInitialRotation = 0
  volumetricSystem.maxInitialRotation = 0
  volumetricSystem.minScaleX = 6
  volumetricSystem.maxScaleX = 10
  volumetricSystem.minScaleY = 30
  volumetricSystem.maxScaleY = 50
  volumetricSystem.minLifeTime = 6
  volumetricSystem.maxLifeTime = 9
  volumetricSystem.emitRate = 15
  volumetricSystem.minEmitPower = 0.05
  volumetricSystem.maxEmitPower = 0.1
  volumetricSystem.minSize = 0.1
  volumetricSystem.maxSize = 0.2
  volumetricSystem.addColorGradient(0, new BABYLON.Color4(0, 0, 0, 0))
  volumetricSystem.addColorGradient(0.5, new BABYLON.Color4(0.25, 0.25, 0.3, 0.2))
  volumetricSystem.addColorGradient(1.0, new BABYLON.Color4(0, 0, 0, 0))
  volumetricSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD
  volumetricSystem.start()

  // add a blur effect to the caustics material.
  const blurAmount = 70
  const standardPipeline = new BABYLON.PostProcessRenderPipeline(engine, 'standardPipeline')
  const horizontalBlur = new BABYLON.BlurPostProcess(
    'horizontalBlur',
    new BABYLON.Vector2(1.0, 0),
    blurAmount,
    1.0,
    null,
    null,
    engine,
    false
  )
  const verticalBlur = new BABYLON.BlurPostProcess(
    'verticalBlur',
    new BABYLON.Vector2(0, 1),
    blurAmount,
    1.0,
    null,
    null,
    engine,
    false
  )
  const blackAndWhiteThenBlur = new BABYLON.PostProcessRenderEffect(
    engine,
    'blackAndWhiteThenBlur',
    function () {
      return [horizontalBlur, verticalBlur]
    }
  )
  standardPipeline.addEffect(blackAndWhiteThenBlur)
  scene.postProcessRenderPipelineManager.addPipeline(standardPipeline)
  scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
    'standardPipeline',
    textureCamera
  )

  // setup the navigation mesh for the fish
  const navmeshParameters = {
    cs: 0.2,
    ch: 0.05,
    walkableSlopeAngle: 5,
    walkableHeight: 10.0,
    walkableClimb: 3,
    walkableRadius: 2,
    maxEdgeLen: 12,
    maxSimplificationError: 0.6,
    minRegionArea: 50,
    mergeRegionArea: 20,
    maxVertsPerPoly: 6,
    detailSampleDist: 6,
    detailSampleMaxError: 1,
  }

  // load the assets for the scene and apply node materials from URL snippets
  BABYLON.SceneLoader.ImportMesh(
    '',
    'https://models.babylonjs.com/Demos/UnderWaterScene/ground/',
    'underwaterGround.glb',
    scene,
    function (newMeshes) {
      newMeshes[0].name = 'underWaterGround'
      const childMeshes = newMeshes[0].getChildMeshes(false)
      for (let i = 0; i < childMeshes.length; i++) {
        childMeshes[i].layerMask = 1
      }
      BABYLON.NodeMaterial.ParseFromSnippetAsync('XWTJA2', scene).then((nodeMaterial) => {
        nodeMaterial.name = 'groundMaterial'
        scene.getMeshByName('ground').material = nodeMaterial
      })
    }
  )
  BABYLON.SceneLoader.ImportMesh(
    '',
    'https://models.babylonjs.com/Demos/UnderWaterScene/shadows/',
    'underwaterSceneShadowCatcher.glb',
    scene,
    function (newMeshes) {
      newMeshes[0].name = 'underWaterShadowCatcher'
      const childMeshes = newMeshes[0].getChildMeshes(false)
      for (let i = 0; i < childMeshes.length; i++) {
        childMeshes[i].layerMask = 1
        childMeshes[i].position.y += 0.01
      }
      BABYLON.NodeMaterial.ParseFromSnippetAsync('GUKDFQ', scene).then((nodeMaterial) => {
        nodeMaterial.name = 'shadowCatcherMaterial'
        scene.getMeshByName('shadowCatcher').material = nodeMaterial
        nodeMaterial.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY
      })
    }
  )
  BABYLON.SceneLoader.ImportMesh(
    '',
    'https://models.babylonjs.com/Demos/UnderWaterScene/',
    'underwaterSceneRocksBarnaclesMussels.glb',
    scene,
    function (newMeshes) {
      newMeshes[0].name = 'rocksBarnaclesMussels'
      const childMeshes = newMeshes[0].getChildMeshes(false)
      for (let i = 0; i < childMeshes.length; i++) {
        childMeshes[i].layerMask = 1
      }
      BABYLON.NodeMaterial.ParseFromSnippetAsync('UPIJ0M', scene).then((nodeMaterial) => {
        nodeMaterial.name = 'rocksBMMaterial'
        scene.getMeshByName('rocksBarnaclesMussels_primitive0').material = nodeMaterial
        scene.getMeshByName('rocksBarnaclesMussels_primitive1').material = nodeMaterial
        scene.getMeshByName('rocksBarnaclesMussels_primitive2').material = nodeMaterial
        scene.getMeshByName('rocksBarnaclesMussels_primitive3').material = nodeMaterial
        scene.getMeshByName('rocksBarnaclesMussels_primitive4').material = nodeMaterial
      })
    }
  )
  BABYLON.SceneLoader.ImportMesh(
    '',
    'https://models.babylonjs.com/Demos/UnderWaterScene/',
    'underwaterScene.glb',
    scene,
    function (newMeshes) {
      newMeshes[0].name = 'underWaterScene'
      const childMeshes = newMeshes[0].getChildMeshes(false)
      for (let i = 0; i < childMeshes.length; i++) {
        childMeshes[i].layerMask = 1
      }
      BABYLON.NodeMaterial.ParseFromSnippetAsync('EMIYYW', scene).then((nodeMaterial) => {
        nodeMaterial.name = 'rock1Material'
        scene.getMeshByName('moreRocks').material = nodeMaterial
      })
      BABYLON.NodeMaterial.ParseFromSnippetAsync('KQX9WD', scene).then((nodeMaterial) => {
        nodeMaterial.name = 'boardsMaterial'
        scene.getMeshByName('boards').material = nodeMaterial
      })
      BABYLON.NodeMaterial.ParseFromSnippetAsync('6RIWPP', scene).then((nodeMaterial) => {
        nodeMaterial.name = 'grassMaterial'
        scene.getMeshByName('grass').material = nodeMaterial
      })
      BABYLON.NodeMaterial.ParseFromSnippetAsync('S40WL3', scene).then((nodeMaterial) => {
        nodeMaterial.name = 'shipWheelMat'
        scene.getMeshByName('shipWheel').material = nodeMaterial
      })
    }
  )

  // load the nav mesh and build out the fish system
  BABYLON.SceneLoader.ImportMesh(
    '',
    'https://models.babylonjs.com/Demos/UnderWaterScene/navMesh/',
    'underwaterSceneNavMesh.glb',
    scene,
    function (newMeshes) {
      navigationPlugin.createNavMesh(newMeshes, navmeshParameters)

      for (const mesh of newMeshes) {
        mesh.dispose()
      }

      const crowd = navigationPlugin.createCrowd(30, 0.1, scene)
      const agentParams = {
        radius: 0.1,
        height: 0.2,
        maxAcceleration: 0.1,
        maxSpeed: 0.3,
        collisionQueryRange: 0.5,
        pathOptimizationRange: 0.5,
        separationWeight: 0.5,
      }
      const cameraAgentParams = {
        radius: 2.0,
        height: 0.2,
        maxAcceleration: 0.1,
        maxSpeed: 0.3,
        collisionQueryRange: 0.5,
        pathOptimizationRange: 0.5,
        separationWeight: 1.0,
      }

      // camera agent
      const agentsNode = new BABYLON.TransformNode('agents', scene)
      const cameraDummyTransform = new BABYLON.TransformNode('camera', scene)
      cameraDummyTransform.parent = agentsNode
      const cameraAgentIndex = crowd.addAgent(
        navigationPlugin.getClosestPoint(mainCam.position),
        cameraAgentParams,
        cameraDummyTransform
      )
      fishes.push({ transform: cameraDummyTransform })

      BABYLON.SceneLoader.LoadAssetContainer(
        'https://models.babylonjs.com/Demos/UnderWaterScene/fish/',
        'greySnapper_vertColor.glb',
        scene,
        function (container) {
          const fishNode = new BABYLON.TransformNode('fish', scene)
          for (let i = 0; i < 100; i++) {
            const paddedIndex = padStart(i, 2)
            BABYLON.NodeMaterial.ParseFromSnippetAsync('WD4ZGF#16', scene).then((nodeMaterial) => {
              nodeMaterial.name = 'fishMat'
              const entries = container.instantiateModelsToScene(function (name) {
                return name === '__root__' ? paddedIndex : name
              })
              entries.rootNodes[0].parent = fishNode
              const width = 0.2
              const agentMesh = entries.rootNodes[0]
              agentMesh.getChildren()[0].material = nodeMaterial
              agentMesh.getChildren()[0].hasVertexAlpha = false
              agentMesh.scaling = new BABYLON.Vector3(0.02, 0.02, 0.02)
              agentMesh.position = new BABYLON.Vector3(0, 0, 0)
              agentMesh.rotation = new BABYLON.Vector3(0, 0, 0)
              const randomPos = getRandomPos(navigationPlugin)
              const fishTransform = new BABYLON.TransformNode('fish' + paddedIndex)
              fishTransform.parent = agentsNode

              const angleY = nodeMaterial.getInputBlockByPredicate((b) => b.name === 'AngleY')
              const angleX = nodeMaterial.getInputBlockByPredicate((b) => b.name === 'AngleX')

              const agentIndex = crowd.addAgent(randomPos, agentParams, fishTransform)
              fishes.push({
                mesh: agentMesh,
                transform: fishTransform,
                direction: new BABYLON.Vector3(1, 0, 0),
                velocity: new BABYLON.Vector3(1, 0, 0),
                destination: randomPos,
                AngleX: angleX,
                AngleY: angleY,
              })
              for (const group of entries.animationGroups) {
                group.play(true)
              }
            })
          }
        }
      )

      // display loading screen while loading assets
      engine.displayLoadingUI()
      scene.executeWhenReady(function () {
        engine.hideLoadingUI()
      })

      scene.onBeforeRenderObservable.add(function () {
        time += 0.01
        fishesPickupNewDestination(navigationPlugin, crowd, fishes, time)

        // camera agent
        const agents = crowd.getAgents()
        crowd.agentTeleport(agents[0], navigationPlugin.getClosestPoint(mainCam.position))
      })
    }
  )

  return scene
}
