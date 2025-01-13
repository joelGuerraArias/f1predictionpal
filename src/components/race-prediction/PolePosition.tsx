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
    <div className="bg-gray-100 p-4 rounded-lg">
      <h4 className="flex items-center text-f1-red font-bold mb-2">
        <Flag className="mr-2 h-4 w-4" />
        POLE POSITION
      </h4>
      <div 
        className={`h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-f1-red transition-colors ${isSelecting ? 'ring-2 ring-f1-red' : ''}`}
        onClick={onPoleClick}
      >
        {driver ? (
          <div className="flex items-center gap-2">
            <img
              src={driver.imageUrl}
              alt="Pole position driver"
              className="h-12 w-12 object-contain transform scale-125"
            />
            <span className="text-sm font-medium">
              {driver.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">
            {isSelecting ? "Selecciona un piloto" : "Seleccionar piloto"}
          </span>
        )}
      </div>
    </div>
  );
};