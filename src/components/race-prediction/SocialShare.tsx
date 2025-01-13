import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Send } from "lucide-react";

export const SocialShare = () => {
  return (
    <div className="flex justify-center gap-4">
      <Button variant="ghost" className="rounded-full bg-gray-700 hover:bg-gray-600 text-white p-2">
        <Facebook className="h-5 w-5" />
      </Button>
      <Button variant="ghost" className="rounded-full bg-gray-700 hover:bg-gray-600 text-white p-2">
        <Twitter className="h-5 w-5" />
      </Button>
      <Button variant="ghost" className="rounded-full bg-gray-700 hover:bg-gray-600 text-white p-2">
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};