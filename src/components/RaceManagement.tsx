import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { RaceList } from "./RaceList";
import { RaceResults } from "./RaceResults";

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

export const RaceManagement = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [raceTime, setRaceTime] = useState("");
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('races')
        .insert([
          {
            title,
            race_date: raceDate,
            race_time: raceTime,
            status: 'scheduled'
          }
        ]);

      if (error) throw error;

      toast({
        title: "¡Carrera creada!",
        description: "La carrera ha sido creada exitosamente",
      });

      // Reset form
      setTitle("");
      setRaceDate("");
      setRaceTime("");
    } catch (error) {
      console.error('Error creating race:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la carrera",
        variant: "destructive",
      });
    }
  };

  const handleEditRace = (race: Race) => {
    setSelectedRace(race);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Crear Nueva Carrera</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Gran Premio de España"
              required
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Fecha
            </label>
            <Input
              id="date"
              type="date"
              value={raceDate}
              onChange={(e) => setRaceDate(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1">
              Hora Local
            </label>
            <Input
              id="time"
              type="time"
              value={raceTime}
              onChange={(e) => setRaceTime(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-f1-red hover:bg-red-700">
            Crear Carrera
          </Button>
        </form>
      </Card>

      <RaceList onEditRace={handleEditRace} />

      {selectedRace && (
        <RaceResults
          race={selectedRace}
          onClose={() => setSelectedRace(null)}
        />
      )}
    </div>
  );
};