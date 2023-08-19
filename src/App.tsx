import ImageCanvas from "./components/ImageCanvas";
import { ANALYSIS } from "./data/analysis";

function App() {

  const { image_url, detections } = ANALYSIS;

  return (
    <>
      <header className="flex items-center">      
        <h1 className="text-xxl">Image <span className="text-blue-400">canvas</span></h1>
      </header>
      <main>

        <ImageCanvas image_url= {image_url} detections={detections} />
      </main>
    </>
  )
}

export default App
