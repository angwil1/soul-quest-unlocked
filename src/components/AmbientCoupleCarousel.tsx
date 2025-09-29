import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import coupleHeroCoolTones from '@/assets/couple-hero-cool-tones.jpg';
import coupleHeroOptimized from '@/assets/couple-hero-optimized.jpg';
import coupleHeroMobile1 from '@/assets/couple-hero-mobile-1.jpg';
import coupleHeroMobile3 from '@/assets/couple-hero-mobile-3.jpg';


interface CoupleImage {
  src: string;
  caption: string;
  alt: string;
  srcDesktop?: string;
  srcMobile?: string;
  focus?: string;
  focusDesktop?: string;
  focusMobile?: string;
}

const ambientCoupleImages: CoupleImage[] = [
  {
    src: coupleHeroCoolTones,
    caption: "Timeless love, beautifully real",
    alt: "Couple in cool tones sharing a natural moment",
    focusDesktop: 'center 5%',
    focusMobile: 'center 15%'
  },
  {
    src: coupleHeroOptimized,
    caption: "Close, present, connected",
    alt: "Nose-touching couple in an intimate, real moment",
    focusDesktop: 'center 0%',
    focusMobile: 'center 0%'
  },
  {
    src: coupleHeroMobile1,
    caption: "Everyday light, everyday love",
    alt: "Couple in natural lighting, candid and warm",
    focusDesktop: 'center 2%',
    focusMobile: 'center 8%'
  },
  {
    src: coupleHeroMobile3,
    caption: "Genuine smiles, genuine feelings",
    alt: "Candid couple smiling together",
    focusDesktop: 'center 0%',
    focusMobile: 'center 18%'
  }
];

export const AmbientCoupleCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-light text-foreground mb-4">
          Love in all its forms
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Every connection tells a story. Every story deserves to be celebrated.
        </p>
      </div>
      
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {ambientCoupleImages.map((image, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="border-0 bg-transparent group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl bg-muted/20">
                   <img
                     src={isDesktop ? (image.srcDesktop ?? image.src) : (image.srcMobile ?? image.src)}
                     alt={image.alt}
                     className="w-full h-48 xs:h-56 sm:h-64 md:h-96 lg:h-[34rem] xl:h-[40rem] object-cover object-top transition-transform duration-500 group-hover:scale-105"
                     loading="lazy"
                      style={{ 
                        aspectRatio: '4/3', 
                        objectPosition: isDesktop 
                          ? (image.focusDesktop ?? image.focus ?? 'center 0%') 
                          : (image.focusMobile ?? image.focus ?? 'center 22%')
                      }}
                   />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-light leading-relaxed">
                      {image.caption}
                    </p>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      
      {/* Mobile dots indicator */}
      <div className="flex justify-center mt-6 sm:hidden">
        {ambientCoupleImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full mx-1 transition-colors ${
              index === current ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};