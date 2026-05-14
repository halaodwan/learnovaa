import { motion } from "framer-motion";

const FlashcardItem = ({ card, flipped, setFlipped }) => {
  return (
    <div
      className="cursor-pointer mb-6"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-64"
      >
        
        <div
          className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center border"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-xs text-gray-500 mb-3">Question</span>
          <p className="text-lg font-semibold text-white">{card.question}</p>
        </div>

        
        <div
          className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center border"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-xs text-green-600 mb-3">Answer</span>
          <p>{card.answer}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default FlashcardItem;