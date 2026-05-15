import { useState, useEffect } from "react";
import axios from "axios";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

import FlashcardItem from "./components/FlashcardItem";
import Controls from "./components/Controls";
import CardCounter from "./components/CardCounter";

const Flashcards = () => {
  const [cards, setCards] = useState([]);
  const [sets, setSets] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem("aiFlashcards")) || [];

    if (savedCards.length > 0) {
      setCards(savedCards);
      setSets(savedCards);
      return;
    }

    axios
      .get("http://localhost:3000/flashcards")
      .then((res) => {
        setCards(res.data);
        setSets(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const goNext = () => {
    setFlipped(false);
    setCurrentIndex((i) => Math.min(i + 1, cards.length - 1));
  };

  const goPrev = () => {
    setFlipped(false);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const card = cards[currentIndex] || {};

  return (
    <div className="max-w-2xl mx-auto animate-fade-in p-4 min-h-screen bg-white text-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🃏 Flashcards</h1>

        <Link to="/">
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <Home className="w-4 h-4" /> Back to Home
          </button>
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 text-center text-gray-600">
          No flashcards yet. Go to Home and click Generate Study Materials.
        </div>
      ) : (
        <>
          <CardCounter
            current={currentIndex + 1}
            total={cards.length}
          />

          <FlashcardItem
            card={card}
            flipped={flipped}
            setFlipped={setFlipped}
          />

          <Controls
            goPrev={goPrev}
            goNext={goNext}
            resetFlip={() => setFlipped(false)}
            disablePrev={currentIndex === 0}
            disableNext={currentIndex === cards.length - 1}
          />
        </>
      )}

      <div className="bg-gray-900 rounded-xl shadow-lg p-5 border border-gray-700 mt-6">
        <h3 className="text-lg font-semibold mb-3 !text-white">
          📚 Generated Flashcards
        </h3>

        <div className="space-y-2">
          {sets.length === 0 ? (
            <p className="text-sm text-gray-300">
              No generated flashcards yet.
            </p>
          ) : (
            sets.map((set, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setFlipped(false);
                }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    Card {index + 1}
                  </p>

                  <p className="text-xs text-gray-300">
                    {set.question}
                  </p>
                </div>

                <span className="text-xs text-gray-400">
                  AI
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;