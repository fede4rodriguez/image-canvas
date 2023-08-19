import { useEffect, useRef, useState } from "react";
import { type Detection } from "../data/analysis";
import DetectionBox from "./Detection";


interface Props { 
  image_url: string;
  detections: Detection[];
}

function DetectionsCanvas({image_url, detections}: Props) {

  const imgRef = useRef<HTMLImageElement>();

  const [zoom, setZoom] = useState(100);

  // event listener for zooming
  useEffect(() => {

    if(!imgRef.current) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom((prev) => prev + 10);
      } else {        
        setZoom((prev) => (prev-10 > 100) ? prev - 10 : 100);
      }
    };

    imgRef.current.addEventListener("wheel", wheelHandler);

    return () => {
      if(!imgRef.current) return;
      imgRef.current.removeEventListener("wheel", wheelHandler);
    };

  }, []);

  

  

  return (
    <div 
      className="bg-zinc-800 rounded-lg border-2 border-zinc-700 overflow-hidden w-[90vw] max-w-[90vw] min-w-[90vw] h-[70vh] max-h-[70vh] min-h-[70vh] grid justify-items-center content-center relative">
      
      <picture  className="relative" style={{width:`${zoom}%`, transform: 'translate(0%,0%)'}}>
        <img ref={imgRef} src={image_url} className="w-full min-w-full" />
        {
          detections.map((detection) => (
            <DetectionBox key={detection.id} detection={detection}/>
          ))
        }
      </picture>
      <div className="absolute bg-gray-700 px-2 py-1 top-2 left-2 rounded-md flex gap-2 flex-row">
        <span>{`${zoom}%`}</span>
        <button onClick={() => { setZoom(100) }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );

}

export default DetectionsCanvas;
