import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import option1 from "../assets/icon-option-1.png";
import option2 from "../assets/icon-option-2.png";
import option3 from "../assets/icon-option-3.png";
import option4 from "../assets/icon-option-4.png";
import currentIcon from "../assets/app-icon-512.png";

const IconOptions: React.FC = () => {
  const { toast } = useToast();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Choose App Icon - AI Complete Me";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const handleUseIcon = (iconPath: string, optionName: string) => {
    navigator.clipboard.writeText(`Replace src/assets/app-icon-512.png with ${iconPath}`);
    toast({
      title: "Icon Selection Copied",
      description: `Instructions for ${optionName} copied to clipboard`,
    });
  };

  const iconOptions = [
    { src: currentIcon, name: "Current Icon", path: "src/assets/app-icon-512.png" },
    { src: option1, name: "Option 1: Minimalist Heart", path: "src/assets/icon-option-1.png" },
    { src: option2, name: "Option 2: Connection Circles", path: "src/assets/icon-option-2.png" },
    { src: option3, name: "Option 3: Letter A with Heart", path: "src/assets/icon-option-3.png" },
    { src: option4, name: "Option 4: Infinity Hearts", path: "src/assets/icon-option-4.png" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Choose Your App Icon</h1>
        <p className="text-muted-foreground mt-2">Select the perfect icon for AI Complete Me</p>
      </header>
      
      <main className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {iconOptions.map((option, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <img
                  src={option.src}
                  alt={option.name}
                  width={200}
                  height={200}
                  className="mx-auto rounded-xl shadow mb-4"
                />
                <h3 className="font-medium text-lg mb-2">{option.name}</h3>
                <p className="text-xs text-muted-foreground mb-4 break-all">{option.path}</p>
                <Button
                  onClick={() => handleUseIcon(option.path, option.name)}
                  size="sm"
                  className="w-full"
                  variant={index === 0 ? "secondary" : "default"}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {index === 0 ? "Current" : "Use This Icon"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Card className="inline-block p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              To use a different icon, I can replace the current app-icon-512.png file. 
              Just tell me which option you prefer!
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default IconOptions;