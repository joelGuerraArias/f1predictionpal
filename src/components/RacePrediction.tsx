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
import { useQuery } from "@tanstack/react-query";

interface VoteCount {
  first_place_driver: string;
  count: string;
}

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

  // Fetch next race
  useEffect(() => {
    const fetchNextRace = async () => {
      console.log("Fetching next race...");
      const { data: race, error } = await supabase
        .from('races')
        .select('race_date, race_time')
        .eq('status', 'scheduled')
        .order('race_date', { ascending: true })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching next race:", error);
        return;
      }

      if (race) {
        console.log("Next race found:", race);
        setNextRace(race);
        const raceDateTime = new Date(`${race.race_date}T${race.race_time}`);
        const now = new Date();
        const twentyFourHoursBefore = addHours(raceDateTime, -24);
        setCanReset(isBefore(now, twentyFourHoursBefore));
      }
    };

    fetchNextRace();
  }, []);

  // Fetch victory predictions
  const { data: voteCounts } = useQuery({
    queryKey: ["victoryVotes"],
    queryFn: async () => {
      console.log("Fetching victory votes...");
      const { data: nextRaceData, error: raceError } = await supabase
        .from('races')
        .select('id')
        .eq('status', 'scheduled')
        .order('race_date', { ascending: true })
        .limit(1)
        .single();

      if (raceError) {
        console.error("Error fetching next race for votes:", raceError);
        return [];
      }

      if (!nextRaceData) {
        console.log("No next race found for votes");
        return [];
      }

      console.log("Found next race for votes:", nextRaceData);

      const { data: predictions, error: predictionsError } = await supabase
        .from('race_predictions')
        .select(`
          first_place_driver,
          count(*)
        `)
        .eq('race_id', nextRaceData.id)
        .group('first_place_driver');

      if (predictionsError) {
        console.error("Error fetching predictions:", predictionsError);
        return [];
      }

      console.log("Fetched predictions:", predictions);
      return predictions as VoteCount[];
    },
  });

  // Calculate vote percentages
  const calculateVotePercentages = () => {
    if (!voteCounts || voteCounts.length === 0) return [];

    const totalVotes = voteCounts.reduce((sum, vote) => sum + Number(vote.count), 0);
    
    return voteCounts.map(vote => ({
      driverId: drivers.find(d => d.name === vote.first_place_driver)?.id || 0,
      percentage: Math.round((Number(vote.count) / totalVotes) * 100),
    }));
  };

  const votePercentages = calculateVotePercentages();

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

      // Check if prediction exists
      const { data: existingPrediction } = await supabase
        .from('race_predictions')
        .select('id')
        .eq('user_id', user.id)
        .eq('race_id', races.id)
        .single();

      const predictionData = {
        pole_position_driver: drivers.find(d => d.id === predictions.pole)?.name || '',
        first_place_driver: drivers.find(d => d.id === predictions.podium[0])?.name || '',
        second_place_driver: drivers.find(d => d.id === predictions.podium[1])?.name || '',
        third_place_driver: drivers.find(d => d.id === predictions.podium[2])?.name || '',
        had_rain: predictions.rain,
        had_dnf: predictions.dnf,
        had_safety_car: predictions.safetyCar,
      };

      let error;

      if (existingPrediction) {
        // Update existing prediction
        const { error: updateError } = await supabase
          .from('race_predictions')
          .update(predictionData)
          .eq('id', existingPrediction.id);
        
        error = updateError;
      } else {
        // Insert new prediction
        const { error: insertError } = await supabase
          .from('race_predictions')
          .insert({
            ...predictionData,
            user_id: user.id,
            race_id: races.id,
          });
        
        error = insertError;
      }

      if (error) {
        console.error('Error saving prediction:', error);
        toast({
          title: "Error",
          description: "Hubo un error al guardar tu predicción",
          variant: "destructive",
        });
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
              {votePercentages.map(({ driverId, percentage }) => {
                const driver = drivers.find(d => d.id === driverId);
                if (!driver) return null;
                
                return (
                  <div key={driverId} className="bg-white rounded-lg p-6 shadow-sm">
                    <img 
                      src={`https://fgjpullzone.b-cdn.net/f1/para%20victoria/race_${driver.name.toLowerCase().split(' ')[1]}.png`}
                      alt={driver.name}
                      className="w-full h-auto mb-4"
                    />
                    <h3 className="text-xl font-bold">{driver.name.toUpperCase()}</h3>
                    <p className="text-f1-red text-2xl font-bold">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <DriverGrid
                  selectedDriverIds={predictions.podium}
                  polePositionDriver={predictions.pole}
                  onDriverClick={handleDriverClick}
                />
              </div>

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