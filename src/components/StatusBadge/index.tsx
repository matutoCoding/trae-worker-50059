interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
}

const variantMap = {
  success: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  danger: 'bg-red-100 text-red-700 border-red-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};

const sizeMap = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
};

export default function StatusBadge({ status, variant = 'default', size = 'sm' }: StatusBadgeProps) {
  return (
    <span className={`inline-block rounded border font-medium ${variantMap[variant]} ${sizeMap[size]}`}>
      {status}
    </span>
  );
}
