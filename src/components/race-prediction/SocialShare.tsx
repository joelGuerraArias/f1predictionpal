import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { drivers } from "@/data/drivers";

interface ShareData {
  podium: number[];
  pole: number | null;
}

const createShareText = (data: ShareData) => {
  const poleDriver = data.pole ? drivers.find(d => d.id === data.pole)?.name : 'No seleccionado';
  const podiumDrivers = data.podium.map((id, index) => {
    const driver = drivers.find(d => d.id === id);
    return `P${index + 1}: ${driver?.name || 'No seleccionado'}`;
  });

  return `🏎️ Mi predicción para la próxima carrera:

🏁 Pole Position: ${poleDriver}

Podio:
${podiumDrivers.join('\n')}

¡Haz tu predicción en predictor.autosemana.com! 🏆`;
};

const shareToFacebook = (text: string) => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://predictor.autosemana.com')}&quote=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'width=600,height=400');
};

const shareToTwitter = (text: string) => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'width=600,height=400');
};

const shareToTelegram = (text: string) => {
  const url = `https://t.me/share/url?url=${encodeURIComponent('https://predictor.autosemana.com')}&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'width=600,height=400');
};

interface SocialShareProps {
  podium: number[];
  pole: number | null;
}

export const SocialShare = ({ podium, pole }: SocialShareProps) => {
  const { toast } = useToast();
  const shareData = { podium, pole };

  const handleShare = async (platform: 'facebook' | 'twitter' | 'telegram') => {
    try {
      const shareText = createShareText(shareData);

      switch (platform) {
        case 'facebook':
          shareToFacebook(shareText);
          break;
        case 'twitter':
          shareToTwitter(shareText);
          break;
        case 'telegram':
          shareToTelegram(shareText);
          break;
      }

      toast({
        title: "¡Compartido!",
        description: `Tu predicción ha sido compartida en ${platform}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "No se pudo compartir tu predicción",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <Button 
        variant="ghost" 
        className="rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white p-2"
        onClick={() => handleShare('facebook')}
      >
        <Facebook className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        className="rounded-full bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white p-2"
        onClick={() => handleShare('twitter')}
      >
        <Twitter className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        className="rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-white p-2"
        onClick={() => handleShare('telegram')}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};