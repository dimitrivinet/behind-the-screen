/*
From: https://www.babylonjs-playground.com/#UGLGTJ#62
*/

var url = 'https://cdn.rawgit.com/NasimiAsl/Extensions/master/GeometryBuilder/GBv2.0.2.js'
var s = document.createElement('script')
s.src = url
document.head.appendChild(s)

window.eval('var  _null ="null value";var ik = 0;var scene,camera;')

var createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
  scene = new BABYLON.Scene(engine)
  // This creates and positions a free camera (non-mesh)
  camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, 10), scene)
  camera.setTarget(BABYLON.Vector3.Zero())
  camera.radius = 150
  camera.beta = 0.5
  camera.attachControl(canvas, true)
  scene.clearColor = new BABYLON.Color4(0.79, 0.89, 0.979, 1)

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
  light.intensity = 0.7

  s.onload = function (params) {
    BABYLONX.GeometryBuilder.InitializeEngine()
    BABYLONX.ShaderBuilder.InitializeEngine()

    function sandDunes_height(p, setting) {
      p.x += 0.0001
      p.y += 0.0001
      p.z += 0.0001

      var l = 0.2 / setting.nsScale
      var ns = noise.simplex3(p.x * l, p.y * l, p.z * l)
      ns = log(1 / (abs(ns * 0.01) + 0.01))
      p.y = ns * 1

      l = 0.1 / setting.nsScale
      ns = noise.simplex3(p.x * l, p.y * l, p.z * l)
      ns = log(1 / (abs(ns * 0.01) + 0.01))
      p.y += ns * 1 - 5

      l = 0.02 / setting.nsScale
      ns = noise.simplex3(p.x * l, p.y * l, p.z * l)
      p.y += ns * 1

      p.y *= setting.h

      return p
    }

    var sandDunes = function (op) {
      var builder = function (setting /*{seg:number}*/, geo) {
        /* push vertex */

        for (var i = 0; i < setting.seg; i++) {
          for (var j = 0; j < setting.seg; j++) {
            GB.PushVertex(
              geo,
              sandDunes_height(
                {
                  x: setting.x + (i / setting.seg) * setting.scale - setting.scale / 2,
                  y: 0,
                  z: setting.z + (j / setting.seg) * setting.scale - setting.scale / 2,
                },
                setting
              )
            )
            geo.uvs.push(i / setting.seg, j / setting.seg)
          }
        }

        for (var i = 0; i < setting.seg; i++) {
          for (var j = 0; j < setting.seg; j++) {
            GB.PushVertex(
              geo,
              sandDunes_height(
                {
                  x:
                    setting.x +
                    (i / setting.seg) * setting.scale -
                    setting.scale / 2 +
                    (setting.scale * 0.5) / setting.seg,
                  y: 0,
                  z:
                    setting.z +
                    (j / setting.seg) * setting.scale -
                    setting.scale / 2 +
                    (setting.scale * 0.5) / setting.seg,
                },
                setting
              )
            )
            geo.uvs.push((i + 0.5) / setting.seg, (j + 0.5) / setting.seg)
          }
        }

        for (var i = 1; i < setting.seg; i++) {
          for (var j = 1; j < setting.seg; j++) {
            GB.MakeFace(
              geo,
              [
                j * setting.seg + i,
                j * setting.seg + i - 1,
                pow(setting.seg) + (j - 1) * setting.seg + i - 1,
              ],
              { flip: false, Face3Point: true }
            )

            GB.MakeFace(
              geo,
              [
                j * setting.seg + i,
                (j - 1) * setting.seg + i,
                pow(setting.seg) + (j - 1) * setting.seg + i - 1,
              ],
              { flip: true, Face3Point: true }
            )

            GB.MakeFace(
              geo,
              [
                j * setting.seg + i - 1,
                (j - 1) * setting.seg + i - 1,
                pow(setting.seg) + (j - 1) * setting.seg + i - 1,
              ],
              { flip: false, Face3Point: true }
            )

            GB.MakeFace(
              geo,
              [
                (j - 1) * setting.seg + i,
                (j - 1) * setting.seg + i - 1,
                pow(setting.seg) + (j - 1) * setting.seg + i - 1,
              ],
              { flip: true, Face3Point: true }
            )
          }
        }
      }
      return new BABYLONX.Geometry(GB.GeometryBase(op, builder, op.custom))
    }

    var SB = BABYLONX.ShaderBuilder
    var SBP = BABYLONX.Shader.Print

    var reflectPart = function (ref, nrm, scale, brk, x, y, z, bias, poo) {
      ik++
      return (
        'vec3 new_nrm' +
        ik +
        ' = ' +
        nrm +
        ';\
                vec3 vr' +
        ik +
        ' = ' +
        def(
          poo,
          '  normalize(  refract(  normalize(camera -(world*vec4(pos,1.)).xyz*3.141592*length(camera- (world*vec4(pos,1.)).xyz)*' +
            SBP(scale) +
            ')  ,  new_nrm' +
            ik +
            ', ' +
            SBP(brk) +
            ') )'
        ) +
        '; \
                float y' +
        ik +
        '= .5+  - atan( ' +
        SBP(z) +
        '*vr' +
        ik +
        '.z ,  ' +
        SBP(x) +
        '*vr' +
        ik +
        '.x ) / (2.*3.141592);\
                float p' +
        ik +
        '= 0.5  - atan( ' +
        SBP(y) +
        '*vr' +
        ik +
        '.y, length( vr' +
        ik +
        '.xz ) ) / ( 3.141592);\
                result = texture(  ' +
        ref +
        ', vec2( y' +
        ik +
        ', p' +
        ik +
        ') ,' +
        SBP(bias) +
        ' );\
                '
      )
    }

    camera.position.y = 22
    //camera.position.z=  -25.00;
    var mat = new BABYLONX.ShaderBuilder()

      .Map({ path: 'https://i.imgur.com/UvN67zA.jpg', uv: 'vec2(vuv*80.)' })
      .InLine(
        `float h = 1.-min(1.,max(0.,pow((pos.y-10.)/30.,1.)));
            float fs = dot(nrm,normalize(pos-camera));
             float fs2 = dot(nrm,normalize(pos-vec3(1000.)));
            result.xyz  = min(1.,max(0.,(1.2+fs*0.1+fs2*1.2) )) *result.xyz;
            `
      )

      .BuildMaterial(scene)
    var sandMesh, sandColid
    function create(x, y) {
      if (sandColid) sandColid.dispose()
      if (sandMesh) sandMesh.dispose()

      sandMesh = sandDunes({ seg: 100, x: x, z: y, scale: 200, h: 5, nsScale: 10 }).toMesh(scene)
      sandMesh.material = mat

      sandColid = sandDunes({ seg: 50, x: x, z: y, scale: 200, h: 5, nsScale: 10 }).toMesh(scene)
      sandColid.checkCollisions = true
      sandColid.material = new BABYLONX.ShaderBuilder()

        .InLine('discard;')

        .BuildMaterial(scene)
    }

    create(0, 0)

    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0)

    // Enable Collisions
    scene.collisionsEnabled = true

    //Then apply collisions and gravity to the active camera
    camera.checkCollisions = true
    camera.applyGravity = true

    //Set the ellipsoid around the camera (e.g. your player's size)
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1)

    //finally, say which mesh will be collisionable
    camera.minZ = 0
    camera.fov = 0.99

    var currPickedItem = null

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene

    camera.minZ = 0
    window.eval('var bx,cur;')
    focus = new BABYLON.Mesh.CreateSphere('cursor', 10, 0.2, scene)
    focus.isPickable = false

    focus.material = new BABYLON.CustomMaterial('d', scene)

    focus.material.Fragment_Before_FragColor('discard;')

    document.getElementById('renderCanvas').addEventListener('click', function (event) {
      if (currPickedItem) currPickedItem.sw = 5
    })

    document.getElementById('renderCanvas').addEventListener('contextmenu', function (event) {
      event.preventDefault()
      return false
    })

    var time = 0
    var ox = 0,
      oy = 0

    scene.registerBeforeRender(function () {
      if (sqrt(pow(camera.position.x - ox) + pow(camera.position.z - oy)) > 80) {
        ox = camera.position.x
        oy = camera.position.z
        create(camera.position.x, camera.position.z)
      }

      new BABYLONX.ShaderMaterialHelper().SetUniforms(
        scene.meshes,
        camera.position,
        camera.target,
        { x: 0, y: 0 },
        { x: 100, y: 100 },
        time++
      )
    })
  }
  return scene
}
