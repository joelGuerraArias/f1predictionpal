import { drivers } from "@/data/drivers";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const isMobile = useIsMobile();

  const topVotedDrivers = [
    { name: "MAX VERSTAPPEN", percentage: "100", imageUrl: "https://fgjpullzone.b-cdn.net/f1/para%20victoria/race_verstappen.png" },
    { name: "CHARLES LECLERC", percentage: "75", imageUrl: "https://fgjpullzone.b-cdn.net/f1/para%20victoria/race_leclerc.png" },
    { name: "FERNANDO ALONSO", percentage: "50", imageUrl: "https://fgjpullzone.b-cdn.net/f1/para%20victoria/race_alonso.png" },
  ];

  const TopVotedSection = () => (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <h3 className="text-2xl font-bold mb-8 text-center uppercase">PARA LA VICTORIA</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {topVotedDrivers.map((driver) => (
          <div key={driver.name} className="bg-white border border-gray-200 rounded-xl p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex flex-col items-center space-y-4">
              <img
                src={driver.imageUrl}
                alt={driver.name}
                className="w-32 h-32 object-contain"
              />
              <div className="text-center">
                <div className="font-bold text-lg">{driver.name}</div>
                <div className="text-f1-red font-bold text-xl">{driver.percentage} %</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-8">
        <TopVotedSection />
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {drivers.map((driver) => {
              const isSelected = selectedDriverIds.includes(driver.id) || polePositionDriver === driver.id;
              return (
                <CarouselItem key={driver.id} className="basis-full">
                  <div
                    draggable
                    id={String(driver.id)}
                    className={`relative bg-white border ${
                      isSelected ? 'border-f1-red bg-red-50' : 'border-gray-200'
                    } rounded-lg p-2 cursor-pointer hover:border-f1-red transition-colors mx-auto`}
                    onClick={() => onDriverClick(driver.id)}
                  >
                    <div className="flex flex-col">
                      <div className="aspect-square overflow-hidden rounded-lg m-3" style={{ transform: 'scale(1.37)' }}>
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
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <TopVotedSection />
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
                <div className="aspect-square overflow-hidden rounded-lg m-3" style={{ transform: 'scale(1.37)' }}>
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
    </div>
  );
};