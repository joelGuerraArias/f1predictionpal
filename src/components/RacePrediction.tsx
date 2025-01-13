import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Flag, Cloud, Car, Share2 } from "lucide-react";
import { drivers } from "@/data/drivers";

export const RacePrediction = () => {
  const [predictions, setPredictions] = useState({
    podium: [] as number[],
    pole: null as number | null,
    rain: false,
    dnf: false,
    safetyCar: false,
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card className="bg-f1-gray text-white shadow-xl">
        <div className="p-6 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-f1-red">GRAN PREMIO DE ARABIA</h2>
            <div className="flex gap-2">
              <Button variant="ghost" className="text-white hover:text-f1-red">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Driver selection */}
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="relative bg-f1-gray rounded-lg p-2 cursor-pointer hover:bg-f1-red/10 transition-colors"
                    onClick={() => {
                      // Handle driver selection logic
                    }}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={driver.imageUrl}
                        alt={driver.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="text-xs font-bold">{driver.number}</div>
                        <div className="text-xs truncate">{driver.name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - Podium and additional predictions */}
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[2, 1, 3].map((position) => (
                  <div
                    key={position}
                    className={`bg-f1-gray p-4 rounded-lg text-center ${
                      position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"
                    }`}
                  >
                    <div className="text-f1-red font-bold mb-2">
                      {position}º
                    </div>
                    <div className="h-24 bg-f1-dark/50 rounded-lg flex items-center justify-center">
                      {predictions.podium[position - 1] ? (
                        <img
                          src={drivers.find(d => d.id === predictions.podium[position - 1])?.imageUrl}
                          alt="Selected driver"
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-500">Seleccionar piloto</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-f1-gray p-4 rounded-lg">
                  <h4 className="flex items-center text-f1-red font-bold mb-2">
                    <Flag className="mr-2 h-4 w-4" />
                    Pole Position
                  </h4>
                  <div className="h-16 bg-f1-dark/50 rounded-lg flex items-center justify-center">
                    {predictions.pole ? (
                      <img
                        src={drivers.find(d => d.id === predictions.pole)?.imageUrl}
                        alt="Pole position driver"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-500">Seleccionar piloto</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-f1-red"
                      checked={predictions.rain}
                      onChange={(e) => setPredictions({ ...predictions, rain: e.target.checked })}
                    />
                    <span>Lluvia</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-f1-red"
                      checked={predictions.dnf}
                      onChange={(e) => setPredictions({ ...predictions, dnf: e.target.checked })}
                    />
                    <span>Abandonos</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-f1-red"
                      checked={predictions.safetyCar}
                      onChange={(e) => setPredictions({ ...predictions, safetyCar: e.target.checked })}
                    />
                    <span>Safety Car</span>
                  </label>
                </div>
              </div>

              <Button className="w-full bg-f1-red hover:bg-red-700 text-white py-3 rounded-lg font-bold">
                ENVIAR PREDICCIÓN
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};