import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CarbonInputData, CalculationResult, Recommendation } from '../types';
import { generateSustainabilityReport } from '../services/geminiService';
import { Loader2, Leaf, AlertCircle, Download, Share2, X, Mail, Link as LinkIcon, Check, Facebook, Linkedin, Twitter, FileText } from 'lucide-react';

interface DashboardProps {
  inputData: CarbonInputData;
}

// Conversion Factors (Simplified for Dummy App)
// Zimbabwe Grid: ~0.95 kg CO2/kWh (High thermal reliance)
// Diesel/Petrol: ~2.7 kg CO2/Litre
// Waste: ~1.5 kg CO2/kg (Methane emissions from landfill)
const FACTORS = {
  energy: 0.00095, // tons per kWh
  transport: 0.0027, // tons per Litre
  waste: 0.0015, // tons per kg
};

export const Dashboard: React.FC<DashboardProps> = ({ inputData }) => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Calculate Results Locally
    const energyCo2 = inputData.energyUsageKwH * FACTORS.energy;
    const transportCo2 = inputData.transportFuelLitres * FACTORS.transport;
    const wasteCo2 = (inputData.wasteGeneralKg + inputData.wastePPEKg) * FACTORS.waste;
    const totalCo2 = energyCo2 + transportCo2 + wasteCo2;
    
    // Simple Score: Lower is better, normalized vaguely against a benchmark of 100 tons for a small SME
    const rawScore = Math.max(0, 100 - (totalCo2 / 50) * 50); 
    const score = Math.min(100, Math.round(rawScore));

    const calculatedResult = {
      energyCo2,
      transportCo2,
      wasteCo2,
      totalCo2,
      score,
    };
    
    setResult(calculatedResult);
    setLoadingAI(true);

    // 2. Fetch AI Recommendations
    generateSustainabilityReport(inputData, calculatedResult)
      .then(recs => {
        setRecommendations(recs);
      })
      .finally(() => {
        setLoadingAI(false);
      });
      
  }, [inputData]);

  const handleExportCSV = () => {
    if (!result) return;

    const headers = [
      "Company Name",
      "Location",
      "Energy Usage (kWh)",
      "General Waste (kg)",
      "PPE Waste (kg)",
      "Transport Fuel (Litres)",
      "Energy CO2 (tons)",
      "Waste CO2 (tons)",
      "Transport CO2 (tons)",
      "Total CO2 (tons)",
      "Sustainability Score"
    ];

    const row = [
      `"${inputData.companyName.replace(/"/g, '""')}"`,
      `"${inputData.location.replace(/"/g, '""')}"`,
      inputData.energyUsageKwH,
      inputData.wasteGeneralKg,
      inputData.wastePPEKg,
      inputData.transportFuelLitres,
      result.energyCo2.toFixed(4),
      result.wasteCo2.toFixed(4),
      result.transportCo2.toFixed(4),
      result.totalCo2.toFixed(4),
      result.score
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + row.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `carbon_report_${inputData.companyName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!result) return <div className="p-10 text-center">Calculating...</div>;

  const chartData = [
    { name: 'Energy (ZESA)', value: parseFloat(result.energyCo2.toFixed(2)), color: '#EAB308' },
    { name: 'Transport', value: parseFloat(result.transportCo2.toFixed(2)), color: '#3B82F6' },
    { name: 'Waste (Landfill)', value: parseFloat(result.wasteCo2.toFixed(2)), color: '#EF4444' },
  ];

  const wasteSplitData = [
    { name: 'General Waste', value: inputData.wasteGeneralKg, fill: '#94A3B8' },
    { name: 'PPE Waste', value: inputData.wastePPEKg, fill: '#10B981' },
  ];

  // Share content preparation
  const shareUrl = "https://carbonmedia.co.zw/report"; // Dummy URL for the demo
  const shareText = `Our company ${inputData.companyName} just calculated its carbon footprint with Carbon Media! Total Emissions: ${result.totalCo2.toFixed(2)} tons. Score: ${result.score}/100. #Sustainability #Zimbabwe`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 relative">
      
      {/* Header Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-8 border-emerald-500 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Carbon Footprint Analysis</h2>
          <p className="text-gray-500">For {inputData.companyName} - {inputData.location}</p>
        </div>
        <div className="flex gap-4 items-center">
            <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Emissions</p>
                <p className="text-4xl font-bold text-emerald-900">{result.totalCo2.toFixed(2)} <span className="text-lg text-gray-600 font-normal">tons CO₂e</span></p>
            </div>
            <div className={`rounded-full h-20 w-20 flex items-center justify-center border-4 ${result.score > 70 ? 'border-green-500 text-green-700' : result.score > 40 ? 'border-yellow-500 text-yellow-700' : 'border-red-500 text-red-700'} text-2xl font-bold`}>
                {result.score}
            </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Emission Sources */}
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Emission Sources Distribution</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value} tons`} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Waste Composition */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Right Cycle Opportunity: Waste Analysis</h3>
             <p className="text-sm text-gray-600 mb-4">
                Visualizing the proportion of PPE waste that can be diverted from landfills through the Right Cycle program.
             </p>
             <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wasteSplitData} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis type="number" unit=" kg" />
                         <YAxis dataKey="name" type="category" width={100} />
                         <Tooltip />
                         <Bar dataKey="value" barSize={40}>
                            {wasteSplitData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                         </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
             {inputData.wastePPEKg > 500 && (
                 <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                     <AlertCircle className="w-3 h-3"/> High Potential for Recycling
                 </div>
             )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl shadow-lg p-8 border border-emerald-100">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
                <Leaf className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900">Right Cycle Action Plan</h3>
                <p className="text-sm text-gray-500">AI-Generated Recommendations for {inputData.companyName}</p>
            </div>
        </div>

        {loadingAI ? (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
                <p className="text-gray-500">Analysing waste streams and energy patterns...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                rec.category === 'Waste' ? 'bg-red-100 text-red-700' :
                                rec.category === 'Energy' ? 'bg-yellow-100 text-yellow-700' :
                                rec.category === 'Transport' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {rec.category}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                rec.impact === 'High' ? 'text-emerald-600 bg-emerald-50' :
                                rec.impact === 'Medium' ? 'text-yellow-600 bg-yellow-50' :
                                'text-gray-500 bg-gray-50'
                            }`}>
                                {rec.impact} Impact
                            </span>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">{rec.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{rec.description}</p>
                    </div>
                ))}
            </div>
        )}

        <div className="mt-8 flex flex-wrap gap-4 justify-end">
            <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
            >
                <Share2 className="w-4 h-4" /> Share Report
            </button>
            <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
            >
                <FileText className="w-4 h-4" /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200">
                <Download className="w-4 h-4" /> Export PDF
            </button>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in-up">
                <button
                    onClick={() => setIsShareModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-1"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Impact</h3>
                <p className="text-sm text-gray-500 mb-6">Showcase your commitment to a carbon-neutral Zimbabwe.</p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-600 italic border border-gray-100">
                    "{shareText}"
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* Twitter */}
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Twitter className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-xs font-medium text-gray-600">Twitter</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                         href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-12 h-12 bg-[#0077b5] text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Linkedin className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-xs font-medium text-gray-600">LinkedIn</span>
                    </a>

                     {/* Facebook */}
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Facebook className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-xs font-medium text-gray-600">Facebook</span>
                    </a>

                     {/* Email */}
                    <a
                        href={`mailto:?subject=Our Carbon Footprint Report&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Mail className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-gray-600">Email</span>
                    </a>
                </div>

                <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
                    {copied ? "Copied to Clipboard" : "Copy Link"}
                </button>
            </div>
        </div>
      )}
    </div>
  );
};