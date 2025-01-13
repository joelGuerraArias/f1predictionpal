import { Header } from "@/components/Header";
import { RacePrediction } from "@/components/RacePrediction";

const Index = () => {
  return (
    <div className="min-h-screen bg-white w-full">
      <Header />
      <main className="w-full py-8">
        <RacePrediction />
      </main>
    </div>
  );
};

export default Index;