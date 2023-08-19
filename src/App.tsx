import DetectionsCanvas from "./components/DetectionsCanvas";
import { ANALYSIS } from "./data/analysis";

function App() {

  const { image_url, detections } = ANALYSIS;

  return (
    <>
      <header className="flex items-center">      
        <h1 className="text-6xl font-bold">Dectections<span className="text-blue-400">Canvas</span></h1>
      </header>
      <main>
        <DetectionsCanvas image_url= {image_url} detections={detections} />
      </main>
    </>
  )
}

export default App
