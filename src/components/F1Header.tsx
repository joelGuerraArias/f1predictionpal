import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Race {
  id: string;
  title: string;
  race_date: string;
  race_time: string;
}

const F1Teams = [
  { name: "Oracle Red Bull Racing", logo: "/lovable-uploads/af400992-e241-4089-b535-a6cf39bc6dbc.png" },
  { name: "Mercedes-AMG Petronas", logo: "/lovable-uploads/06812fec-5cab-4ec1-ad8c-1a308ffbca6a.png" },
  { name: "Scuderia Ferrari", logo: "/lovable-uploads/a377b39e-a3b7-4a0c-b078-434f3da99058.png" },
  { name: "McLaren Formula 1 Team", logo: "/lovable-uploads/6479b82e-5069-4554-a038-d487ae14b82f.png" },
  { name: "Aston Martin Aramco", logo: "/lovable-uploads/c765579a-608b-40ca-a9d8-1caccf307567.png" },
  { name: "Alpine F1 Team", logo: "/lovable-uploads/2bda420f-eb03-4b3c-a7e0-4dbd774831b8.png" },
  { name: "Visa Cash App RB", logo: "/lovable-uploads/74e9a254-ae3a-46e9-ba24-eccdf7ec76b7.png" },
  { name: "Stake F1 Team", logo: "/lovable-uploads/c2d30183-1008-44b7-a0a9-f64ffc4155fc.png" },
  { name: "MoneyGram Haas F1 Team", logo: "/lovable-uploads/fdde8c9c-3d1d-4313-835e-27d49aa9f20a.png" },
  { name: "Williams Racing", logo: "/lovable-uploads/89907317-bddd-4356-a5a2-cdeb205b73d8.png" },
];

export const F1Header = () => {
  const [nextRace, setNextRace] = useState<Race | null>(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchNextRace = async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .gt("race_date", new Date().toISOString())
        .order("race_date", { ascending: true })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching next race:", error);
        return;
      }

      setNextRace(data);
    };

    fetchNextRace();
  }, []);

  useEffect(() => {
    if (!nextRace) return;

    const calculateTimeLeft = () => {
      const raceDate = new Date(`${nextRace.race_date}T${nextRace.race_time}`);
      const now = new Date();
      const difference = raceDate.getTime() - now.getTime();

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [nextRace]);

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Logo y título */}
        <div className="flex justify-center mb-8">
          <div className="text-4xl font-bold tracking-wider">
            <span className="text-gray-800">PREDICTOR</span>
            <span className="text-f1-red">/F1</span>
          </div>
        </div>

        {/* Próxima carrera y cuenta regresiva */}
        {nextRace && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">{nextRace.title}</h2>
            <div className="flex justify-center gap-4">
              <div className="bg-gray-800 text-white px-4 py-2 rounded">
                <span className="text-2xl font-bold">{countdown.days}</span>
                <p className="text-sm">Days</p>
              </div>
              <div className="bg-gray-800 text-white px-4 py-2 rounded">
                <span className="text-2xl font-bold">{countdown.hours}</span>
                <p className="text-sm">Hours</p>
              </div>
              <div className="bg-gray-800 text-white px-4 py-2 rounded">
                <span className="text-2xl font-bold">{countdown.minutes}</span>
                <p className="text-sm">Minutes</p>
              </div>
              <div className="bg-gray-800 text-white px-4 py-2 rounded">
                <span className="text-2xl font-bold">{countdown.seconds}</span>
                <p className="text-sm">Seconds</p>
              </div>
            </div>
          </div>
        )}

        {/* Logos de equipos */}
        <div className="flex flex-wrap justify-center items-center gap-8">
          {F1Teams.map((team) => (
            <div key={team.name} className="w-32">
              <img
                src={team.logo}
                alt={team.name}
                className="w-full h-auto object-contain"
                style={{ maxHeight: "50px" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};