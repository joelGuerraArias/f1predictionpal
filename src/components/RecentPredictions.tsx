import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const RecentPredictions = () => {
  const [showAll, setShowAll] = useState(false);
  
  const { data: predictions, isLoading } = useQuery({
    queryKey: ["recent-predictions"],
    queryFn: async () => {
      const { data: predictions, error } = await supabase
        .from("race_predictions")
        .select(`
          *,
          races (
            title,
            race_date
          ),
          user:user_id (
            profiles (
              name,
              email
            )
          )
        `)
        .order("created_at", { ascending: false })
        .limit(showAll ? 50 : 3);

      if (error) throw error;
      return predictions;
    },
  });

  if (isLoading) return <div>Cargando predicciones...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Predicciones Recientes</h2>
      <div className="space-y-4">
        {predictions?.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {prediction.user?.profiles?.[0]?.name || prediction.user?.profiles?.[0]?.email}
                </h3>
                <p className="text-sm text-gray-600">
                  {prediction.races?.title} - {format(new Date(prediction.races?.race_date), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Pole Position:</p>
                <p className="text-sm">{prediction.pole_position_driver}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Podio:</p>
                <p className="text-sm">1. {prediction.first_place_driver}</p>
                <p className="text-sm">2. {prediction.second_place_driver}</p>
                <p className="text-sm">3. {prediction.third_place_driver}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium">Condiciones:</p>
                <div className="flex gap-2 text-sm">
                  {prediction.had_rain && <span>Lluvia</span>}
                  {prediction.had_safety_car && <span>Safety Car</span>}
                  {prediction.had_dnf && <span>DNF</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {predictions && predictions.length >= 3 && (
        <Button
          onClick={() => setShowAll(!showAll)}
          className="mt-4"
          variant="outline"
        >
          {showAll ? "Ver menos" : "Ver más predicciones"}
        </Button>
      )}
    </div>
  );
};