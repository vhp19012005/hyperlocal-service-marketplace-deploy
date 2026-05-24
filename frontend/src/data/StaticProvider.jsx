export const staticProvider = {
  id: 1,
  name: "John Doe",
  category: "Plumbing",
  subcategory: "Pipe Repair",
  rating: 4.8,
  totalReviews: 120,
  yearsExperience: 5,
  isVerified: true,
  responseTime: "Within 2 hours",

  about:
    "Professional plumber with 5+ years of experience in residential and commercial services.",

  credentials: ["Licensed", "Insured", "Background Verified"],

  workingHours: {
    days: "Mon – Sat",
    hours: "9:00 AM – 7:00 PM",
  },

  serviceArea: ["Ahmedabad", "Gandhinagar", "Maninagar"],

  contact: {
    phone: "+91 98765 43210",
    email: "johndoe@gmail.com",
  },

  services: [
    {
      id: 1,
      name: "Pipe Fix",
      description: "Fix broken or leaking pipes",
      duration: "1 hr",
      price: 58,
      isPopular: true,
    },
    {
      id: 2,
      name: "Leak Repair",
      description: "Leak detection and repair",
      duration: "2 hrs",
      price: 80,
    },
  ],

  gallery: [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      label: "Bathroom Repair",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1597764690523-15bea4c581c9",
      label: "Kitchen Plumbing",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1605902711622-cfb43c443b6b",
      label: "Pipe Installation",
    },
  ],

  reviews: {
    rating: 4.8,
    totalReviews: 120,
    list: [
      {
        id: 1,
        userName: "Rahul Sharma",
        rating: 5,
        comment: "Very professional and quick service",
        serviceType: "Pipe Fix",
        date: "2024-08-12",
        isVerified: true,
      },
      {
        id: 2,
        userName: "Amit Patel",
        rating: 4,
        comment: "Good work, reasonable price",
        serviceType: "Leak Repair",
        date: "2024-07-02",
        isVerified: true,
      },
      {
        id: 3,
        userName: "Sneha Mehta",
        rating: 5,
        comment: "Excellent work and very polite",
        serviceType: "Pipe Fix",
        date: "2024-06-22",
        isVerified: true,
      },
    ],
  },
};
