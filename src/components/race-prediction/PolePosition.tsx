import { Flag } from "lucide-react";
import { drivers } from "@/data/drivers";

interface PolePositionProps {
  selectedDriver: number | null;
  isSelecting: boolean;
  onPoleClick: () => void;
}

export const PolePosition = ({
  selectedDriver,
  isSelecting,
  onPoleClick,
}: PolePositionProps) => {
  const driver = selectedDriver ? drivers.find(d => d.id === selectedDriver) : null;

  return (
    <div className="relative" onClick={onPoleClick}>
      {/* Position badge */}
      <div className="absolute top-2 left-2 bg-f1-dark text-white font-bold w-8 h-8 flex items-center justify-center rounded-lg z-10">
        <Flag className="h-4 w-4" />
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
              {isSelecting ? "Selecciona un piloto" : "Seleccionar piloto"}
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