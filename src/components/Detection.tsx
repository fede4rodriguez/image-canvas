import { Detection } from "../data/analysis";

interface Props { 
  detection: Detection;
}

function DetectionBox({ detection }: Props) {

  const { label, person, box } = detection;

  return (
    <div style={box} className="absolute border-2 border-green-600">
      <span className="bg-green-600 absolute top-[-25px] left-[-2px]">{label}</span>      
      <span className="bg-green-600 absolute bottom-[-25px] left-[-2px]">{person}</span> 
    </div>
  );

}

export default DetectionBox;