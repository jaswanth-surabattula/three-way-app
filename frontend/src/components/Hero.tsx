import { motion } from 'motion/react';

export const Hero = ({ subtext }: { subtext: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center text-center px-4 mb-12"
    >
      <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4 py-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x leading-[1.1] w-[620px] h-[188px] flex items-center justify-center">
        Three-Way
      </h1>
      <div className="h-8">
        <motion.p
          key={subtext}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl"
        >
          {subtext}
        </motion.p>
      </div>
    </motion.div>
  );
};
