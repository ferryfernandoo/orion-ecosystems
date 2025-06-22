import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Enhanced Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 120,
      mass: 0.5,
    },
  },
  exit: { opacity: 0, y: 20 }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.5)",
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    },
  },
  tap: {
    scale: 0.98,
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, rotate: -1 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  hover: {
    y: -15,
    rotate: 0.5,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
    transition: {
      duration: 0.5,
      ease: "easeOut"
    },
  },
};

const floatingVariants = {
  float: {
    y: [0, -25, 0],
    rotate: [0, -5, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  floatDelay: {
    y: [0, -30, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 9,
      delay: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  floatDelay2: {
    y: [0, -35, 0],
    rotate: [0, -3, 0],
    transition: {
      duration: 10,
      delay: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const gradientTextVariants = {
  hidden: { backgroundPosition: "0% 50%" },
  visible: {
    backgroundPosition: "100% 50%",
    transition: {
      duration: 8,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

const Home = () => {
  const navigate = useNavigate();

  // Enhanced static data with more professional roles
  const roles = useMemo(() => [
    { 
      role: "AI Solutions Architect", 
      description: "Design end-to-end AI systems that solve complex business challenges at scale",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    { 
      role: "Machine Learning Engineer", 
      description: "Implement state-of-the-art algorithms and optimize model performance",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      role: "Data Science Lead", 
      description: "Extract actionable insights from complex datasets to drive decision making",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      role: "Cloud Infrastructure Engineer", 
      description: "Build scalable and secure cloud-native AI platforms",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    { 
      role: "AI Product Manager", 
      description: "Bridge technical and business needs to deliver impactful AI products",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      role: "AI Ethics Specialist", 
      description: "Ensure responsible and ethical development of AI systems",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
  ], []);

  const valuePropositions = useMemo(() => [
    {
      title: "Enterprise AI Transformation",
      description: "We architect and deploy AI solutions that drive digital transformation, operational excellence, and competitive advantage for Fortune 500 companies.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "AI Talent Development",
      description: "Our comprehensive AI education programs cultivate the next generation of technical leaders through hands-on training and research opportunities.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Strategic AI Consulting",
      description: "We help organizations develop and execute AI strategies that align with business objectives and deliver measurable ROI.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ], []);

  // Enhanced particles with more dynamic properties
  const particles = useMemo(() => 
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 7,
      scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 1],
      opacity: [Math.random() * 0.3 + 0.1, Math.random() * 0.5 + 0.3]
    }))
  , []);

  // Floating orb animation
  const floatingOrbs = useMemo(() => [
    {
      id: 1,
      size: "w-64 h-64",
      color: "bg-blue-500/20",
      position: "top-1/4 left-10",
      animation: {
        y: [0, -40, 0],
        x: [0, 20, 0],
        transition: {
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 2,
      size: "w-96 h-96",
      color: "bg-purple-500/15",
      position: "top-1/3 right-20",
      animation: {
        y: [0, -60, 0],
        x: [0, -30, 0],
        transition: {
          duration: 18,
          delay: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    {
      id: 3,
      size: "w-80 h-80",
      color: "bg-cyan-500/10",
      position: "bottom-1/4 left-1/3",
      animation: {
        y: [0, 50, 0],
        x: [0, -20, 0],
        transition: {
          duration: 20,
          delay: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  ], []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        {floatingOrbs.map(orb => (
          <motion.div
            key={orb.id}
            className={`absolute ${orb.size} ${orb.color} rounded-full blur-3xl filter ${orb.position}`}
            animate={orb.animation}
          />
        ))}

        {/* Animated Particles */}
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-blue-400/30 backdrop-blur-sm"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              initial={{ opacity: particle.opacity[0], scale: particle.scale[0] }}
              animate={{
                opacity: particle.opacity,
                scale: particle.scale,
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </AnimatePresence>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-6xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              className="mb-12"
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <span className="h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-blue-100">Orion Ai server hypernova1 is online/ systems ready</span>
              </motion.div>
              
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                variants={itemVariants}
              >
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-[length:300%_300%] inline-block"
                  variants={gradientTextVariants}
                  initial="hidden"
                  animate="visible"
                >
                  Selamat Datang
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                variants={itemVariants}
              >
               Orion AI adalah gabungan otak-otak jenius anak muda Indonesia—liar, kreatif, dan tak terbendung..
              </motion.p>
            </motion.div>

            <motion.div
              className="flex flex-wrap justify-center gap-6"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => navigate("/chatbot")}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 relative overflow-hidden group"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start AI Chat
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate("/Products")}
                className="px-10 py-4 bg-transparent border-2 border-blue-400 rounded-xl font-semibold text-lg hover:bg-blue-400/10 relative overflow-hidden group"
                variants={buttonVariants}
                whileHover={{
                  ...buttonVariants.hover,
                  backgroundColor: "rgba(96, 165, 250, 0.1)"
                }}
                whileTap="tap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Semua Produk Kami
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
            </motion.div>

            {/* Animated Scroll Indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <motion.div
                className="flex flex-col items-center"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm text-blue-300 mb-2">Scroll Down</span>
                <div className="w-6 h-10 border-2 border-blue-400/50 rounded-full p-1">
                  <motion.div
                    className="w-1 h-3 bg-blue-400 rounded-full mx-auto"
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Enhanced CTA Section */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-0.5">
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 md:p-12">
              <motion.div
                className="flex flex-col md:flex-row justify-between items-center gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                <motion.div className="md:w-2/3" variants={itemVariants}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      Ready to Transform Your Business with AI?
                    </span>
                  </h2>
                  <p className="text-lg text-gray-300">
                    Discover how our AI solutions can drive innovation, efficiency, and growth for your organization.
                  </p>
                </motion.div>
                
                <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
                  <motion.button
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                    variants={buttonVariants}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 15px 30px -5px rgba(59, 130, 246, 0.5)"
                    }}
                    whileTap="tap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    View Solutions
                  </motion.button>
                  
                  <motion.button
                    className="px-8 py-3 border-2 border-blue-400 text-blue-100 font-medium rounded-lg hover:bg-blue-900/20 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                    variants={buttonVariants}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(29, 78, 216, 0.15)",
                      boxShadow: "0 15px 30px -5px rgba(96, 165, 250, 0.3)"
                    }}
                    whileTap="tap"
                    onClick={() => navigate("/chatbot")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    AI Demo
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Roles Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div className="text-center mb-20" variants={itemVariants}>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6"
                variants={itemVariants}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Join Our World-Class Team
                </span>
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-400 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                We're building the future of AI with the brightest minds across multiple disciplines.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {roles.map((role, index) => (
                  <motion.div
                    key={role.role}
                    className="glass p-8 rounded-2xl hover:shadow-2xl transition-all border border-gray-800 hover:border-blue-400/30 relative overflow-hidden group"
                    variants={cardVariants}
                    whileHover="hover"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                  >
                    {/* Animated background */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.2 }}
                    />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-blue-400/10 rounded-xl filter blur-md"></div>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <motion.div
                        className="text-blue-400 mb-6 p-3 bg-gray-800/50 rounded-lg inline-flex"
                        initial={{ scale: 1 }}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: [0, 5, -5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        {role.icon}
                      </motion.div>
                      <h3 className="text-2xl font-semibold mb-4">{role.role}</h3>
                      <p className="text-gray-400 mb-6">{role.description}</p>
                      <motion.button
                        className="text-blue-400 font-medium flex items-center gap-2 group"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        View Position
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        {/* Value Propositions */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          </div>
          
          <motion.div
            className="max-w-7xl mx-auto relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div className="text-center mb-20" variants={itemVariants}>
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6"
                variants={itemVariants}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                  Why Partner With Us
                </span>
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-400 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                We deliver measurable business impact through strategic AI implementation.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {valuePropositions.map((prop, index) => (
                <motion.div
                  key={prop.title}
                  className="glass p-8 rounded-2xl border border-gray-800 hover:border-blue-400/30 relative group overflow-hidden"
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <motion.div
                      className="mb-8 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl inline-flex"
                      animate="float"
                      variants={floatingVariants}
                    >
                      {prop.icon}
                    </motion.div>
                    <h3 className="text-2xl font-semibold mb-4">{prop.title}</h3>
                    <p className="text-gray-400 mb-6">{prop.description}</p>
                    <motion.button
                      className="text-blue-400 font-medium flex items-center gap-2 group"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      Learn More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
          </div>
          
          <motion.div
            className="max-w-4xl mx-auto text-center relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-8"
              variants={itemVariants}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Ready to Begin Your AI Journey?
              </span>
            </motion.h2>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-12"
              variants={itemVariants}
            >
              Whether you're looking to implement AI solutions or join our team of innovators, we're here to help you take the next step.
            </motion.p>

            <motion.div className="flex flex-wrap justify-center gap-6" variants={itemVariants}>
              <motion.button
                onClick={() => navigate("/contact")}
                className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg group relative overflow-hidden"
                variants={buttonVariants}
                whileHover={{
                  ...buttonVariants.hover,
                  boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.6)"
                }}
                whileTap="tap"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Schedule a Consultation
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate("/Form")}
                className="px-12 py-5 bg-transparent border-2 border-blue-400 rounded-xl font-semibold text-lg group relative overflow-hidden"
                variants={buttonVariants}
                whileHover={{
                  ...buttonVariants.hover,
                  backgroundColor: "rgba(96, 165, 250, 0.1)",
                  boxShadow: "0 20px 40px -10px rgba(96, 165, 250, 0.4)"
                }}
                whileTap="tap"
              >
                <span className="relative z-10 flex items-center gap-3">
                Lowongan Join Tim kami
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Home;