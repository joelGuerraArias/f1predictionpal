import { Header } from "@/components/Header";
import { RacePrediction } from "@/components/RacePrediction";
import { RaceManagement } from "@/components/RaceManagement";

const Index = () => {
  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      <main className="w-full py-8 px-4">
        <div className="space-y-8">
          <RaceManagement />
          <RacePrediction />
        </div>
      </main>
    </div>
  );
};

export default Index;