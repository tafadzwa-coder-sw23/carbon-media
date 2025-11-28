import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Calculator } from './components/Calculator';
import { Dashboard } from './components/Dashboard';
import { CarbonInputData } from './types';

// Dummy preset to ensure "dummy data on every page" look even before calculation
const DEMO_DATA: CarbonInputData = {
  companyName: 'Matabeleland Textiles',
  location: 'Bulawayo, Zimbabwe',
  energyUsageKwH: 25000,
  wasteGeneralKg: 8000,
  wastePPEKg: 3500,
  transportFuelLitres: 12000,
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [inputData, setInputData] = useState<CarbonInputData | null>(null);

  const handleCalculate = (data: CarbonInputData) => {
    setInputData(data);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStart={() => setCurrentPage('calculator')} />;
      case 'calculator':
        return (
          <div className="py-12 bg-gray-50 min-h-[calc(100vh-64px)]">
             <Calculator onCalculate={handleCalculate} initialData={inputData || undefined} />
          </div>
        );
      case 'dashboard':
        return (
          <div className="py-12 bg-gray-50 min-h-[calc(100vh-64px)]">
            <Dashboard inputData={inputData || DEMO_DATA} />
          </div>
        );
      case 'about':
        return (
             <div className="max-w-4xl mx-auto p-8 text-center py-20">
                <h2 className="text-3xl font-bold text-emerald-900 mb-4">About Carbon Media</h2>
                <p className="text-gray-600 mb-6">
                    Carbon Media is a concept application developed to demonstrate how the principles of the Right Cycle program can be digitized. 
                    Operating out of Harare, our goal is to streamline sustainability reporting for Zimbabwean industries.
                </p>
                <div className="bg-emerald-100 p-6 rounded-lg inline-block text-left">
                    <h3 className="font-bold text-emerald-800 mb-2">Dummy Data Disclosure</h3>
                    <p className="text-sm text-emerald-700">
                        This application is currently running in demonstration mode. All calculations are approximations based on general emission factors 
                        and should not be used for official auditing without verification.
                    </p>
                </div>
            </div>
        );
      default:
        return <Home onStart={() => setCurrentPage('calculator')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="mb-2">&copy; 2024 Carbon Media Zimbabwe. All rights reserved.</p>
            <p className="text-sm">Envisioning a clean, carbon-neutral future.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;