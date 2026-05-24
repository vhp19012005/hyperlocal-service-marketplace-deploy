import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Clock,
  Award,
} from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Trusted Professionals",
    description:
      "All service providers are background verified and professionally trained",
    icon: Shield,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200",
  },
  {
    id: 2,
    title: "Same Day Service",
    description:
      "Get help within hours. Book now and relax while we handle the rest",
    icon: Clock,
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200",
  },
  {
    id: 3,
    title: "5-Star Rated",
    description:
      "Join 100,000+ happy customers who trust LocalServe for their needs",
    icon: Star,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200",
  },
  {
    id: 4,
    title: "Quality Guaranteed",
    description:
      "Not satisfied? We'll send another professional at no extra cost",
    icon: Award,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200",
  },
];

const SlidesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="why-us" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3">
            Why Choose LocalServe?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover what makes us the preferred choice for local services
          </p>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="min-w-full relative h-[260px]  md:h-[420px]">
                {/* Slide Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-78"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                  <div className="text-center text-gray-900 max-w-2xl">
                    <div className="mx-auto mb-5 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/80 flex items-center justify-center">
                      <slide.icon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-800" />
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-4xl font-bold mb-3">
                      {slide.title}
                    </h3>

                    <p className="text-sm sm:text-base md:text-xl text-gray-900">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-gray-100 rounded-full shadow flex items-center justify-center"
          >
            <ChevronLeft className="text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-gray-100 rounded-full shadow flex items-center justify-center"
          >
            <ChevronRight className="text-gray-800" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "w-6 bg-blue-600"
                  : "w-2 bg-blue-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SlidesSection;
