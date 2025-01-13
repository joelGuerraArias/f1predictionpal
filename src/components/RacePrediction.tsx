import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Flag, Share2, Facebook, Twitter, Send, X } from "lucide-react";
import { drivers } from "@/data/drivers";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useToast } from "./ui/use-toast";

export const RacePrediction = () => {
  const { toast } = useToast();
  const [predictions, setPredictions] = useState({
    podium: [] as number[],
    pole: null as number | null,
    rain: false,
    dnf: false,
    safetyCar: false,
  });
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [selectingPole, setSelectingPole] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const driverId = Number(active.id);
    const position = Number(over.id);

    if (position >= 1 && position <= 3) {
      const newPodium = [...predictions.podium];
      // Remove driver from previous position if exists
      const oldIndex = newPodium.indexOf(driverId);
      if (oldIndex !== -1) {
        newPodium.splice(oldIndex, 1);
      }
      // Add driver to new position
      newPodium[position - 1] = driverId;
      
      setPredictions({
        ...predictions,
        podium: newPodium,
      });

      toast({
        title: "¡Piloto posicionado!",
        description: `${drivers.find(d => d.id === driverId)?.name} en posición ${position}`,
      });
    }
  };

  const handleDriverClick = (driverId: number) => {
    if (selectingPole) {
      setPredictions({
        ...predictions,
        pole: driverId,
      });
      setSelectingPole(false);
      
      toast({
        title: "¡Pole position seleccionada!",
        description: `${drivers.find(d => d.id === driverId)?.name} seleccionado para la pole`,
      });
      return;
    }

    if (selectedPosition !== null) {
      const newPodium = [...predictions.podium];
      newPodium[selectedPosition - 1] = driverId;
      
      setPredictions({
        ...predictions,
        podium: newPodium,
      });
      
      setSelectedPosition(null);
      
      toast({
        title: "¡Piloto seleccionado!",
        description: `${drivers.find(d => d.id === driverId)?.name} en posición ${selectedPosition}`,
      });
    }
  };

  const removeFromPodium = (position: number) => {
    const newPodium = [...predictions.podium];
    newPodium[position - 1] = 0; // Using 0 as empty position
    setPredictions({
      ...predictions,
      podium: newPodium,
    });
    toast({
      title: "Piloto removido",
      description: "Posición del podio liberada",
    });
  };

  const removeFromPole = () => {
    setPredictions({
      ...predictions,
      pole: null,
    });
    toast({
      title: "Pole position removida",
      description: "Selección de pole position liberada",
    });
  };

  const isDriverSelected = (driverId: number) => {
    return predictions.podium.includes(driverId) || predictions.pole === driverId;
  };

  return (
    <div className="w-full px-4">
      <Card className="bg-white shadow-xl max-w-[2000px] mx-auto">
        <div className="p-6 space-y-8">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold tracking-wider">
              <span className="text-gray-800">PREDICTOR</span>
              <span className="text-f1-red">/F1</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/lovable-uploads/5bf92527-3516-4110-9a4a-8b160a13117b.png" alt="PayPal" className="h-8" />
            </div>
          </div>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Driver selection */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {drivers.map((driver) => {
                    if (isDriverSelected(driver.id)) return null;
                    return (
                      <div
                        key={driver.id}
                        draggable
                        id={String(driver.id)}
                        className="relative bg-white border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-f1-red transition-colors"
                        onClick={() => handleDriverClick(driver.id)}
                      >
                        <div className="flex flex-col">
                          <div className="aspect-square overflow-hidden rounded-lg" style={{ transform: 'scale(1.2)' }}>
                            <img
                              src={driver.imageUrl}
                              alt={driver.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="mt-2 text-center">
                            <div className="text-xs font-bold">{driver.number}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right column - Podium and additional predictions */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[2, 1, 3].map((position) => (
                    <div
                      key={position}
                      id={String(position)}
                      className={`bg-gray-100 p-4 rounded-lg text-center ${
                        selectedPosition === position ? "ring-2 ring-f1-red" : ""
                      } ${
                        position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"
                      }`}
                      onClick={() => setSelectedPosition(position)}
                    >
                      <div className="text-f1-red font-bold mb-2">
                        {position === 1 ? "PRIMERO" : position === 2 ? "SEGUNDO" : "TERCERO"}
                      </div>
                      <div className="relative h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {predictions.podium[position - 1] ? (
                          <div className="flex flex-col items-center w-full">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromPodium(position);
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-100 rounded-full hover:bg-red-200"
                            >
                              <X className="h-4 w-4 text-f1-red" />
                            </button>
                            <img
                              src={drivers.find(d => d.id === predictions.podium[position - 1])?.imageUrl}
                              alt="Selected driver"
                              className="h-20 w-full object-contain transform scale-120"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            {selectedPosition === position 
                              ? "Selecciona un piloto" 
                              : "Arrastra o selecciona"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="flex items-center text-f1-red font-bold mb-2">
                    <Flag className="mr-2 h-4 w-4" />
                    POLE POSITION
                  </h4>
                  <div 
                    className={`relative h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-f1-red transition-colors ${selectingPole ? 'ring-2 ring-f1-red' : ''}`}
                    onClick={() => setSelectingPole(!selectingPole)}
                  >
                    {predictions.pole ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromPole();
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-100 rounded-full hover:bg-red-200"
                        >
                          <X className="h-4 w-4 text-f1-red" />
                        </button>
                        <img
                          src={drivers.find(d => d.id === predictions.pole)?.imageUrl}
                          alt="Pole position driver"
                          className="h-12 w-12 object-contain transform scale-120"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        {selectingPole ? "Selecciona un piloto" : "Seleccionar piloto"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">LLUVIA</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="rain"
                          className="form-radio text-f1-red"
                          checked={predictions.rain}
                          onChange={() => setPredictions({ ...predictions, rain: true })}
                        />
                        <span>SI</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="rain"
                          className="form-radio text-f1-red"
                          checked={!predictions.rain}
                          onChange={() => setPredictions({ ...predictions, rain: false })}
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold">ABANDONOS</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="dnf"
                          className="form-radio text-f1-red"
                          checked={predictions.dnf}
                          onChange={() => setPredictions({ ...predictions, dnf: true })}
                        />
                        <span>SI</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="dnf"
                          className="form-radio text-f1-red"
                          checked={!predictions.dnf}
                          onChange={() => setPredictions({ ...predictions, dnf: false })}
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold">SAFETY CAR</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="safetyCar"
                          className="form-radio text-f1-red"
                          checked={predictions.safetyCar}
                          onChange={() => setPredictions({ ...predictions, safetyCar: true })}
                        />
                        <span>SI</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="safetyCar"
                          className="form-radio text-f1-red"
                          checked={!predictions.safetyCar}
                          onChange={() => setPredictions({ ...predictions, safetyCar: false })}
                        />
                        <span>NO</span>
                      </label>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-f1-red hover:bg-red-700 text-white py-3 rounded-lg font-bold">
                  ENVIAR
                </Button>

                <div className="flex justify-center gap-4">
                  <Button variant="ghost" className="rounded-full bg-gray-700 hover:bg-gray-600 text-white p-2">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" className="rounded-full bg-gray-700 hover:bg-gray-600 text-white p-2">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" className="rounded-full bg-gray-700 hover:bg-gray-600 text-white p-2">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </DndContext>
        </div>
      </Card>
    </div>
  );
};
