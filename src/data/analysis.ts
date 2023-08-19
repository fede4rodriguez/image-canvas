export const ANALYSIS = {
  id: "1",
  image_url: "https://www.agritotal.com/files/image/8/8057/5346b54b568b5_907_510!.jpg?s=ae1f0be4a18130d0a873a418aab8c620&d=1597433049",
  detections: [
    {
      id: "1",
      label: "person",
      bounding_box: {
        top: 10,
        left: 10,
        width: 10,
        height: 10
      }
    }
  ]
}

export type Analisys = typeof ANALYSIS;

export type Detection = typeof ANALYSIS.detections[0];