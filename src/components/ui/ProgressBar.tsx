interface ProgressBarProps {
  current: number;
  goal: number;
  className?: string;
}

export function ProgressBar({ current, goal, className = '' }: ProgressBarProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{current} GLM raised</span>
        <span>{goal} GLM goal</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-sm text-gray-600 mt-1">
        {percentage.toFixed(0)}%
      </div>
    </div>
  );
}

