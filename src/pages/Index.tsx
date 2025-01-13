import { Header } from "@/components/Header";
import { RacePrediction } from "@/components/RacePrediction";
import { F1Header } from "@/components/F1Header";
import { RecentPredictions } from "@/components/RecentPredictions";
import { RankingList } from "@/components/RankingList";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"predictions" | "ranking">("predictions");

  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      <F1Header />
      <main className="w-full py-8 px-4">
        <div className="flex gap-4 justify-center mb-8">
          <Button
            variant={activeTab === "predictions" ? "default" : "outline"}
            onClick={() => setActiveTab("predictions")}
            className="bg-f1-red hover:bg-f1-red/90"
          >
            PREDICCIONES
          </Button>
          <Button
            variant={activeTab === "ranking" ? "default" : "outline"}
            onClick={() => setActiveTab("ranking")}
            className="bg-f1-red hover:bg-f1-red/90"
          >
            RANKING
          </Button>
        </div>
        
        {activeTab === "predictions" && (
          <div className="space-y-8">
            <RecentPredictions />
            <RacePrediction />
          </div>
        )}
        
        {activeTab === "ranking" && <RankingList />}
      </main>
    </div>
  );
};

export default Index;