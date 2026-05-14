const CardCounter = ({ current, total }) => {
  return (
    <div className="mb-2 text-center text-sm text-gray-500">
      Card {current} of {total}
    </div>
  );
};

export default CardCounter;