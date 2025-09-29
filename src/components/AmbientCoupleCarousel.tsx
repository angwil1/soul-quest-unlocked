import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import coupleIndianRomantic from '@/assets/couple-indian-romantic.jpg';
import coupleBlackRomantic from '@/assets/couple-black-romantic.jpg';
import coupleWhiteNatural from '@/assets/couple-white-natural.jpg';


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
    src: coupleBlackRomantic,
    caption: "Pure connection, beautiful souls",
    alt: "Beautiful Black couple sharing a romantic moment",
    focusDesktop: 'center 0%',
    focusMobile: 'center 0%'
  },
  {
    src: coupleWhiteNatural,
    caption: "Natural love, timeless moments",
    alt: "Beautiful white couple in natural romantic moment",
    focusDesktop: 'center 0%',
    focusMobile: 'center 0%'
  },
  {
    src: coupleIndianRomantic,
    caption: "Love transcends all boundaries",
    alt: "Beautiful Indian couple sharing a romantic moment",
    focusDesktop: 'center 0%',
    focusMobile: 'center 0%'
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

    console.log('Carousel API initialized:', api);
    console.log('Can scroll prev:', api.canScrollPrev());
    console.log('Can scroll next:', api.canScrollNext());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
      console.log('Current slide:', api.selectedScrollSnap());
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
      
      <Carousel setApi={setApi} className="w-full relative">
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
        <CarouselPrevious className="hidden sm:flex -left-8 lg:-left-12" />
        <CarouselNext className="hidden sm:flex -right-8 lg:-right-12" />
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