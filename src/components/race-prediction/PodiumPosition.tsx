import { drivers } from "@/data/drivers";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const positionText = position === 1 ? "PRIMERO" : position === 2 ? "SEGUNDO" : "TERCERO";
  const driver = driverId ? drivers.find(d => d.id === driverId) : null;

  return (
    <div
      className={`relative ${
        position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"
      }`}
      onClick={onPositionClick}
    >
      {/* Position number badge */}
      <div className="absolute top-2 left-2 bg-f1-dark text-white font-bold w-8 h-8 flex items-center justify-center rounded-lg z-10">
        {position}
      </div>

      {/* Main container */}
      <div className={`
        relative bg-[#8E9196]/10 rounded-2xl overflow-hidden cursor-pointer
        ${isSelected ? "ring-2 ring-f1-red" : ""}
      `}>
        {/* Driver image container */}
        <div className="h-48 flex items-center justify-center p-4">
          {driver ? (
            isMobile ? (
              isSelected ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-red-50 border-2 border-f1-red">
                    <img
                      src={driver.imageUrl}
                      alt={driver.name}
                      className="w-full h-full object-contain transform scale-[1.37]"
                    />
                  </div>
                  <div className="text-lg font-bold px-4 py-2 rounded-full bg-f1-red text-white">
                    P{position}
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-f1-red">
                  P{position}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-red-50 border-2 border-f1-red">
                  <img
                    src={driver.imageUrl}
                    alt={driver.name}
                    className="w-full h-full object-contain transform scale-[1.37]"
                  />
                </div>
                <div className="text-sm font-bold px-3 py-1 rounded-full bg-gray-200 text-gray-700">
                  P{position}
                </div>
              </div>
            )
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