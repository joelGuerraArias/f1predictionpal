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
  const driver = driverId ? drivers.find(d => d.id === driverId) : null;

  return (
    <div
      className={`relative ${
        position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"
      }`}
      onClick={onPositionClick}
    >
      <div className={`
        relative rounded-2xl overflow-hidden cursor-pointer
        ${isSelected ? "ring-2 ring-f1-red" : ""}
      `}>
        <div className="h-48 flex items-center justify-center p-4">
          {isMobile ? (
            <div className="flex flex-col items-center gap-4">
              {driver ? (
                <>
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-red-50 border-2 border-f1-red">
                    <img
                      src={driver.imageUrl}
                      alt={driver.name}
                      className="w-full h-full object-contain transform scale-[1.37]"
                    />
                  </div>
                  <div className="text-lg font-bold px-4 py-2 rounded-full bg-f1-dark text-white">
                    P{position}
                  </div>
                </>
              ) : (
                <div className="text-2xl font-bold text-white bg-f1-dark px-4 py-2 rounded-full">
                  {isSelected ? "Selecciona piloto" : `P${position}`}
                </div>
              )}
            </div>
          ) : (
            // Desktop version - mantiene el diseño original
            <div className="flex flex-col items-center gap-2">
              {driver ? (
                <>
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
                </>
              ) : (
                <div className="text-2xl font-bold text-white bg-f1-dark px-4 py-2 rounded-full">
                  P{position}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};