import { type Detection } from "../data/analysis";


interface Props { 
  image_url: string;
  detections: Detection[];
}

function ImageCanvas({image_url}: Props) {

  console.log(image_url);

  return (
    <>
      <img src={image_url} alt="" />
    </>
  );

}

export default ImageCanvas;
