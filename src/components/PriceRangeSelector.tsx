import React from 'react';
import { Range, getTrackBackground } from 'react-range';

// Define a type for the props
interface PriceRangeSelectorProps {
  pricesRange: [number, number];  // Prices range as a tuple of two numbers
  setPriceRange: (range: [number, number]) => void;  // Function to set the price range
  handleConfirmPrice: () => void;  // Function to handle price confirmation
}

const STEP = 1;
const MIN = 0;
const MAX = 1000;

const PriceRangeSelector: React.FC<PriceRangeSelectorProps> = ({
  pricesRange,
  setPriceRange,
  handleConfirmPrice,
}) => (
  <div className="flex flex-col items-center space-y-6 p-4 rounded-lg shadow-md bg-white max-w-md mx-auto">
    <div className="flex flex-col items-center space-y-4 w-full">
      <p className="text-lg font-semibold text-gray-700">
        Select Your Price Range
      </p>
      <p className="text-md text-gray-600">
        ${pricesRange[0]} - ${pricesRange[1]}
      </p>

      <div className="w-11/12">
        <Range
          values={pricesRange}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={(values) => setPriceRange(values as [number, number])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '8px',
                width: '100%',
                background: getTrackBackground({
                  values: pricesRange,
                  colors: ['#d1d5db', '#f5694b', '#d1d5db'],
                  min: MIN,
                  max: MAX,
                }),
                borderRadius: '6px',
              }}
              className="w-full"
            >
              {children}
            </div>
          )}
          renderThumb={({ props, index }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '20px',
                width: '20px',
                backgroundColor: '#f5694b',
                border: '2px solid white',
                borderRadius: '50%',
                boxShadow: '0 0 0 4px rgba(245, 105, 75, 0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              className="focus:outline-none"
            >
              <div
                style={{
                  height: '6px',
                  width: '6px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                }}
              />
            </div>
          )}
        />
      </div>
    </div>

    <button
      onClick={handleConfirmPrice}
      className="mt-4 px-6 py-2 bg-[#f5694b] text-white text-sm font-semibold rounded-full hover:bg-[#e65a3d] transition"
    >
      Confirm Price
    </button>
  </div>
);

export default PriceRangeSelector;
