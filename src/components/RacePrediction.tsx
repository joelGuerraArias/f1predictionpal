import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { addHours, isBefore } from "date-fns";
import { PodiumPosition } from "./race-prediction/PodiumPosition";
import { DriverGrid } from "./race-prediction/DriverGrid";
import { PolePosition } from "./race-prediction/PolePosition";
import { AdditionalPredictions } from "./race-prediction/AdditionalPredictions";
import { SocialShare } from "./race-prediction/SocialShare";
import { drivers } from "@/data/drivers";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextRace, setNextRace] = useState<{ race_date: string; race_time: string } | null>(null);
  const [canReset, setCanReset] = useState(false);

  useEffect(() => {
    const fetchNextRace = async () => {
      const { data: race, error } = await supabase
        .from('races')
        .select('race_date, race_time')
        .eq('status', 'scheduled')
        .order('race_date', { ascending: true })
        .limit(1)
        .single();

      if (race) {
        setNextRace(race);
        const raceDateTime = new Date(`${race.race_date}T${race.race_time}`);
        const now = new Date();
        const twentyFourHoursBefore = addHours(raceDateTime, -24);
        setCanReset(isBefore(now, twentyFourHoursBefore));
      }
    };

    fetchNextRace();
  }, []);

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
      const oldIndex = newPodium.indexOf(driverId);
      if (oldIndex !== -1) {
        newPodium.splice(oldIndex, 1);
      }
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

  const handleReset = async () => {
    try {
      if (!nextRace) {
        toast({
          title: "Error",
          description: "No hay carreras programadas",
          variant: "destructive",
        });
        return;
      }

      const raceDateTime = new Date(`${nextRace.race_date}T${nextRace.race_time}`);
      const now = new Date();
      const twentyFourHoursBefore = addHours(raceDateTime, -24);

      if (!isBefore(now, twentyFourHoursBefore)) {
        toast({
          title: "Error",
          description: "Solo puedes resetear tu predicción hasta 24 horas antes de la carrera",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para resetear predicciones",
          variant: "destructive",
        });
        return;
      }

      const { data: races, error: raceError } = await supabase
        .from('races')
        .select('id')
        .eq('status', 'scheduled')
        .order('race_date', { ascending: true })
        .limit(1)
        .single();

      if (raceError || !races) {
        toast({
          title: "Error",
          description: "No hay carreras programadas en este momento",
          variant: "destructive",
        });
        return;
      }

      const { error: deleteError } = await supabase
        .from('race_predictions')
        .delete()
        .eq('user_id', user.id)
        .eq('race_id', races.id);

      if (deleteError) {
        toast({
          title: "Error",
          description: "Error al resetear la predicción",
          variant: "destructive",
        });
        return;
      }

      setPredictions({
        podium: [],
        pole: null,
        rain: false,
        dnf: false,
        safetyCar: false,
      });

      toast({
        title: "¡Predicción reseteada!",
        description: "Puedes realizar una nueva predicción",
      });

    } catch (error) {
      console.error('Error al resetear predicción:', error);
      toast({
        title: "Error",
        description: "Hubo un error al resetear tu predicción",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!predictions.pole || predictions.podium.length !== 3) {
        toast({
          title: "Error",
          description: "Por favor completa todas las predicciones antes de enviar",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para enviar predicciones",
          variant: "destructive",
        });
        return;
      }

      const { data: races, error: raceError } = await supabase
        .from('races')
        .select('id')
        .eq('status', 'scheduled')
        .order('race_date', { ascending: true })
        .limit(1)
        .single();

      if (raceError || !races) {
        toast({
          title: "Error",
          description: "No hay carreras programadas en este momento",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from('race_predictions').insert({
        user_id: user.id,
        race_id: races.id,
        pole_position_driver: drivers.find(d => d.id === predictions.pole)?.name || '',
        first_place_driver: drivers.find(d => d.id === predictions.podium[0])?.name || '',
        second_place_driver: drivers.find(d => d.id === predictions.podium[1])?.name || '',
        third_place_driver: drivers.find(d => d.id === predictions.podium[2])?.name || '',
        had_rain: predictions.rain,
        had_dnf: predictions.dnf,
        had_safety_car: predictions.safetyCar,
      });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Error",
            description: "Ya has enviado una predicción para esta carrera",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Hubo un error al guardar tu predicción",
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "¡Predicción enviada!",
        description: "Tu predicción ha sido guardada exitosamente",
      });

    } catch (error) {
      console.error('Error al enviar predicción:', error);
      toast({
        title: "Error",
        description: "Hubo un error al procesar tu predicción",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePredictionChange = (field: 'rain' | 'dnf' | 'safetyCar', value: boolean) => {
    setPredictions(prev => ({
      ...prev,
      [field]: value
    }));
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

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-8">PARA LA VICTORIA</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <img 
                  src="https://fgjpullzone.b-cdn.net/f1/para%20victoria/race_verstappen.png" 
                  alt="Max Verstappen" 
                  className="w-full h-auto mb-4"
                />
                <h3 className="text-xl font-bold">MAX VERSTAPPEN</h3>
                <p className="text-f1-red text-2xl font-bold">45%</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <img 
                  src="https://fgjpullzone.b-cdn.net/f1/para%20victoria/race_leclerc.png" 
                  alt="Charles Leclerc" 
                  className="w-full h-auto mb-4"
                />
                <h3 className="text-xl font-bold">CHARLES LECLERC</h3>
                <p className="text-f1-red text-2xl font-bold">32%</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <img 
                  src="https://fgjpullzone.b-cdn.net/f1/para%20victoria/race_alonso.png" 
                  alt="Fernando Alonso" 
                  className="w-full h-auto mb-4"
                />
                <h3 className="text-xl font-bold">FERNANDO ALONSO</h3>
                <p className="text-f1-red text-2xl font-bold">23%</p>
              </div>
            </div>
          </div>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left column - Driver selection */}
              <div className="space-y-6">
                <DriverGrid
                  selectedDriverIds={predictions.podium}
                  polePositionDriver={predictions.pole}
                  onDriverClick={handleDriverClick}
                />
              </div>

              {/* Right column - Podium and additional predictions */}
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[2, 1, 3].map((position) => (
                    <PodiumPosition
                      key={position}
                      position={position}
                      driverId={predictions.podium[position - 1] || null}
                      isSelected={selectedPosition === position}
                      onPositionClick={() => setSelectedPosition(position)}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!canReset}
                  className="flex items-center gap-2 w-full"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resetear predicción
                </Button>

                <PolePosition
                  selectedDriver={predictions.pole}
                  isSelecting={selectingPole}
                  onPoleClick={() => setSelectingPole(!selectingPole)}
                />

                <AdditionalPredictions
                  rain={predictions.rain}
                  dnf={predictions.dnf}
                  safetyCar={predictions.safetyCar}
                  onPredictionChange={handlePredictionChange}
                />

                <Button 
                  className="w-full bg-f1-red hover:bg-red-700 text-white py-3 rounded-lg font-bold"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "ENVIANDO..." : "ENVIAR"}
                </Button>

                <SocialShare 
                  podium={predictions.podium}
                  pole={predictions.pole}
                />
              </div>
            </div>
          </DndContext>
        </div>
      </Card>
    </div>
  );
};