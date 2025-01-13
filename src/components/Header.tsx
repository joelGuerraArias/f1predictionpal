import { Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-white py-4 px-6 flex justify-between items-center border-b">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold tracking-wider">
          <span className="text-gray-800">PREDICTOR</span>
          <span className="text-f1-red">/F1</span>
        </div>
      </div>
      <nav className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" className="text-gray-800">P1</Button>
        <Button variant="ghost" className="text-gray-800">P2</Button>
        <Button variant="ghost" className="text-gray-800">P3</Button>
        <Button variant="ghost" className="text-gray-800">QQ</Button>
        <Button onClick={handleLogout} className="bg-f1-red hover:bg-red-700 text-white">
          CERRAR SESIÓN
        </Button>
      </nav>
    </header>
  );
};