import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useState } from "react";

type PredictionWithUser = {
  id: string;
  first_place_driver: string;
  second_place_driver: string;
  third_place_driver: string;
  pole_position_driver: string;
  had_rain: boolean;
  had_safety_car: boolean;
  had_dnf: boolean;
  user_id: string;
  profiles: {
    email: string | null;
  };
  races: {
    title: string;
    race_date: string;
  };
}

export const RecentPredictions = () => {
  const [showAll, setShowAll] = useState(false);
  
  const { data: predictions, isLoading } = useQuery<PredictionWithUser[]>({
    queryKey: ["recent-predictions", showAll],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("race_predictions")
        .select(`
          *,
          races!inner (
            title,
            race_date
          ),
          profiles!inner (
            email
          )
        `)
        .order("created_at", { ascending: false })
        .limit(showAll ? 50 : 3);

      if (error) throw error;
      return data as PredictionWithUser[];
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
            <div className="grid grid-cols-6 gap-4 text-sm">
              <div className="font-medium">
                {prediction.profiles?.email?.split('@')[0]}
              </div>
              <div>{prediction.first_place_driver}</div>
              <div>{prediction.second_place_driver}</div>
              <div>{prediction.third_place_driver}</div>
              <div>{prediction.pole_position_driver}</div>
              <div className="flex gap-2">
                {prediction.had_rain && <span>Lluvia</span>}
                {prediction.had_safety_car && <span>SC</span>}
                {prediction.had_dnf && <span>DNF</span>}
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