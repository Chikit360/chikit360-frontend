import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons';


interface Scheme {
  price: number;
  validityInDays: number;
  discount: number;
}

interface Plan {
  scheme: Scheme[];
}

interface Props {
  plan: Plan;
}

const SchemeSlider: React.FC<Props> = ({ plan, }) => {
    console.log(plan)
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSchemes = plan.scheme.length;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : totalSchemes - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < totalSchemes - 1 ? prevIndex + 1 : 0));
  };

  const currentScheme = plan.scheme[currentIndex];

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <button
        onClick={handlePrev}
        className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
        aria-label="Previous Scheme"
      >
        <ChevronLeftIcon />
      </button>

      <div className="text-center text-2xl font-semibold text-indigo-700">
        ₹{currentScheme.price} / {currentScheme.validityInDays} Days
        <div className="text-sm text-gray-600 mt-1">
          {currentScheme.discount}% off
        </div>
      </div>

      <button
        onClick={handleNext}
        className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
        aria-label="Next Scheme"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

export default SchemeSlider;
