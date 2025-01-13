import { Header } from "@/components/Header";
import { RacePrediction } from "@/components/RacePrediction";

const Index = () => {
  return (
    <div className="min-h-screen bg-f1-dark">
      <Header />
      <main className="container mx-auto py-8">
        <RacePrediction />
      </main>
    </div>
  );
};

export default Index;