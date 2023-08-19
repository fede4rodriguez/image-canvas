import ImageCanvas from "./components/ImageCanvas";
import { ANALYSIS } from "./data/analysis";


function App() {

  const { image_url, detections } = ANALYSIS;

  return (
    <>
      <h1>Image canvas</h1>
      
      <ImageCanvas image_url= {image_url} detections={detections} />
    </>
  )
}

export default App
