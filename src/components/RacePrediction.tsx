import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Flag, Share2, Facebook, Twitter, Send } from "lucide-react";
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
    <div className="max-w-7xl mx-auto p-4">
      <Card className="bg-white shadow-xl">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Driver selection */}
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="relative bg-white border border-gray-200 rounded-lg p-2 cursor-pointer hover:border-f1-red transition-colors"
                    onClick={() => {
                      // Handle driver selection logic
                      console.log("Selected driver:", driver.name);
                    }}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={driver.imageUrl}
                        alt={driver.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="text-xs font-bold text-white">{driver.number}</div>
                        <div className="text-xs text-white truncate">{driver.name}</div>
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
                    className={`bg-gray-100 p-4 rounded-lg text-center ${
                      position === 1 ? "order-2" : position === 2 ? "order-1" : "order-3"
                    }`}
                  >
                    <div className="text-f1-red font-bold mb-2">
                      {position === 1 ? "PRIMERO" : position === 2 ? "SEGUNDO" : "TERCERO"}
                    </div>
                    <div className="h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                      {predictions.podium[position - 1] ? (
                        <img
                          src={drivers.find(d => d.id === predictions.podium[position - 1])?.imageUrl}
                          alt="Selected driver"
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400">Seleccionar piloto</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="flex items-center text-f1-red font-bold mb-2">
                    <Flag className="mr-2 h-4 w-4" />
                    POLE POSITION
                  </h4>
                  <div className="h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                    {predictions.pole ? (
                      <img
                        src={drivers.find(d => d.id === predictions.pole)?.imageUrl}
                        alt="Pole position driver"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400">Seleccionar piloto</span>
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
              </div>

              <Button className="w-full bg-f1-red hover:bg-red-700 text-white py-3 rounded-lg font-bold">
                ENVIAR
              </Button>

              <div className="flex justify-center gap-4 mt-4">
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
        </div>
      </Card>
    </div>
  );
};