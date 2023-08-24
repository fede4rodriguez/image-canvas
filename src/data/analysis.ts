export const ANALYSIS = {
  id: "1",
  image: {
    url: "https://www.agritotal.com/files/image/8/8057/5346b54b568b5_907_510!.jpg?s=ae1f0be4a18130d0a873a418aab8c620&d=1597433049",
    size: {
      width: 907,
      height: 510
    }
  },
  detections: [
    {
      id: "1",
      label: "plant1",
      person: "@fede4rodriguez",
      box: {
        top: 28,
        left: 5,
        width: 9,
        height: 12
      }
    },
    {
      id: "2",
      label: "plant2",
      person: "@fede4rodriguez",
      box: {
        top: 31,
        left: 63,
        width: 13,
        height: 17
      }
    }
  ]
}

export type Analisys = typeof ANALYSIS;

export type Detection = typeof ANALYSIS.detections[0];

export type Image = typeof ANALYSIS.image;