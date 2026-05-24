const NavigationMenu = ({ menuItems, activeSection, setActiveSection }) => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 pb-6">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              activeSection === item.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default NavigationMenu;
