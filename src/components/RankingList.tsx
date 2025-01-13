import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserPoints {
  userId: string;
  points: number;
  user: {
    email: string | null;
  };
}

export const RankingList = () => {
  const { data: rankings, isLoading } = useQuery<UserPoints[]>({
    queryKey: ["rankings"],
    queryFn: async () => {
      // Obtener todas las carreras finalizadas
      const { data: races, error: racesError } = await supabase
        .from("races")
        .select("*")
        .eq("status", "finished");

      if (racesError) throw racesError;

      // Obtener todas las predicciones con información de usuario
      const { data: predictions, error: predictionsError } = await supabase
        .from("race_predictions")
        .select(`
          *,
          profiles!race_predictions_user_id_fkey (
            email
          )
        `);

      if (predictionsError) throw predictionsError;
      if (!predictions) return [];

      // Calcular puntos por usuario
      const userPoints = predictions.reduce((acc: Record<string, UserPoints>, prediction) => {
        const race = races?.find(r => r.id === prediction.race_id);
        if (!race) return acc;

        const userId = prediction.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            userId,
            points: 0,
            user: {
              email: prediction.profiles?.email,
            },
          };
        }

        // Sumar puntos por predicciones correctas
        if (prediction.pole_position_driver === race.pole_position_driver) acc[userId].points += 1;
        if (prediction.first_place_driver === race.first_place_driver) acc[userId].points += 3;
        if (prediction.second_place_driver === race.second_place_driver) acc[userId].points += 2;
        if (prediction.third_place_driver === race.third_place_driver) acc[userId].points += 1;
        if (prediction.had_rain === race.had_rain) acc[userId].points += 1;
        if (prediction.had_safety_car === race.had_safety_car) acc[userId].points += 1;

        return acc;
      }, {});

      // Convertir a array y ordenar por puntos
      return Object.values(userPoints).sort((a, b) => b.points - a.points);
    },
  });

  if (isLoading) return <div>Cargando ranking...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Ranking de Usuarios</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Usuario</th>
              <th className="px-4 py-2 text-left">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rankings?.map((ranking) => (
              <tr key={ranking.userId} className="border-t border-gray-200">
                <td className="px-4 py-2">{ranking.user.email?.split('@')[0]}</td>
                <td className="px-4 py-2">{ranking.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};