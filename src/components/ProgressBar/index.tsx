interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'orange' | 'red';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export default function ProgressBar({ value, max = 100, color = 'blue', showLabel = false, size = 'md' }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">进度</span>
          <span className="text-gray-900 font-medium">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <div
          className={`${colorMap[color]} ${sizeMap[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
