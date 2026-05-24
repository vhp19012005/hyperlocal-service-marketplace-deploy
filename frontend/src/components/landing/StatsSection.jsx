import { Users, MapPin, Star, CheckCircle } from "lucide-react";

const stats = [
  { value: "10,000+", label: "Service Providers", icon: Users },
  { value: "50+", label: "Cities Covered", icon: MapPin },
  { value: "4.8", label: "Average Rating", icon: Star },
  { value: "100,000+", label: "Bookings Completed", icon: CheckCircle },
];

const StatsSection = () => {
  return (
    <section  className="py-16 sm:py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center text-center p-4"
            >
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <stat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm sm:text-base font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
