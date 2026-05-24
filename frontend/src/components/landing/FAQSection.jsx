import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How do I book a service on LocalServe?",
    answer:
      "Simply search for the service you need, browse through available providers in your area, compare ratings and pricing, then select your preferred time slot and confirm your booking. The entire process takes just a few clicks.",
  },
  {
    question: "How do I become a service provider?",
    answer:
      "Click the 'Become a Provider' link and complete the sign-up form with your professional details, service areas, and availability. Once your profile is verified, you'll start receiving booking requests from customers in your locality.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "LocalServe supports multiple payment options including credit/debit cards, UPI, net banking, and cash on delivery. All online transactions are secured with industry-standard encryption.",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Yes, you can cancel or reschedule a booking from your profile dashboard up to 2 hours before the scheduled time at no extra charge. Cancellations made within the 2-hour window may incur a small fee.",
  },
  {
    question: "How are service providers verified?",
    answer:
      "Every provider goes through a multi-step verification process including identity checks, professional credential validation, and background screening. We also monitor ongoing ratings and reviews to maintain service quality.",
  },
];

const FAQItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg font-medium text-gray-900 pr-4">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-blue-600" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-600 text-sm sm:text-base leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-28 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Got questions? We have answers. Find everything you need to know about using LocalServe.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
