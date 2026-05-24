import { Search, Users, CalendarCheck, Star } from "lucide-react";

const steps = [
  { icon: Search, title: "Search & Browse", description: "Enter the service you need and your location to find available professionals nearby" },
  { icon: Users, title: "Compare Providers", description: "View profiles, ratings, reviews, and pricing to choose the best fit for your needs" },
  { icon: CalendarCheck, title: "Book Instantly", description: "Select your preferred time slot and confirm your booking in just a few clicks" },
  { icon: Star, title: "Rate & Review", description: "After the service, share your experience to help others find great providers" },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 md:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* TITLE */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Getting help has never been easier. Follow these simple steps to connect with local experts.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center text-center">
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-600 text-white mb-4 sm:mb-6">
                <step.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                <span className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
