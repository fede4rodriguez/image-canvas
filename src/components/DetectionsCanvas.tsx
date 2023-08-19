import { type Detection } from "../data/analysis";


interface Props { 
  image_url: string;
  detections: Detection[];
}

function DetectionsCanvas({image_url}: Props) {

  console.log(image_url);

  return (
    <picture className="relative">
      <img src={image_url} alt="" />
    </picture>
  );

}

export default DetectionsCanvas;
