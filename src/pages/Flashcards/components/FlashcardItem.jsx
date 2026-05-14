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
        
        {/* QUESTION (ثابت كحلي) */}
        <div
          className="absolute inset-0 bg-gray-900 text-white rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center border"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-xs text-gray-300 mb-3">Question</span>
          <p className="text-lg font-semibold">{card.question}</p>
        </div>

        {/* ANSWER (ثابت أبيض) */}
        <div
          className="absolute inset-0 bg-white text-gray-900 rounded-xl shadow-lg flex flex-col items-center justify-center p-8 text-center border"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="text-xs text-gray-500 mb-3">Answer</span>
          <p className="text-lg font-medium">{card.answer}</p>
        </div>

      </motion.div>
    </div>
  );
};

export default FlashcardItem;