import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Flag, Share2, Facebook, Twitter, Send, RotateCcw } from "lucide-react";
import { drivers } from "@/data/drivers";
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

      // Obtener la carrera activa
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

      // Eliminar la predicción existente
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

      // Resetear el estado local
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

      // Validar que todos los campos necesarios estén completos
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

      // Obtener la carrera activa
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

      // Guardar la predicción
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
                <div className="grid grid-cols-3 gap-6">
                  {drivers.map((driver) => {
                    const isSelected = predictions.podium.includes(driver.id) || predictions.pole === driver.id;
                    return (
                      <div
                        key={driver.id}
                        draggable
                        id={String(driver.id)}
                        className={`relative bg-white border ${
                          isSelected ? 'border-f1-red bg-red-50' : 'border-gray-200'
                        } rounded-lg p-2 cursor-pointer hover:border-f1-red transition-colors`}
                        onClick={() => handleDriverClick(driver.id)}
                      >
                        <div className="flex flex-col">
                          <div className="aspect-square overflow-hidden rounded-lg m-3" style={{ transform: 'scale(1.25)' }}>
                            <img
                              src={driver.imageUrl}
                              alt={driver.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 bg-f1-red text-white text-xs px-2 py-1 rounded-full">
                              {predictions.pole === driver.id 
                                ? 'POLE' 
                                : `P${predictions.podium.indexOf(driver.id) + 1}`}
                            </div>
                          )}
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
                      <div className="h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {predictions.podium[position - 1] ? (
                          <div className="flex flex-col items-center w-full">
                            <img
                              src={drivers.find(d => d.id === predictions.podium[position - 1])?.imageUrl}
                              alt="Selected driver"
                              className="h-20 w-full object-contain transform scale-125"
                            />
                            <div className="text-xs font-medium mt-1">
                              {drivers.find(d => d.id === predictions.podium[position - 1])?.name}
                            </div>
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

                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!canReset}
                  className="flex items-center gap-2 w-full"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resetear predicción
                </Button>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="flex items-center text-f1-red font-bold mb-2">
                    <Flag className="mr-2 h-4 w-4" />
                    POLE POSITION
                  </h4>
                  <div 
                    className={`h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-f1-red transition-colors ${selectingPole ? 'ring-2 ring-f1-red' : ''}`}
                    onClick={() => setSelectingPole(!selectingPole)}
                  >
                    {predictions.pole ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={drivers.find(d => d.id === predictions.pole)?.imageUrl}
                          alt="Pole position driver"
                          className="h-12 w-12 object-contain transform scale-125"
                        />
                        <span className="text-sm font-medium">
                          {drivers.find(d => d.id === predictions.pole)?.name}
                        </span>
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

                  <Button 
                    className="w-full bg-f1-red hover:bg-red-700 text-white py-3 rounded-lg font-bold"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "ENVIANDO..." : "ENVIAR"}
                  </Button>
                </div>

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