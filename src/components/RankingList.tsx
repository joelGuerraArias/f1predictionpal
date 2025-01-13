import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const RankingList = () => {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ["rankings"],
    queryFn: async () => {
      const { data: races, error: racesError } = await supabase
        .from("races")
        .select("*")
        .eq("status", "completed");

      if (racesError) throw racesError;

      const { data: predictions, error: predictionsError } = await supabase
        .from("race_predictions")
        .select(`
          *,
          profiles (
            name,
            email
          )
        `);

      if (predictionsError) throw predictionsError;

      // Calcular puntos por usuario
      const userPoints = predictions.reduce((acc, prediction) => {
        const race = races.find(r => r.id === prediction.race_id);
        if (!race) return acc;

        const userId = prediction.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            points: 0,
            user: prediction.profiles,
          };
        }

        // Puntos por predicciones correctas
        if (prediction.pole_position_driver === race.pole_position_driver) acc[userId].points += 2;
        if (prediction.first_place_driver === race.first_place_driver) acc[userId].points += 3;
        if (prediction.second_place_driver === race.second_place_driver) acc[userId].points += 2;
        if (prediction.third_place_driver === race.third_place_driver) acc[userId].points += 1;
        if (prediction.had_rain === race.had_rain) acc[userId].points += 1;
        if (prediction.had_safety_car === race.had_safety_car) acc[userId].points += 1;

        return acc;
      }, {});

      // Convertir a array y ordenar por puntos
      return Object.entries(userPoints)
        .map(([userId, data]) => ({
          userId,
          points: data.points,
          user: data.user,
        }))
        .sort((a, b) => b.points - a.points);
    },
  });

  if (isLoading) return <div>Cargando ranking...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Ranking</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rankings?.map((ranking, index) => (
              <tr key={ranking.userId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {ranking.user?.name || ranking.user?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ranking.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};