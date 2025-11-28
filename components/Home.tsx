import React from 'react';
import { ArrowRight, Globe, Recycle, TrendingDown } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://picsum.photos/1600/900?grayscale"
            alt="Zimbabwe landscape"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            A Greener Future <br className="hidden sm:block" />
            <span className="text-emerald-400">For Zimbabwe</span>
          </h1>
          <p className="mt-6 text-xl text-emerald-100 max-w-3xl">
            Implement the "Right Cycle" in your business. We help you calculate, reduce, and offset your carbon footprint, turning PPE waste into new possibilities.
          </p>
          <div className="mt-10 max-w-sm sm:max-w-none sm:flex">
            <button
              onClick={onStart}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-900 bg-white hover:bg-emerald-50 md:py-4 md:text-lg md:px-10 transition-transform transform hover:scale-105"
            >
              Start Calculator <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="mt-3 w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-100 bg-emerald-800 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 sm:mt-0 sm:ml-3">
              Learn about Right Cycle
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-emerald-600 tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Zero Waste to Landfill
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Carbon Media provides the tools to measure impact and the solutions to reduce it, tailored for the Zimbabwean industry.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:shadow-lg transition-shadow">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-emerald-500 rounded-md shadow-lg">
                        <TrendingDown className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Accurate Tracking</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Input energy (ZESA), fuel, and waste metrics to get a precise CO2 footprint calculation instantly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:shadow-lg transition-shadow">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-emerald-500 rounded-md shadow-lg">
                        <Recycle className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">The Right Cycle</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Specifically designed to tackle hard-to-recycle PPE waste. Don't dump it—recycle it into eco-pellets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:shadow-lg transition-shadow">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-emerald-500 rounded-md shadow-lg">
                        <Globe className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Global Standards</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Align your Zimbabwean business with international sustainability goals and carbon-neutral visions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};