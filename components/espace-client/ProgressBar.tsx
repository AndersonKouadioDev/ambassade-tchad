interface ProgressBarProps {
  percent: number;
  steps: { label: string; completed: boolean }[];
  expectedDate?: string;
}

export default function ProgressBar({ percent, steps, expectedDate }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-semibold text-blue-900">Progression <span className="text-red-600">{percent} %</span></div>
        {expectedDate && (
          <div className="text-sm text-gray-500">Achèvement prévu<br /><span className="font-bold text-blue-900">{expectedDate}</span></div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step.completed ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300'}`}>{idx + 1}</div>
            {idx < steps.length - 1 && <div className={`h-1 flex-1 ${step.completed ? 'bg-blue-600' : 'bg-blue-200'}`}></div>}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {steps.map((step, idx) => (
          <span key={idx} className="w-20 text-center">{step.label}</span>
        ))}
      </div>
    </div>
  );
} 