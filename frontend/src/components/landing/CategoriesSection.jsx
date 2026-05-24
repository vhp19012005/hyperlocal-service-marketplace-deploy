import {
  Wrench, Zap, Paintbrush, Sparkles, Truck, Scissors,
  Camera, Utensils, Home, Car, Hammer, Flower2,BookOpen
} from "lucide-react";


// const categories = [
//   { name: "Plumber", icon: Wrench, color: "bg-blue-500/10 text-blue-600" },
//   { name: "Electrical", icon: Zap, color: "bg-yellow-500/10 text-yellow-600" },
//   { name: "Painting", icon: Paintbrush, color: "bg-pink-500/10 text-pink-600" },
//   { name: "Cleaning", icon: Sparkles, color: "bg-cyan-500/10 text-cyan-600" },
//   { name: "Moving", icon: Truck, color: "bg-orange-500/10 text-orange-600" },
//   { name: "Salon", icon: Scissors, color: "bg-purple-500/10 text-purple-600" },
//   { name: "Photography", icon: Camera, color: "bg-rose-500/10 text-rose-600" },
//   { name: "Catering", icon: Utensils, color: "bg-green-500/10 text-green-600" },
//   { name: "Interior", icon: Home, color: "bg-indigo-500/10 text-indigo-600" },
//   { name: "Auto Repair", icon: Car, color: "bg-slate-500/10 text-slate-600" },
//   { name: "Carpentry", icon: Hammer, color: "bg-yellow-500/10 text-yellow-700" },
//   { name: "Gardening", icon: Flower2, color: "bg-emerald-500/10 text-emerald-600" },
// ];
const categories = [
  { name: "Plumber", icon: Wrench, color: "bg-blue-500/10 text-blue-600" },
  { name: "Electrician", icon: Zap, color: "bg-yellow-500/10 text-yellow-600" },
  { name: "Carpenter", icon: Hammer, color: "bg-yellow-500/10 text-yellow-700" },
  { name: "Cleaning", icon: Sparkles, color: "bg-cyan-500/10 text-cyan-600" },
  { name: "AC Repair", icon: Wrench, color: "bg-indigo-500/10 text-indigo-600" },
  { name: "Painter", icon: Paintbrush, color: "bg-pink-500/10 text-pink-600" },
  { name: "Tutor", icon: BookOpen, color: "bg-green-500/10 text-green-600" },
  { name: "Beautician", icon: Scissors, color: "bg-purple-500/10 text-purple-600" },
  { name: "Home Cleaning", icon: Home, color: "bg-cyan-500/10 text-cyan-700" },
  { name: "Salon at Home", icon: Sparkles, color: "bg-rose-500/10 text-rose-600" },
  { name: "Car Repair", icon: Car, color: "bg-slate-500/10 text-slate-600" },
  { name: "Gardening", icon: Flower2, color: "bg-emerald-500/10 text-emerald-600" },
];
const CategoriesSection = ({ onCategorySelect }) => {
  return (
    <section id="categories" className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">
            Browse by Category
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose a service you need
          </p>
        </div>

        <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          gap-3 sm:gap-4 md:gap-6
        ">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategorySelect(cat.name)}
              className="
                bg-white
                rounded-2xl
                p-4 sm:p-5 md:p-6
                shadow-md
                hover:shadow-xl
                transition
                hover:-translate-y-1
              "
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 rounded-xl ${cat.color} flex items-center justify-center`}>
                <cat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <span className="block text-xs sm:text-sm font-medium text-black">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
