import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import coupleHero1 from '@/assets/couple-hero-1.jpg';
import coupleHero2 from '@/assets/couple-hero-2.jpg';
import coupleAmbientClear from '@/assets/couple-ambient-clear.jpg';
import coupleLgbtqAmbient from '@/assets/couple-lgbtq-ambient.jpg';
import coupleDigital from '@/assets/couple-digital.jpg';
import couplePoetic from '@/assets/couple-poetic-inclusive.jpg';

interface CoupleImage {
  src: string;
  caption: string;
  alt: string;
}

const ambientCoupleImages: CoupleImage[] = [
  {
    src: coupleAmbientClear,
    caption: "In quiet moments, hearts speak loudest",
    alt: "Couple sharing an intimate, peaceful moment together"
  },
  {
    src: coupleHero1,
    caption: "Love finds us in the spaces between words",
    alt: "Two people connecting deeply in natural light"
  },
  {
    src: coupleLgbtqAmbient,
    caption: "Every love story is beautifully unique",
    alt: "LGBTQ+ couple embracing in soft, warm lighting"
  },
  {
    src: coupleHero2,
    caption: "Where vulnerability meets trust, magic happens",
    alt: "Couple in an authentic moment of connection"
  },
  {
    src: coupleDigital,
    caption: "Real connection transcends the digital noise",
    alt: "Modern couple finding genuine connection"
  },
  {
    src: couplePoetic,
    caption: "Love is the poetry written in shared silences",
    alt: "Artistic representation of inclusive love and connection"
  }
];

export const AmbientCoupleCarousel = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

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
                <div className="relative overflow-hidden rounded-2xl">
                   <img
                     src={image.src}
                     alt={image.alt}
                     className="w-full h-48 xs:h-56 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] object-cover object-top transition-all duration-500 group-hover:scale-105"
                     loading="lazy"
                     style={{ aspectRatio: '4/3', objectPosition: 'center 20%' }}
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