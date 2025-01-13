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
      className={`bg-gray-100 p-4 rounded-lg text-center ${
        isSelected ? "ring-2 ring-f1-red" : ""
      } ${
        position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"
      }`}
      onClick={onPositionClick}
    >
      <div className="text-f1-red font-bold mb-2">{positionText}</div>
      <div className="h-28 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
        {driver ? (
          <div className="flex items-center justify-center w-full h-full">
            <img
              src={driver.imageUrl}
              alt={driver.name}
              className="w-full h-full object-contain transform scale-110"
            />
          </div>
        ) : (
          <span className="text-gray-400">
            {isSelected ? "Selecciona un piloto" : "Arrastra o selecciona"}
          </span>
        )}
      </div>
    </div>
  );
};