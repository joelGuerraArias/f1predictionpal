import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Flag, Cloud, Car } from "lucide-react";

const drivers = [
  { id: 1, name: "Max Verstappen", number: "1", team: "Red Bull Racing" },
  { id: 44, name: "Lewis Hamilton", number: "44", team: "Mercedes" },
  { id: 16, name: "Charles Leclerc", number: "16", team: "Ferrari" },
  // Add more drivers as needed
];

export const RacePrediction = () => {
  const [predictions, setPredictions] = useState({
    podium: [] as number[],
    pole: null as number | null,
    rain: false,
    safetyCar: false,
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-f1-dark text-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Gran Premio de Arabia</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl mb-4">Podium Prediction</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((position) => (
                <div key={position} className="bg-f1-gray p-4 rounded-lg">
                  <h4 className="text-f1-red font-bold mb-2">{position}° Place</h4>
                  <select 
                    className="w-full bg-f1-dark text-white p-2 rounded border border-f1-gray"
                    onChange={(e) => {
                      const newPodium = [...predictions.podium];
                      newPodium[position - 1] = Number(e.target.value);
                      setPredictions({ ...predictions, podium: newPodium });
                    }}
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.team}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-f1-gray p-4 rounded-lg">
              <h4 className="flex items-center text-f1-red font-bold mb-2">
                <Flag className="mr-2 h-4 w-4" />
                Pole Position
              </h4>
              <select 
                className="w-full bg-f1-dark text-white p-2 rounded border border-f1-gray"
                onChange={(e) => setPredictions({ ...predictions, pole: Number(e.target.value) })}
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-f1-gray p-4 rounded-lg flex items-center space-x-2">
              <Cloud className="h-6 w-6 text-f1-red" />
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  checked={predictions.rain}
                  onChange={(e) => setPredictions({ ...predictions, rain: e.target.checked })}
                />
                <span>Rain during race?</span>
              </label>
            </div>

            <div className="bg-f1-gray p-4 rounded-lg flex items-center space-x-2">
              <Car className="h-6 w-6 text-f1-red" />
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  checked={predictions.safetyCar}
                  onChange={(e) => setPredictions({ ...predictions, safetyCar: e.target.checked })}
                />
                <span>Safety Car?</span>
              </label>
            </div>
          </div>

          <Button className="w-full bg-f1-red hover:bg-red-700 text-white py-3 rounded-lg font-bold">
            Submit Predictions
          </Button>
        </div>
      </Card>
    </div>
  );
};