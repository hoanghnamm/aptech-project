import React, { useState } from 'react';
import { nutritionService } from '../services/nutrition.service';

const NutritionAssistant = () => {
  const [formData, setFormData] = useState({
    breedName: '',
    ageMonths: '',
    weightKg: '',
    size: 'medium',
    activityLevel: 'medium',
    lifeStage: 'adult',
    goal: 'maintain',
    climate: 'normal'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call API through pre-configured service
      const data = await nutritionService.recommendNutrition(formData);
      setResult(data);
    } catch (err) {
      alert("Unable to retrieve nutrition advice. Please try again!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">PawIntel Nutrition Assistant</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Dog Breed</label>
          <input 
            type="text" placeholder="e.g., Husky, Poodle..." 
            className="input-text w-full p-2 border rounded"
            onChange={(e) => setFormData({...formData, breedName: e.target.value})} 
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Weight (kg)</label>
          <input 
            type="number" placeholder="Weight" 
            className="input-text w-full p-2 border rounded"
            onChange={(e) => setFormData({...formData, weightKg: e.target.value})} 
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Age (Months)</label>
          <input 
            type="number" placeholder="Age in months" 
            className="input-text w-full p-2 border rounded"
            onChange={(e) => setFormData({...formData, ageMonths: e.target.value})} 
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Life Stage</label>
          <select 
            className="input-text w-full p-2 border rounded"
            onChange={(e) => setFormData({...formData, lifeStage: e.target.value})}
          >
            <option value="puppy">Puppy</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="md:col-span-2 btn-primary mt-4 py-3 text-lg font-semibold disabled:bg-gray-400"
        >
          {loading ? 'Analyzing data...' : 'Get Nutrition Consultation'}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6 animate-fade-in">
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
            <h3 className="font-bold text-xl text-orange-800">Plan for: {result.breed?.breedName || "Your Pet"}</h3>
            <p className="text-orange-700">{result.recommendation.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center shadow-sm">
              <span className="block text-sm text-blue-600 uppercase font-bold">Energy/Day</span>
              <span className="text-2xl font-black text-blue-900">{result.recommendation.caloriesPerDay} kcal</span>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center shadow-sm">
              <span className="block text-sm text-green-600 uppercase font-bold">Meal Count</span>
              <span className="text-2xl font-black text-green-900">{result.recommendation.mealsPerDay} meals</span>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center shadow-sm">
              <span className="block text-sm text-purple-600 uppercase font-bold">AI Confidence</span>
              <span className="text-2xl font-black text-purple-900">{(result.recommendation.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-green-700 flex items-center gap-2">✅ Recommended Foods</h4>
              <ul className="list-disc list-inside text-gray-700 bg-gray-50 p-3 rounded">
                {result.recommendation.recommendedFoods.map((food, i) => <li key={i}>{food}</li>)}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-red-700 flex items-center gap-2">❌ Foods to Avoid</h4>
              <ul className="list-disc list-inside text-gray-700 bg-gray-50 p-3 rounded">
                {result.recommendation.avoidFoods.map((food, i) => <li key={i}>{food}</li>)}
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-bold mb-2">🕒 Suggested Feeding Schedule:</h4>
            <div className="flex flex-wrap gap-2">
              {result.recommendation.feedingSchedule.map((time, i) => (
                <span key={i} className="bg-white px-3 py-1 rounded shadow-sm border border-gray-200">{time}</span>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-600 italic">*{result.recommendation.portionGuidance}</p>
          </div>

          {result.recommendation.warningFlags.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              <strong>⚠️ Important Notes:</strong>
              <ul className="mt-1 list-disc list-inside">
                {result.recommendation.warningFlags.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NutritionAssistant;
