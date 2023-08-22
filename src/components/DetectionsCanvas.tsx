import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const [isDown, setIsDown] = useState<{startClientX: number, startClientY: number} | null>(null);

  const pictureRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetZoom = () => {
    setZoom(100);
  }

  const calculateNewPan = useCallback(({ newX, newY }: { newX: number, newY: number}) => {

    const absX = Math.abs(newX);
    const absY = Math.abs(newY);

    const { width: pictureWidth, height: pictureHeight } = pictureRef?.current?.getBoundingClientRect() ?? { width: 0, height: 0};
    const { width: containerWidth, height: containerHeight } = containerRef?.current?.getBoundingClientRect() ?? { width: 0, height: 0};

    const maxX = (pictureWidth - containerWidth + 4) / 2;
    const maxY = (pictureHeight - containerHeight + 2.25) / 2;

    if(absX >= maxX) {
      if(newX < 0) {
        newX = -maxX;
      } else {
        newX = maxX;
      }
    }

    if(absY > maxY) {
      if(newY < 0) {
        newY = -maxY;
      } else {
        newY = maxY;
      }
    }

    return { newX, newY };

  }, [pictureRef, containerRef]);

  // event listener for zooming
  useEffect(() => {

    if(!pictureRef.current) return;

    const picture = pictureRef.current;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();

      const zoomFactor = 10;
      const zoomIn = e.deltaY < 0;
      const newZoom = zoomIn ? zoom + zoomFactor : zoom - zoomFactor;

      setZoom((newZoom > 100) ? newZoom : 100);

    }

    picture.addEventListener("wheel", wheelHandler);

    return () => {
      picture.removeEventListener("wheel", wheelHandler);
    };

  }, [zoom, pan, calculateNewPan]);

  // recalculate pan when zoom changes
  useEffect(() => {
    setPan((prevPan) => {
      const {newX, newY} = calculateNewPan({newX: prevPan.x, newY: prevPan.y});

      return {x: newX, y: newY};
    });
  }, [zoom, calculateNewPan]);

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
      const {clientX, clientY} = e;

      const walkX = (clientX - startClientX);
      const walkY = (clientY - startClientY);

      const { newX, newY } = calculateNewPan({newX: startPanX + walkX, newY: startPanY + walkY});      
      
      setPan({ x: newX,  y: newY });

    };

    picture.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      picture.removeEventListener("mousemove", mouseMoveHandler);
    };

  }, [isDown, zoom, calculateNewPan]);

  return (
    <div 
      ref={containerRef}
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
        <span>{`zoom: ${zoom}% pan-x: ${pan.x} pan-y: ${pan.y}`}</span>
        <button onClick={resetZoom}>
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
