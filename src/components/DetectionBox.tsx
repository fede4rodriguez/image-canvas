import { useEffect, useRef, useState } from "react";
import { Detection } from "../data/analysis";

interface Changing {
  value: boolean;
  info?: {
    startClientX: number;
    startClientY: number;
    startBoxHeightPx: number;
    startBoxWidthPx: number;
    startBoxTopPercentage: number;
    startBoxLeftPercentage: number;
    startBoxHeightPercentage: number;
    startBoxWidthPercentage: number;    
  };
}

interface Props {
  detection: Detection;
}

function DetectionBox({ detection }: Props) {
  
  const { label, person } = detection;

  const buttonSizeRef = useRef<HTMLButtonElement>(null);
  const buttonPositionRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const [box, setBox] = useState(detection.box);  

  const [isChangingSize , setIsChangingSize] = useState<Changing>({ value: false });
  const [isChangingPosition , setIsChangingPosition] = useState<Changing>({ value: false });

  // change the Size of the button
  useEffect(() => {
    const { current: button } = buttonSizeRef ?? {};
    const { current: div } = divRef ?? {};

    if (!button || !div) return;

    const mouseDownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const { clientX: startClientX, clientY: startClientY }= e;
      const { height: startBoxHeightPx, width: startBoxWidthPx } = div.getBoundingClientRect();
      const { 
        height: startBoxHeightPercentage, 
        width: startBoxWidthPercentage,
        top: startBoxTopPercentage,
        left: startBoxLeftPercentage
       } = box;

      setIsChangingSize({
        value: true,
        info: { 
          startClientX, 
          startClientY, 
          startBoxHeightPx, 
          startBoxWidthPx, 
          startBoxHeightPercentage, 
          startBoxWidthPercentage,
          startBoxTopPercentage,
          startBoxLeftPercentage 
        }
      });
    };

    /*const mouseUpHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsChangingSize({ value: false });
    };

    const mouseLeaveHandler = () => {
      setIsChangingSize({value: false});
    };*/

    button.addEventListener("mousedown", mouseDownHandler);
    //button.addEventListener("mouseup", mouseUpHandler);    
    //button.addEventListener("mouseleave", mouseLeaveHandler);

    return () => {
      button.removeEventListener("mousedown", mouseDownHandler);
      //button.removeEventListener("mouseup", mouseUpHandler);
      //button.removeEventListener("mouseleave", mouseLeaveHandler);
    };
  }, [box]);

  useEffect(() => {
    const { current: button } = buttonSizeRef ?? {};
    const { value: changingValue, info: changingInfo } = isChangingSize;

    if (!button || !changingValue || !changingInfo) return;

    const { 
      startClientX, 
      startClientY, 
      startBoxHeightPx, 
      startBoxWidthPx, 
      startBoxHeightPercentage, 
      startBoxWidthPercentage,
      startBoxTopPercentage,
      startBoxLeftPercentage 
    } = changingInfo;

    const mouseMoveHandler = (e: MouseEvent) => {
      e.preventDefault();
      const { clientX, clientY } = e;

      const walkPxsWidth = clientX - startClientX;
      const walkPxsHeight = clientY - startClientY;

      const walkPercentageHeight = walkPxsHeight * startBoxHeightPercentage / startBoxHeightPx;
      const walkPercentageWidth = walkPxsWidth * startBoxWidthPercentage / startBoxWidthPx;

      let newHeight = startBoxHeightPercentage + walkPercentageHeight;
      let newWidth = startBoxWidthPercentage + walkPercentageWidth;      

      const newBottom = newHeight + startBoxTopPercentage;
      const newRight = newWidth + startBoxLeftPercentage;

      if(newBottom > 100) newHeight = 100 - startBoxTopPercentage;
      if(newRight > 100) newWidth = 100 - startBoxLeftPercentage;
      if(newHeight < 1) newHeight = 1;
      if(newWidth < 1) newWidth = 1;

      setBox((prev) => ({ ...prev, height: newHeight, width: newWidth }));
    };

    const mouseUpHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsChangingSize({ value: false });
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler); 

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [isChangingSize]);

  // change the Position of the button
  useEffect(() => {
    const { current: button } = buttonPositionRef ?? {};
    const { current: div } = divRef ?? {};

    if (!button || !div) return;

    const mouseDownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const { clientX: startClientX, clientY: startClientY }= e;
      const { height: startBoxHeightPx, width: startBoxWidthPx } = div.getBoundingClientRect();
      const { 
        height: startBoxHeightPercentage, 
        width: startBoxWidthPercentage,
        top: startBoxTopPercentage,
        left: startBoxLeftPercentage
       } = box;

      setIsChangingPosition({
        value: true,
        info: { 
          startClientX, 
          startClientY, 
          startBoxHeightPx, 
          startBoxWidthPx, 
          startBoxTopPercentage,
          startBoxLeftPercentage,
          startBoxHeightPercentage, 
          startBoxWidthPercentage
        }
      });
    };

    button.addEventListener("mousedown", mouseDownHandler);

    return () => {
      button.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [box]);

  useEffect(() => {
    const { current: button } = buttonPositionRef ?? {};
    const { value: changingValue, info: changingInfo } = isChangingPosition;

    if (!button || !changingValue || !changingInfo) return;

    const { 
      startClientX, 
      startClientY, 
      startBoxHeightPx, 
      startBoxWidthPx, 
      startBoxTopPercentage,
      startBoxLeftPercentage,
      startBoxHeightPercentage, 
      startBoxWidthPercentage 
    } = changingInfo;

    if(!startBoxTopPercentage || !startBoxLeftPercentage) return;

    const mouseMoveHandler = (e: MouseEvent) => {
      e.preventDefault();
      const { clientX, clientY } = e;

      const walkPxsX = clientX - startClientX;
      const walkPxsY = clientY - startClientY;

      const walkPercentageLeft = walkPxsX * startBoxWidthPercentage / startBoxWidthPx;
      const walkPercentageTop = walkPxsY * startBoxHeightPercentage / startBoxHeightPx;
      const walkPercentageWidth = walkPxsX * startBoxWidthPercentage / startBoxWidthPx;
      const walkPercentageHeight = walkPxsY * startBoxHeightPercentage / startBoxHeightPx;      

      setBox((prev) => {
        let newTop = startBoxTopPercentage + walkPercentageTop;
        let newLeft = startBoxLeftPercentage + walkPercentageLeft;
        let newWidth = startBoxWidthPercentage - walkPercentageWidth;
        let newHeight = startBoxHeightPercentage - walkPercentageHeight;

        if(newTop < 0 || newHeight < 1) { newTop = prev.top; newHeight = prev.height; }
        if(newLeft < 0 || newWidth < 1) { newLeft = prev.left; newWidth = prev.width; }

        return { top: newTop, left: newLeft, width: newWidth, height: newHeight }
      });

    };

    const mouseUpHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsChangingPosition({ value: false });
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler)

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [isChangingPosition]);

  return (
    <div 
      ref={divRef}
      style={{ 
        height: `${box.height}%`,
        width: `${box.width}%`,
        top: `${box.top}%`,
        left: `${box.left}%`,
      }} 
      className="absolute border-2 border-green-600">
      <span className="bg-green-600 absolute top-[-25px] right-[-2px]">
        {label}
      </span>
      <span className="bg-green-600 absolute bottom-[-25px] left-[-2px]">
        {person}
      </span>
      <button
        ref={buttonPositionRef}
        className="bg-green-600/50 absolute top-[-10px] left-[-10px] h-[20px] w-[20px] cursor-nwse-resize"
      ></button>
      <button
        ref={buttonSizeRef}
        className="bg-green-600/50 absolute bottom-[-10px] right-[-10px] h-[20px] w-[20px] cursor-nwse-resize"
      ></button>      
    </div>
  );
}

export default DetectionBox;
