import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { useState } from "react";
import { Flag } from "lucide-react";

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
    country: string | null;
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
          races (
            title,
            race_date
          ),
          profiles (
            email,
            country
          )
        `)
        .order("created_at", { ascending: false })
        .limit(showAll ? 50 : 3);

      if (error) throw error;
      if (!data) return [];

      return data.map(prediction => ({
        ...prediction,
        profiles: {
          email: prediction.profiles?.email || null,
          country: prediction.profiles?.country || null
        }
      })) as PredictionWithUser[];
    },
  });

  if (isLoading) return <div>Cargando predicciones...</div>;

  return (
    <div className="w-full mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Predicciones Recientes</h2>
      <div className="space-y-4">
        {predictions?.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-white shadow rounded-lg p-4 border border-gray-200"
          >
            <div className="grid grid-cols-6 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {prediction.profiles?.email?.split('@')[0]}
                </span>
                {prediction.profiles?.country ? (
                  <img
                    src={`https://flagcdn.com/24x18/${prediction.profiles.country.toLowerCase()}.png`}
                    alt={prediction.profiles.country}
                    className="h-4"
                  />
                ) : (
                  <Flag className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="font-bold">{prediction.first_place_driver}</div>
              <div className="font-bold">{prediction.second_place_driver}</div>
              <div className="font-bold">{prediction.third_place_driver}</div>
              <div className="font-bold">{prediction.pole_position_driver}</div>
              <div className="flex gap-2 font-bold">
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