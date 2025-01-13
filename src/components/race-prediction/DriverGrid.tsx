import { drivers } from "@/data/drivers";

interface DriverGridProps {
  selectedDriverIds: number[];
  polePositionDriver: number | null;
  onDriverClick: (driverId: number) => void;
}

export const DriverGrid = ({
  selectedDriverIds,
  polePositionDriver,
  onDriverClick,
}: DriverGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {drivers.map((driver) => {
        const isSelected = selectedDriverIds.includes(driver.id) || polePositionDriver === driver.id;
        return (
          <div
            key={driver.id}
            draggable
            id={String(driver.id)}
            className={`relative bg-white border ${
              isSelected ? 'border-f1-red bg-red-50' : 'border-gray-200'
            } rounded-lg p-2 cursor-pointer hover:border-f1-red transition-colors`}
            onClick={() => onDriverClick(driver.id)}
          >
            <div className="flex flex-col">
              <div className="aspect-square overflow-hidden rounded-lg m-3" style={{ transform: 'scale(1.25)' }}>
                <img
                  src={driver.imageUrl}
                  alt={driver.name}
                  className="w-full h-full object-contain"
                />
              </div>
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-f1-red text-white text-xs px-2 py-1 rounded-full">
                  {polePositionDriver === driver.id 
                    ? 'POLE' 
                    : `P${selectedDriverIds.indexOf(driver.id) + 1}`}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};