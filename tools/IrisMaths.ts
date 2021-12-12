export interface BoundingBox {
  topLeft: [number, number] // [x, y]
  bottomRight: [number, number]
}

export interface FacePosition {
  horizontal: {
    min: number
    max: number
    center: number
  }
  vertical: {
    min: number
    max: number
    center: number
  }
}

export function getFacePosition(mesh: any) {
  const axisX = mesh.map((row: any) => row[0])
  const axisY = mesh.map((row: any) => row[1])
  const axisZ = mesh.map((row: any) => row[2])

  const facePosition = [
    (Math.max(...axisX) + Math.min(...axisX)) / 2,
    (Math.max(...axisY) + Math.min(...axisY)) / 2,
    (Math.max(...axisZ) + Math.min(...axisZ)) / 2,
  ]

  return facePosition
}

export function faceCenter(bbox: BoundingBox): FacePosition {
  return {
    horizontal: {
      min: bbox.topLeft[0],
      max: bbox.bottomRight[0],
      center: (bbox.topLeft[0] + bbox.bottomRight[0]) / 2,
    },
    vertical: {
      min: bbox.topLeft[1],
      max: bbox.bottomRight[1],
      center: (bbox.topLeft[1] + bbox.bottomRight[1]) / 2,
    },
  }
}

export function noseAngle(
  facePosition: FacePosition,
  nosePosition: [number, number]
): [number, number] {
  const noseRoll =
    (nosePosition[0] - facePosition.horizontal.center) /
    (facePosition.horizontal.max - facePosition.horizontal.min)
  const nosePitch =
    (nosePosition[1] - facePosition.vertical.center) /
    (facePosition.vertical.max - facePosition.vertical.min)

  return [noseRoll, nosePitch]
}
