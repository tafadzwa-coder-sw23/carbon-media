export interface CarbonInputData {
  energyUsageKwH: number;
  wasteGeneralKg: number;
  wastePPEKg: number; // Specific for Right Cycle focus
  transportFuelLitres: number;
  companyName: string;
  location: string;
}

export interface CalculationResult {
  energyCo2: number;
  wasteCo2: number;
  transportCo2: number;
  totalCo2: number;
  score: number; // 0-100 sustainability score
}

export interface Recommendation {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Energy' | 'Waste' | 'Transport' | 'General';
}
