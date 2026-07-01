import { useState } from "react";
import useNutrition from "../../hooks/useNutrition";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import Input from "../common/Input";
import Select from "../common/Select";
import Loader from "../common/Loader";
import NutritionHistory from "./NutritionHistory";
import NutritionResult from "./NutritionResult";

const initialForm = {
  breedId: "",
  ageMonths: "",
  weightKg: "",
  size: "medium",
  activityLevel: "medium",
  lifeStage: "adult",
  goal: "maintain",
  climate: "temperate",
  allergies: "",
  healthIssues: "",
  mealCountPreference: "",
};

const sizeOptions = ["toy", "small", "medium", "large", "giant"];
const activityOptions = ["low", "medium", "high"];
const lifeStageOptions = ["puppy", "adult", "senior"];
const goalOptions = ["maintain", "gain", "lose"];
const climateOptions = ["hot", "cold", "temperate", "humid"];

function toArray(value) {
  if (!value || !value.trim()) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function NutritionForm() {
  const [form, setForm] = useState(initialForm);
  const { loading, error, result, meta, submitNutrition, reset } = useNutrition();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      breedId: form.breedId.trim(),
      ageMonths: Number(form.ageMonths),
      weightKg: Number(form.weightKg),
      size: form.size,
      activityLevel: form.activityLevel,
      lifeStage: form.lifeStage,
      goal: form.goal,
      climate: form.climate,
      allergies: toArray(form.allergies),
      healthIssues: toArray(form.healthIssues),
      mealCountPreference: form.mealCountPreference
        ? Number(form.mealCountPreference)
        : undefined,
    };

    await submitNutrition(payload);
  };

  const handleReset = () => {
    setForm(initialForm);
    reset();
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Dog Information</h3>
        <p className="mt-1 text-sm text-slate-500">
          Nhập dữ liệu chó để backend tính calories và Groq hoàn thiện plan.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Input
            label="Breed ID"
            name="breedId"
            value={form.breedId}
            onChange={handleChange}
            placeholder="MongoDB Breed ObjectId"
            required
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Age (months)"
              name="ageMonths"
              type="number"
              min="1"
              max="240"
              value={form.ageMonths}
              onChange={handleChange}
              required
            />
            <Input
              label="Weight (kg)"
              name="weightKg"
              type="number"
              min="0.5"
              step="0.1"
              value={form.weightKg}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Size"
              name="size"
              value={form.size}
              onChange={handleChange}
              options={sizeOptions}
            />
            <Select
              label="Activity Level"
              name="activityLevel"
              value={form.activityLevel}
              onChange={handleChange}
              options={activityOptions}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Life Stage"
              name="lifeStage"
              value={form.lifeStage}
              onChange={handleChange}
              options={lifeStageOptions}
            />
            <Select
              label="Goal"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              options={goalOptions}
            />
          </div>

          <Select
            label="Climate"
            name="climate"
            value={form.climate}
            onChange={handleChange}
            options={climateOptions}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Allergies
            </label>
            <textarea
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              rows={3}
              placeholder="chicken, beef, dairy"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Health Issues
            </label>
            <textarea
              name="healthIssues"
              value={form.healthIssues}
              onChange={handleChange}
              rows={3}
              placeholder="sensitive stomach, obesity"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
            />
          </div>

          <Input
            label="Meal Count Preference"
            name="mealCountPreference"
            type="number"
            min="1"
            max="6"
            value={form.mealCountPreference}
            onChange={handleChange}
            placeholder="Optional"
          />

          <ErrorMessage message={error} />

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Get Recommendation"}
            </Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {loading && <Loader />}
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Recommendation Result
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Kết quả từ backend sẽ hiển thị ở đây sau khi submit.
        </p>

        <div className="mt-5">
          {!result && !loading && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
              Chưa có kết quả. Điền form rồi bấm <span className="font-semibold">Get Recommendation</span>.
            </div>
          )}

          {result && <NutritionResult result={result} />}

          {meta && <NutritionHistory meta={meta} />}
        </div>
      </div>
    </div>
  );
}