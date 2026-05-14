import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

const Controls = ({ goPrev, goNext, resetFlip, disablePrev, disableNext }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">

    
      <button
        onClick={goPrev}
        disabled={disablePrev}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      
      <button
        onClick={resetFlip}
        className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      
      <button
        onClick={goNext}
        disabled={disableNext}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next <ArrowRight className="w-4 h-4" />
      </button>

    </div>
  );
};

export default Controls;