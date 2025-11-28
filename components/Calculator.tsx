import React, { useState, useEffect } from 'react';
import { CarbonInputData } from '../types';
import { Truck, Zap, Trash2, Factory, Info } from 'lucide-react';

interface CalculatorProps {
  onCalculate: (data: CarbonInputData) => void;
  initialData?: CarbonInputData;
}

export const Calculator: React.FC<CalculatorProps> = ({ onCalculate, initialData }) => {
  const [formData, setFormData] = useState<CarbonInputData>({
    companyName: 'Acme Zim Manufacturing',
    location: 'Harare, Zimbabwe',
    energyUsageKwH: 15000,
    wasteGeneralKg: 5000,
    wastePPEKg: 1200,
    transportFuelLitres: 4500,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'companyName' || name === 'location' ? value : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-emerald-600 p-6 text-white">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Factory className="h-8 w-8" />
            Carbon Calculator
          </h2>
          <p className="mt-2 text-emerald-100 opacity-90">
            Measure your impact. Identify PPE waste. Plan for a carbon-neutral Zimbabwe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* General Info */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Organization Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Energy */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Energy Consumption
            </h3>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-4">
              <p className="text-sm text-yellow-800 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                Zimbabwe Grid Emission Factor (approx. 0.95 kg CO2/kWh due to thermal mix).
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yearly Electricity Usage (kWh)
              </label>
              <input
                type="number"
                name="energyUsageKwH"
                min="0"
                value={formData.energyUsageKwH}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </section>

          {/* Waste */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Waste Management (Right Cycle Focus)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  General Landfill Waste (kg/year)
                </label>
                <input
                  type="number"
                  name="wasteGeneralKg"
                  min="0"
                  value={formData.wasteGeneralKg}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PPE Waste (Gloves, Masks, etc.) (kg/year)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="wastePPEKg"
                    min="0"
                    value={formData.wastePPEKg}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-emerald-300 bg-emerald-50 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  <span className="absolute right-3 top-2 text-xs text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">High Impact</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This is where "The Right Cycle" program can significantly reduce your footprint.
                </p>
              </div>
            </div>
          </section>

          {/* Transport */}
          <section>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              Transportation
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Fuel Consumption (Diesel/Petrol Litres/year)
              </label>
              <input
                type="number"
                name="transportFuelLitres"
                min="0"
                value={formData.transportFuelLitres}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
               Calculate Footprint
               <span className="bg-emerald-800 text-xs py-0.5 px-2 rounded-full">AI Powered</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};