import { GoogleGenAI, Type } from "@google/genai";
import { CarbonInputData, CalculationResult, Recommendation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSustainabilityReport = async (
  data: CarbonInputData,
  result: CalculationResult
): Promise<Recommendation[]> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Act as a senior sustainability consultant for "Carbon Media", a Zimbabwean initiative inspired by Kimberly Clarke's Right Cycle program.
      
      Analyze the following carbon footprint data for a company in ${data.location}:
      - Company: ${data.companyName}
      - Energy Usage (ZESA/Grid): ${data.energyUsageKwH} kWh/year (CO2: ${result.energyCo2.toFixed(2)} tons)
      - General Waste: ${data.wasteGeneralKg} kg/year
      - PPE Waste (Gloves, Masks, Safety Gear): ${data.wastePPEKg} kg/year (Waste CO2: ${result.wasteCo2.toFixed(2)} tons)
      - Transport (Fuel): ${data.transportFuelLitres} Litres/year (Transport CO2: ${result.transportCo2.toFixed(2)} tons)
      
      Total Carbon Footprint: ${result.totalCo2.toFixed(2)} tons.
      
      Provide 4 specific, actionable recommendations to reduce this footprint. 
      Focus heavily on the "Right Cycle" concept: recycling PPE waste instead of sending it to landfills (e.g. Pomona landfill).
      Suggest local Zimbabwean context solutions where possible (e.g., solar alternatives due to load shedding, local recycling partners).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              category: { type: Type.STRING, enum: ["Energy", "Waste", "Transport", "General"] },
            },
            required: ["title", "description", "impact", "category"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as Recommendation[];
  } catch (error) {
    console.error("Failed to generate recommendations:", error);
    // Fallback recommendations if AI fails or no key
    return [
      {
        title: "Implement PPE Recycling (Right Cycle)",
        description: "Partner with specialized recyclers to turn used nitrile gloves and masks into eco-friendly pellets instead of dumping them.",
        impact: "High",
        category: "Waste"
      },
      {
        title: "Solar Grid Tie System",
        description: "Install solar panels to offset ZESA reliance, reducing scope 2 emissions and mitigating load shedding impact.",
        impact: "High",
        category: "Energy"
      },
      {
        title: "Route Optimization",
        description: "Use GPS tracking for your fleet to reduce fuel consumption on distribution routes around Harare and Bulawayo.",
        impact: "Medium",
        category: "Transport"
      }
    ];
  }
};