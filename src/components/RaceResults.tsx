import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface Race {
  id: string;
  title: string;
  race_date: string;
  race_time: string;
  status: string;
  pole_position_driver: string | null;
  first_place_driver: string | null;
  second_place_driver: string | null;
  third_place_driver: string | null;
  had_rain: boolean;
  had_safety_car: boolean;
}

interface RaceResultsProps {
  race: Race;
  onClose: () => void;
}

export const RaceResults = ({ race, onClose }: RaceResultsProps) => {
  const { toast } = useToast();
  const [polePosition, setPolePosition] = useState(race.pole_position_driver || "");
  const [firstPlace, setFirstPlace] = useState(race.first_place_driver || "");
  const [secondPlace, setSecondPlace] = useState(race.second_place_driver || "");
  const [thirdPlace, setThirdPlace] = useState(race.third_place_driver || "");
  const [hadRain, setHadRain] = useState(race.had_rain);
  const [hadSafetyCar, setHadSafetyCar] = useState(race.had_safety_car);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('races')
        .update({
          pole_position_driver: polePosition,
          first_place_driver: firstPlace,
          second_place_driver: secondPlace,
          third_place_driver: thirdPlace,
          had_rain: hadRain,
          had_safety_car: hadSafetyCar,
          status: 'completed'
        })
        .eq('id', race.id);

      if (error) throw error;

      toast({
        title: "¡Resultados guardados!",
        description: "Los resultados de la carrera han sido actualizados",
      });

      onClose();
    } catch (error) {
      console.error('Error updating race results:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 bg-white shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Resultados: {race.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="polePosition">Pole Position</Label>
          <Input
            id="polePosition"
            value={polePosition}
            onChange={(e) => setPolePosition(e.target.value)}
            placeholder="Piloto en pole position"
            required
          />
        </div>

        <div>
          <Label htmlFor="firstPlace">Primer Lugar</Label>
          <Input
            id="firstPlace"
            value={firstPlace}
            onChange={(e) => setFirstPlace(e.target.value)}
            placeholder="Ganador de la carrera"
            required
          />
        </div>

        <div>
          <Label htmlFor="secondPlace">Segundo Lugar</Label>
          <Input
            id="secondPlace"
            value={secondPlace}
            onChange={(e) => setSecondPlace(e.target.value)}
            placeholder="Segundo lugar"
            required
          />
        </div>

        <div>
          <Label htmlFor="thirdPlace">Tercer Lugar</Label>
          <Input
            id="thirdPlace"
            value={thirdPlace}
            onChange={(e) => setThirdPlace(e.target.value)}
            placeholder="Tercer lugar"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hadRain"
            checked={hadRain}
            onCheckedChange={setHadRain}
          />
          <Label htmlFor="hadRain">¿Hubo lluvia?</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hadSafetyCar"
            checked={hadSafetyCar}
            onCheckedChange={setHadSafetyCar}
          />
          <Label htmlFor="hadSafetyCar">¿Hubo Safety Car?</Label>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-f1-red hover:bg-red-700">
            Guardar Resultados
          </Button>
        </div>
      </form>
    </Card>
  );
};