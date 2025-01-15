import { Flag } from "lucide-react";
import { drivers } from "@/data/drivers";

interface PolePositionProps {
  selectedDriver: number | null;
  isSelecting: boolean;
  onPoleClick: () => void;
}

export const PolePosition = ({ selectedDriver, isSelecting, onPoleClick }: PolePositionProps) => {
  const driver = selectedDriver ? drivers.find(d => d.id === selectedDriver) : null;

  return (
    <div className="relative" onClick={onPoleClick}>
      {/* Position indicator */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-f1-red text-white px-2 py-1 text-sm font-bold rounded z-20">
        POLE
      </div>

      {/* Main container */}
      <div className={`
        relative bg-[#8E9196]/10 rounded-2xl overflow-hidden
        ${isSelecting ? "ring-2 ring-f1-red" : ""}
      `}>
        {/* Driver image container */}
        <div className="h-48 flex items-center justify-center p-4">
          {driver ? (
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={driver.imageUrl}
                alt={driver.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <span className="text-gray-400">
              {isSelecting ? "Selecciona un piloto" : "Arrastra o selecciona"}
            </span>
          )}
        </div>

        {/* Position text banner */}
        <div className="bg-f1-red text-white font-bold py-2 text-center">
          POLE POSITION
        </div>
      </div>
    </div>
  );
};