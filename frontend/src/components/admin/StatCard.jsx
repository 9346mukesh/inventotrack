import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const colorMap = {
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    icon: "text-indigo-600"
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: "text-emerald-600"
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    icon: "text-green-600"
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: "text-amber-600"
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: "text-red-600"
  },
  yellow: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    icon: "text-yellow-600"
  }
};

const StatCard = ({ title, value, icon, color = "indigo", change, trend }) => {
  const styles = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-6 rounded-xl border ${styles.border} bg-white hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${styles.bg} ${styles.icon}`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
            {change}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${styles.text}`}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;