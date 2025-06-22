import React from "react";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

const cardHover = {
  y: -8,
  transition: { 
    duration: 0.4,
    ease: [0.16, 1, 0.3, 1]
  }
};

const About = () => {
  return (
    <section id="about" className="min-h-screen flex items-center bg-gray-950 text-white py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(56,182,255,0.1)_0,_transparent_70%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-900/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Shaping Indonesia's
            </span>
            <motion.span 
              className="block text-3xl md:text-4xl font-medium mt-4 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Digital Future from Tangerang
            </motion.span>
          </h2>
          
          <motion.p 
            className="text-gray-400 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            As a pioneering AI company based in Tangerang, we're building transformative technologies while cultivating 
            <span className="text-blue-400 font-medium"> local talent ecosystems</span>. Our vision extends beyond products - we're architecting Indonesia's position in the global digital economy.
          </motion.p>
        </motion.div>

        {/* Core Plans */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* AI & Job Opportunities */}
          <motion.div 
            className="group relative p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 hover:border-blue-500/30 overflow-hidden"
            variants={item}
            whileHover={cardHover}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,182,255,0.05)_0,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI Infrastructure</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Developing <span className="font-bold text-white">"Orion Core"</span> — Indonesia's first enterprise-grade generative AI platform:
              </p>
              <ul className="space-y-3 text-left">
                <motion.li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">500+ high-tech jobs in Greater Jakarta by 2026</span>
                </motion.li>
                <motion.li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">AI training programs for 10,000 Tangerang residents</span>
                </motion.li>
                <motion.li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">Strategic partnerships with 5 local universities</span>
                </motion.li>
              </ul>
            </div>
          </motion.div>

          {/* Tech Education */}
          <motion.div 
            className="group relative p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 hover:border-purple-500/30 overflow-hidden"
            variants={item}
            whileHover={cardHover}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.05)_0,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-6">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Digital Literacy</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Our commitment to making Indonesia AI-ready by 2030:
              </p>
              <ul className="space-y-3 text-left">
                <motion.li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">Digital workshops in 150+ schools across Banten</span>
                </motion.li>
                <motion.li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">Localized AI education platform in Bahasa Indonesia</span>
                </motion.li>
                <motion.li className="flex items-start">
                  <svg className="w-5 h-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">Full-ride scholarships for 100 exceptional talents annually</span>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Blockchain Section */}
        <motion.div 
          className="relative mt-24 p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 overflow-hidden max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileHover={{
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:40px_40px] opacity-5"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-8">
              <span className="text-3xl">🔗</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">Orion Chain Ecosystem</h3>
            <p className="text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our blockchain initiative <span className="font-bold text-white">$ORION</span> will power the next generation of decentralized AI applications with:
            </p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div 
                className="p-6 rounded-xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-800 hover:border-blue-500/50 backdrop-blur-sm"
                variants={item}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 10px 15px -3px rgba(56, 182, 255, 0.1)"
                }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl">💸</span>
                </div>
                <h4 className="font-medium mb-2">Incentivized Network</h4>
                <p className="text-gray-400 text-sm">Token rewards for data contributors and validators</p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-800 hover:border-purple-500/50 backdrop-blur-sm"
                variants={item}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 10px 15px -3px rgba(168, 85, 247, 0.1)"
                }}
              >
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl">🌐</span>
                </div>
                <h4 className="font-medium mb-2">Local Economy</h4>
                <p className="text-gray-400 text-sm">Frictionless payments for Indonesian developers</p>
              </motion.div>
              
              <motion.div 
                className="p-6 rounded-xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-800 hover:border-blue-400/50 backdrop-blur-sm"
                variants={item}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 10px 15px -3px rgba(56, 182, 255, 0.1)"
                }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-400/10 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-xl">📈</span>
                </div>
                <h4 className="font-medium mb-2">AI Governance</h4>
                <p className="text-gray-400 text-sm">Decentralized model training and validation</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Vision Statement */}
        <motion.div 
          className="mt-28 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h3 
            className="text-3xl md:text-4xl font-bold mb-12"
            initial={{ y: -20 }}
            whileInView={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            viewport={{ once: true }}
          >
            Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Indonesia's</span> Digital Sovereignty
          </motion.h3>
          
          <motion.div 
            className="relative p-10 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 overflow-hidden"
            whileHover={{
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:40px_40px] opacity-5"></div>
           <div className="relative z-10">
  <motion.p 
    className="text-gray-300 text-lg md:text-xl leading-relaxed italic mb-4"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.8 }}
    viewport={{ once: true }}
  >
    "From our strategic base in Tangerang, we're architecting more than products—we're building 
    <span className="text-blue-400 font-medium"> Indonesia's technological independence</span>. Every innovation is designed to transition our nation from 
    <span className="font-medium"> technology consumers to creators</span>, starting with empowering our local community."
  </motion.p>
  
  <motion.p 
    className="text-gray-300 text-lg md:text-xl leading-relaxed italic mb-4"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.8 }}
    viewport={{ once: true }}
  >
    "Dari markas strategis kami di Tangerang, kami tidak hanya merancang produk—kami sedang membangun 
    <span className="text-blue-400 font-medium"> kemandirian teknologi Indonesia</span>. Setiap inovasi dirancang untuk mengubah bangsa ini dari 
    <span className="font-medium"> konsumen teknologi menjadi pencipta</span>, dimulai dari pemberdayaan komunitas lokal."
  </motion.p>

  <motion.p 
    className="text-blue-400 font-medium"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.8 }}
    viewport={{ once: true }}
  >
    — Orion Leadership Team
  </motion.p>
</div>

          </motion.div>
        </motion.div>

        {/* CEO Profile */}
        <motion.div 
          className="mt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h3 
            className="text-2xl md:text-3xl font-bold mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Visionary Leader</span>
          </motion.h3>
          
          <div className="flex flex-col items-center">
            <motion.div 
              className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-transparent bg-gradient-to-br from-blue-500 to-purple-600 p-1 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{
                boxShadow: "0 20px 25px -5px rgba(56, 182, 255, 0.2), 0 10px 10px -5px rgba(56, 182, 255, 0.1)"
              }}
            >
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:40px_40px] opacity-10"></div>
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img 
                  src="/ceo.png" 
                  alt="CEO of Orion AI" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
              </div>
            </motion.div>
            
           <motion.div
  className="text-center max-w-md"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  viewport={{ once: true }}
>
  <h4 className="text-xl font-bold mb-2">Ferry Fernando</h4>
  <p className="text-blue-400 mb-4">Founder & Chief Executive Officer (CEO)</p>

  <p className="text-gray-400 italic mb-2">
    “Teknologi adalah penyamarataan terbesar dalam sejarah manusia. Misi kami bukan sekadar memastikan Indonesia ikut serta dalam revolusi AI—tetapi menjadi salah satu kekuatan yang membentuk masa depannya.”
  </p>
  <p className="text-gray-400 italic mb-2">
    “Technology is the great equalizer. Our mission is to ensure Indonesia doesn't just participate in the AI revolution, but helps shape its direction.”
  </p>
  <p className="text-gray-400 italic">
    “科技是人类历史上最大的平等化工具。我们的使命不仅是确保印尼参与人工智能革命，更是要成为塑造其未来方向的重要力量。”
  </p>
</motion.div>


          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;