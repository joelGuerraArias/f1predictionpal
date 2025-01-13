import { Trophy } from "lucide-react";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="bg-f1-dark text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/lovable-uploads/c9f4f0d8-4c4a-4d15-a6ed-be5b2635b55e.png" alt="F1 Predictor" className="h-8" />
        <h1 className="text-2xl font-bold">F1 Predictor</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="text-white hover:text-f1-red">
          <Trophy className="mr-2 h-4 w-4" />
          Leaderboard
        </Button>
        <Button className="bg-f1-red hover:bg-red-700">Sign In</Button>
      </div>
    </header>
  );
};