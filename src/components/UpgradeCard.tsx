
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const UpgradeCard = () => {
  return (
    <div className="relative bg-blue-600 rounded-xl overflow-hidden text-white p-6">
      <div className="relative z-10">
        <h3 className="font-semibold text-lg mb-2">Upgrade your plan to premium</h3>
        <p className="text-blue-100 text-sm mb-6">and enjoy our amazing features</p>
        
        <Button 
          variant="secondary" 
          className="bg-white text-blue-600 hover:bg-blue-50 w-full justify-center"
        >
          Upgrade
        </Button>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute h-32 w-32 rounded-full bg-blue-300"
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', right: '5%' }}
        />
        
        <motion.div 
          className="absolute h-16 w-16 rounded-full bg-pink-400"
          animate={{
            x: [0, -15, 0],
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          }}
          style={{ top: '15%', right: '20%' }}
        />
        
        <motion.div 
          className="absolute h-24 w-24 rounded-full bg-yellow-300"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut"
          }}
          style={{ bottom: '30%', left: '10%' }}
        />
      </div>
    </div>
  );
};

export default UpgradeCard;
