import React from 'react';
import { clsx } from 'clsx';
import { CaseType } from '@/types/case.types';

interface CaseTypeSelectorProps {
  value: CaseType;
  onChange: (value: CaseType) => void;
}

export const CaseTypeSelector: React.FC<CaseTypeSelectorProps> = ({ value, onChange }) => {
  const types: { value: CaseType; label: string; icon: string }[] = [
    { value: 'rental_dispute', label: 'Rent Dispute', icon: '🏘️' },
    { value: 'online_fraud', label: 'Online Fraud', icon: '📱' },
    { value: 'workplace_harassment', label: 'Workplace Issue', icon: '💼' },
    { value: 'consumer_complaint', label: 'Consumer Fraud', icon: '🛒' },
    { value: 'medical_negligence', label: 'Medical Negligence', icon: '🏥' },
    { value: 'property_dispute', label: 'Property Dispute', icon: '🏚️' },
    { value: 'non_payment', label: 'Unpaid Wages', icon: '🏦' },
    { value: 'cyber_crime', label: 'Cyber Crime', icon: '🚨' },
    { value: 'domestic_issue', label: 'Domestic Issue', icon: '🏡' },
    { value: 'other', label: 'Other Dispute', icon: '⚖️' },
  ];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-text-secondary select-none">
        Dispute Category
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
        {types.map((type) => {
          const isSelected = type.value === value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange(type.value)}
              className={clsx(
                'flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer select-none gap-2 active:scale-95',
                isSelected
                  ? 'border-primary-500 bg-primary-500/10 text-primary-400 font-bold shadow-sm'
                  : 'border-border bg-bg-secondary/40 text-text-secondary hover:text-text-primary hover:border-border-hover'
              )}
            >
              <span className="text-xl">{type.icon}</span>
              <span className="text-[10px] tracking-wide line-clamp-1">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default CaseTypeSelector;
