'use client'
import { Zap, MessageSquare, Sparkles, Repeat, Share2, TrendingUp, PenTool, Clock, BarChart, Video, Image, Headphones } from 'lucide-react';
import { Navbar } from "@/components/Navbar";
import { motion } from 'framer-motion';
import { useState } from 'react';

const features = [
  {
    icon: <Zap className="h-6 w-6 text-yellow-400" />,
    title: 'AI-Powered Content Generation',
    description: 'Leverage cutting-edge AI to create engaging content for multiple platforms.',
    benefit: 'Save hours of brainstorming and writing time.'
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-blue-400" />,
    title: 'Multi-Platform Support',
    description: 'Generate content optimized for Twitter, Instagram, LinkedIn, and more.',
    benefit: 'Reach your audience wherever they are.'
  },
  {
    icon: <Sparkles className="h-6 w-6 text-purple-400" />,
    title: 'Customizable Prompts',
    description: 'Tailor your content with specific prompts and industry focus.',
    benefit: 'Create content that truly resonates with your niche.'
  },
  {
    icon: <Repeat className="h-6 w-6 text-green-400" />,
    title: 'Content History',
    description: 'Access and reuse your previously generated content.',
    benefit: 'Build on your success and maintain consistency.'
  },
  {
    icon: <Share2 className="h-6 w-6 text-pink-400" />,
    title: 'Easy Sharing',
    description: 'Seamlessly share your generated content across platforms.',
    benefit: 'Amplify your reach with just a few clicks.'
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-orange-400" />,
    title: 'Performance Optimization',
    description: 'Content optimized for engagement, shares, and platform-specific metrics.',
    benefit: 'Stay ahead of the algorithm and boost your visibility.'
  },
  {
    icon: <PenTool className="h-6 w-6 text-indigo-400" />,
    title: 'AI Copywriting',
    description: 'Generate compelling ad copy, product descriptions, and more.',
    benefit: 'Craft persuasive messages that convert.'
  },
  {
    icon: <Clock className="h-6 w-6 text-red-400" />,
    title: 'Time-Saving Automation',
    description: 'Automate repetitive tasks and focus on high-value activities.',
    benefit: 'Reclaim your time and boost productivity.'
  },
  {
    icon: <BarChart className="h-6 w-6 text-teal-400" />,
    title: 'Analytics Dashboard',
    description: 'Track your content performance and optimize your strategy.',
    benefit: 'Make data-driven decisions to improve your results.'
  },
  {
    icon: <Video className="h-6 w-6 text-cyan-400" />,
    title: 'Video Script Generation',
    description: 'Create engaging video scripts for various platforms.',
    benefit: 'Expand your content mix with compelling videos.'
  },
  {
    icon: <Image className="h-6 w-6 text-amber-400" />,
    title: 'AI Image Generation',
    description: 'Generate unique images to complement your content.',
    benefit: 'Stand out with eye-catching visuals.'
  },
  {
    icon: <Headphones className="h-6 w-6 text-lime-400" />,
    title: 'Podcast Content Creation',
    description: 'Generate podcast ideas, outlines, and show notes.',
    benefit: 'Expand your reach with audio content.'
  }
];

export default function FeaturesPage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Unleash Your Content Potential
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-center mb-12 text-gray-300"
        >
          Experience the power of AI-driven content creation and skyrocket your online presence.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setHoveredFeature(index as any)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 relative overflow-hidden"
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{feature.description}</p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: hoveredFeature === index ? 1 : 0, y: hoveredFeature === index ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-medium text-purple-400"
              >
                {feature.benefit}
              </motion.div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-500 to-pink-500 opacity-10 rounded-tl-full"></div>
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <a href="/pricing" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center group">
            Start Your Content Revolution
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 text-center text-gray-400"
        >
          Join thousands of content creators who've transformed their online presence
        </motion.p>
      </div>
    </div>
  );
}
