import { Header } from "@/components/Header";
import { RacePrediction } from "@/components/RacePrediction";
import { F1Header } from "@/components/F1Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      <F1Header />
      <main className="w-full py-8 px-4">
        <div className="space-y-8">
          <RacePrediction />
        </div>
      </main>
    </div>
  );
};

export default Index;