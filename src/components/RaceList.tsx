import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Flag, Edit } from "lucide-react";
import { useToast } from "./ui/use-toast";

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

export const RaceList = ({ onEditRace }: { onEditRace: (race: Race) => void }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRaces();
  }, []);

  const fetchRaces = async () => {
    try {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("race_date", { ascending: true });

      if (error) throw error;

      setRaces(data || []);
    } catch (error) {
      console.error("Error fetching races:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las carreras",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Carreras Programadas</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {races.map((race) => (
            <TableRow key={race.id}>
              <TableCell>{race.title}</TableCell>
              <TableCell>
                {format(new Date(race.race_date), "d 'de' MMMM, yyyy", { locale: es })}
              </TableCell>
              <TableCell>{race.race_time.slice(0, 5)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                  race.status === "completed" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  <Flag className="w-4 h-4" />
                  {race.status === "completed" ? "Completada" : "Programada"}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditRace(race)}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};