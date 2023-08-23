import DetectionBox from "./components/DetectionBox";
import DetectionsCanvas from "./components/DetectionsCanvas";
import { ANALYSIS } from "./data/analysis";

function App() {

  const { image, detections } = ANALYSIS;

  return (
    <>
      <header className="flex items-center">      
        <h1 className="text-6xl font-bold">Dectections<span className="text-blue-400">Canvas</span></h1>
      </header>
      <main className="w-full grid place-content-center">
        <DetectionsCanvas image= {image} detections={detections}>
          <img src={image.url} className="w-full h-full" />
          {
            detections.map((detection) => (
              <DetectionBox key={detection.id} detection={detection}/>
            ))
          }
        </DetectionsCanvas>
      </main>
    </>
  )
}

export default App
