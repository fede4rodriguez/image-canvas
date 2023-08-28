import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type Image, type Detection } from "../data/analysis";

interface Zoom {
  value: number, 
  info?: {
    pictureMouseX: number, 
    pictureMouseY: number, 
    pictureHeight: number, 
    pictureWidth: number
  }
}

interface Pan {
  x: number, 
  y: number
}

interface Panning {
  value: boolean,
  info?: {
    startClientX: number, 
    startClientY: number
  }
}

interface Props { 
  image: Image;
  detections: Detection[];
  children: React.ReactNode;
}

function DetectionsCanvas({image, children}: Props) {

  const aspectRatio = useMemo(() => {
    return image.size.width / image.size.height
  }, [image]);

  const [zoom, setZoom] = useState<Zoom>({value: 100});
  const [pan, setPan] = useState<Pan>({x: 0,y: 0});
  const [isPanning, setIsPanning] = useState<Panning>({value: false});
  const mousePositionRef = useRef({x: 0, y: 0});

  const pictureRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetZoom = () => {
    setZoom({value: 100});
    setPan({x:0,y:0})
  }

  const calculateOverflowNewPan = useCallback(({ possibleNewX, possibleNewY }: { possibleNewX: number, possibleNewY: number}) => {

    const absX = Math.abs(possibleNewX);
    const absY = Math.abs(possibleNewY);

    const { width: pictureWidth, height: pictureHeight } = pictureRef?.current?.getBoundingClientRect() ?? { width: 0, height: 0};
    const { width: containerWidth, height: containerHeight } = containerRef?.current?.getBoundingClientRect() ?? { width: 0, height: 0};

    const maxX = (pictureWidth - containerWidth + 4) / 2;
    const maxY = (pictureHeight - containerHeight + 2.25) / 2;

    if(absX >= maxX) {
      if(possibleNewX < 0) {
        possibleNewX = -maxX;
      } else {
        possibleNewX = maxX;
      }
    }

    if(absY > maxY) {
      if(possibleNewY < 0) {
        possibleNewY = -maxY;
      } else {
        possibleNewY = maxY;
      }
    }

    return { newX: possibleNewX, newY: possibleNewY };

  }, []);

  // event listener for zooming
  useEffect(() => {

    if(!pictureRef.current) return;

    const picture = pictureRef.current;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();

      const zoomFactor = 10;
      const zoomIn = e.deltaY < 0;

      const { width: pictureWidth, height: pictureHeight, left: pictureLeft, top: pictureTop } = picture.getBoundingClientRect();

      const { clientX: windowMouseX, clientY: windowMouseY } = e;

      const pictureMouseX = windowMouseX - pictureLeft;
      const pictureMouseY = windowMouseY - pictureTop;

      setZoom((currentZoom) => {

        const { value } = currentZoom;

        let newValue = zoomIn ? value + zoomFactor : value - zoomFactor;
        newValue = (newValue > 100) ? newValue : 100;

        return { value: newValue, info: { pictureMouseX, pictureMouseY, pictureWidth, pictureHeight } }

      });

    }

    picture.addEventListener("wheel", wheelHandler);

    return () => {
      picture.removeEventListener("wheel", wheelHandler);
    };

  }, []);

  // save position mouse when zoom changes
  useEffect(() => {

    if(!pictureRef.current) return;
  
    const picture = pictureRef.current;
      
    const mouseMoveHandler = (e: MouseEvent) => {
      e.preventDefault();
      const {clientX, clientY} = e;     
      
      mousePositionRef.current = {x: clientX, y: clientY};
    };

    picture.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      picture.removeEventListener("mousemove", mouseMoveHandler);
    };

  }, []);

  // recalculate pan when zoom changes
  useEffect(() => {

    const { current: picture } = pictureRef ?? {};
    const { info: infoInitial } = zoom;

    if(!infoInitial || ! picture ) return;

    /*

      FORMULAS:
      
      PUNTO = TAMAÑOcurrent * MOUSEinitial / TAMAÑOinitial
      DELTA = PUNTO - MOUSEcurrent
      PAN = PANcurrent + DELTA

    */

    const { 
      width: widthCurrent, 
      height: heightCurrent,
      left: pictureLeftOfWindowsCurrent,
      top: pictureTopOfWindowsCurrent
    } = picture.getBoundingClientRect();

    const { x: mouseXOfWindows, y: mouseYOfWindows } = mousePositionRef.current;

    const mouseXCurrent = mouseXOfWindows - pictureLeftOfWindowsCurrent;
    const mouseYCurrent = mouseYOfWindows - pictureTopOfWindowsCurrent;
    
    const { 
      pictureWidth: widthInitial, 
      pictureHeight: heightInitial, 
      pictureMouseX: mouseXInitial,
      pictureMouseY: mouseYInitial
    } = infoInitial;


    // calculate Punto (pixel de la imagen que quiero que quede en el mismo lugar)
    const puntoX = widthCurrent * mouseXInitial / widthInitial;
    const puntoY = heightCurrent * mouseYInitial / heightInitial;


    // calculate Delta (diferencia entre el punto y el mouse actual)
    const deltaX = puntoX - mouseXCurrent;
    const deltaY = puntoY - mouseYCurrent;

    // calculate new pan
    const possibleNewX = pan.x - deltaX;
    const possibleNewY = pan.y - deltaY;

    const {newX, newY} = calculateOverflowNewPan({possibleNewX, possibleNewY});

    if(newX === pan.x && newY === pan.y) return;
    
    setPan({x: newX, y: newY});

  }, [zoom]);

  // event listener for panning active
  useEffect(() => {
      
      if(!pictureRef.current) return;
  
      const picture = pictureRef.current;
  
      const mouseDownHandler = (e: MouseEvent) => {        
        const startClientX = e.clientX;
        const startClientY = e.clientY;
        
        setIsPanning({value: true, info: { startClientX, startClientY }});
      };
  
      const mouseLeaveHandler = () => {
        setIsPanning({value: false});
      };
  
      const mouseUpHandler = () => {
        setIsPanning({value: false});
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

    const { current: picture } = pictureRef ?? {};
    const { value: panningValue, info: panningInfo } = isPanning;

    if(!picture || !panningValue || !panningInfo) return;

    const { startClientX, startClientY } = panningInfo;

    const { x: startPanX, y: startPanY } = pan;

    const mouseMoveHandler = (e: MouseEvent) => {
      e.preventDefault();
      const {clientX, clientY} = e;

      const walkX = (clientX - startClientX);
      const walkY = (clientY - startClientY);

      const possibleNewX = startPanX + walkX;
      const possibleNewY = startPanY + walkY;

      const { newX, newY } = calculateOverflowNewPan({possibleNewX, possibleNewY});      
      
      setPan({ x: newX,  y: newY });

    };

    picture.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      picture.removeEventListener("mousemove", mouseMoveHandler);
    };

  }, [isPanning]);

  return (
    <div 
      ref={containerRef}
      style={{aspectRatio}}
      className="bg-zinc-800 rounded-lg border-2 border-zinc-700 overflow-hidden w-[80vw] max-w-[80vw] min-w-[80vw] grid justify-items-center content-center relative">
      
      <picture ref={pictureRef} className="relative cursor-pointer" style={{width: `${zoom.value}%`, transform: `translate(${pan.x}px,${pan.y}px)`}}>
        <img src={image.url} alt="Foto de campo" className="w-full h-full" />
        {children}
      </picture>
      <div className="absolute bg-gray-700 px-2 py-1 top-2 left-2 rounded-md flex gap-2 flex-row">
        <span>{`zoom: ${zoom.value}%`}</span>
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
