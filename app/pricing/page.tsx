"use client";
import { Button } from "@/components/ui/button";
import { CheckIcon, Star, Zap, Shield, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Basic",
    price: "9",
    priceId: "price_1PyFKGBibz3ZDixDAaJ3HO74",
    features: [
      "100 AI-generated posts per month",
      "Twitter thread generation",
      "Basic analytics",
      "Email support",
    ],
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    color: "blue",
  },
  {
    name: "Pro",
    price: "29",
    priceId: "price_1PyFN0Bibz3ZDixDqm9eYL8W",
    features: [
      "500 AI-generated posts per month",
      "Twitter, Instagram, and LinkedIn content",
      "Advanced analytics",
      "Priority support",
      "Content calendar",
      "A/B testing",
    ],
    icon: <Star className="w-6 h-6 text-yellow-400" />,
    color: "yellow",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceId: null,
    features: [
      "Unlimited AI-generated posts",
      "All social media platforms",
      "Custom AI model training",
      "Dedicated account manager",
      "24/7 phone support",
      "API access",
    ],
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    color: "purple",
  },
];

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const handleSubscribe = async (priceId: string) => {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user?.id,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.h1 
          className="text-4xl sm:text-5xl font-bold mb-4 text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Supercharge Your Social Media Presence
        </motion.h1>
        <motion.p 
          className="text-xl text-center text-gray-300 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Choose the perfect plan to elevate your brand and dominate your niche
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-lg border-2 ${plan.popular ? 'border-yellow-400' : 'border-gray-800'} flex flex-col relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredPlan(index as any)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-black font-bold py-1 px-4 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className={`text-${plan.color}-400 mb-4`}>{plan.icon}</div>
              <h2 className="text-2xl font-bold mb-2 text-white">{plan.name}</h2>
              <p className="text-4xl font-bold mb-6 text-white">
                ${plan.price}
                <span className="text-lg font-normal text-gray-400">
                  {plan.price !== "Custom" ? "/month" : ""}
                </span>
              </p>
              <ul className="mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center mb-3 text-gray-300"
                  >
                    <CheckIcon className={`w-5 h-5 mr-2 text-${plan.color}-400`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
                disabled={isLoading || !plan.priceId}
                className={`w-full bg-${plan.color}-500 text-white hover:bg-${plan.color}-600 transition-all duration-300 ${hoveredPlan === index ? 'scale-105' : ''}`}
              >
                {isLoading ? "Processing..." : (plan.priceId ? "Get Started" : "Contact Sales")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4">Not sure which plan is right for you?</h3>
          <p className="text-gray-300 mb-4">Our team is here to help you choose the perfect solution for your needs.</p>
          <Button className="bg-white text-black hover:bg-gray-200">
            Schedule a Free Consultation
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
