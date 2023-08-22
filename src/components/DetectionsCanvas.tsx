import { useEffect, useMemo, useRef, useState } from "react";
import { type Image, type Detection } from "../data/analysis";
import DetectionBox from "./DetectionBox";


interface Props { 
  image: Image;
  detections: Detection[];
}

function DetectionsCanvas({image, detections}: Props) {

  const aspectRatio = useMemo(() => {
    return image.size.width / image.size.height
  }, [image]);
  
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({x: 0, y: 0});

  const [isDown, setIsDown] = useState<any>(null);

  const pictureRef = useRef<HTMLElement>(null);

  // event listener for zooming
  useEffect(() => {

    if(!pictureRef.current) return;

    const picture = pictureRef.current;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom((prev) => prev + 10);
      } else {        
        setZoom((prev) => (prev-10 > 100) ? prev - 10 : 100);
      }
    };

    picture.addEventListener("wheel", wheelHandler);

    return () => {
      picture.removeEventListener("wheel", wheelHandler);
    };

  }, []);

  // event listener for panning active
  useEffect(() => {
      
      if(!pictureRef.current) return;
  
      const picture = pictureRef.current;
  
      const mouseDownHandler = (e: MouseEvent) => {        
        const startClientX = e.clientX;
        const startClientY = e.clientY;
        
        setIsDown({startClientX, startClientY});
      };
  
      const mouseLeaveHandler = () => {
        setIsDown(null);
      };
  
      const mouseUpHandler = () => {
        setIsDown(null);
      };

      picture.addEventListener("mousedown", mouseDownHandler);
      picture.addEventListener("mouseleave", mouseLeaveHandler);
      picture.addEventListener("mouseup", mouseUpHandler);
  
      return () => {
        picture.removeEventListener("mousedown", mouseDownHandler);
        picture.removeEventListener("mouseleave", mouseLeaveHandler);
        picture.removeEventListener("mouseup", mouseUpHandler);
      };
  
  }, []);

  // event listener for panning move
  useEffect(() => {

    if(!pictureRef.current) return;

    if(!isDown) return;

    const picture = pictureRef.current;
    const startPanX = pan.x;
    const startPanY = pan.y;
    const startClientX = isDown.startClientX;
    const startClientY = isDown.startClientY;


    const mouseMoveHandler = (e: MouseEvent) => {
      e.preventDefault();
      const x = e.clientX;
      const y = e.clientY;
      const walkX = (x - startClientX);
      const walkY = (y - startClientY);
      
      setPan({
        x: startPanX + walkX,
        y: startPanY + walkY,
      });

    };

    picture.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      picture.removeEventListener("mousemove", mouseMoveHandler);
    };

  }, [isDown]);

  return (
    <div 
      style={{aspectRatio}}
      className="bg-zinc-800 rounded-lg border-2 border-zinc-700 overflow-hidden w-[90vw] max-w-[90vw] min-w-[90vw] grid justify-items-center content-center relative">
      
      <picture ref={pictureRef} className="relative aspect-auto" style={{width: `${zoom}%`, transform: `translate(${pan.x}px,${pan.y}px)`}}>
        <img src={image.url} className="w-full h-full max-w-full" />
        {
          detections.map((detection) => (
            <DetectionBox key={detection.id} detection={detection}/>
          ))
        }
      </picture>
      <div className="absolute bg-gray-700 px-2 py-1 top-2 left-2 rounded-md flex gap-2 flex-row">
        <span>{`${zoom}%`}</span>
        <button onClick={() => { setZoom(100), setPan({x:0, y:0}) }}>
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
