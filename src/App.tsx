import { useState } from "react";
import DetectionBox from "./components/DetectionBox";
import DetectionsCanvas from "./components/DetectionsCanvas";
import { ANALYSIS, type Detection } from "./data/analysis";

function App() {

  const { image } = ANALYSIS;

  const [detections, setDetections] = useState<Detection[]>(ANALYSIS.detections);

  const createUpdateBox = (id: string) => (box: any) => { // TODO: type box
    
    setDetections((prev) => 
      prev.map((detection) => {
        if (detection.id === id) {
          return {
            ...detection,
            box
          }
        }
        return detection;
      })
  );

  };

  return (
    <>
      <header className="flex items-center">      
        <h1 className="text-6xl font-bold">Dectections<span className="text-blue-400">Canvas</span></h1>
      </header>
      <main className="w-full grid place-content-center">
        <DetectionsCanvas image= {image} detections={detections}>          
          {
            detections.map((detection) => (
              <DetectionBox key={detection.id} updateBox={createUpdateBox(detection.id)} detection={detection}/>
            ))
          }
        </DetectionsCanvas>
      </main>
    </>
  )
}

export default App
