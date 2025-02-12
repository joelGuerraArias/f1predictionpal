import { drivers } from "@/data/drivers";

interface PodiumPositionProps {
  position: number;
  driverId: number | null;
  isSelected: boolean;
  onPositionClick: () => void;
}

export const PodiumPosition = ({
  position,
  driverId,
  isSelected,
  onPositionClick,
}: PodiumPositionProps) => {
  const positionText = position === 1 ? "PRIMERO" : position === 2 ? "SEGUNDO" : "TERCERO";
  const driver = driverId ? drivers.find(d => d.id === driverId) : null;

  return (
    <div
      className={`relative ${
        position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"
      }`}
      onClick={onPositionClick}
    >
      {/* Position indicator */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-f1-red text-white px-2 py-1 text-sm font-bold rounded z-20">
        P{position}
      </div>

      {/* Main container */}
      <div className={`
        relative bg-[#8E9196]/10 rounded-2xl overflow-hidden
        ${isSelected ? "ring-2 ring-f1-red" : ""}
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
              {isSelected ? "Selecciona un piloto" : "Arrastra o selecciona"}
            </span>
          )}
        </div>

        {/* Position text banner */}
        <div className="bg-f1-red text-white font-bold py-2 text-center">
          {positionText}
        </div>
      </div>
    </div>
  );
};