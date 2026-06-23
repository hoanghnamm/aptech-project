import { Sparkles } from "lucide-react";
import Card from "../common/Card";

export default function NutritionCard({ onClick }) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <Card className="p-6 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Sparkles className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900">
              AI Nutrition Recommendation
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Click để mở form nhập thông tin chó và nhận gợi ý dinh dưỡng cá nhân hóa.
            </p>
            <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Open nutrition form
            </div>
          </div>
        </div>
      </Card>
    </button>
  );
}