import React from 'react';
import { Card } from '../ui/Card';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const AISuggestionsPanel: React.FC = () => {
  const navigate = useNavigate();

  // Mock suggestion items
  const suggestions = [
    {
      id: 'sug-1',
      title: 'Missing Landlord Response proof',
      desc: 'In the Rent Dispute case, you have uploaded a screenshot of your notice but not the landlord response or rejection text. Capture this to raise case score to 60+.',
      caseId: 'mock-case-1',
      severity: 'high',
    },
    {
      id: 'sug-2',
      title: 'Generate Section 65B Certificate',
      desc: 'You have 5 verified evidence items in the E-Commerce marketplace fraud case. Generate the certificate to make them court-ready.',
      caseId: 'mock-case-2',
      severity: 'medium',
    },
  ];

  return (
    <Card variant="solid" hoverEffect={false} className="p-6 flex flex-col gap-4 border border-border h-full relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2 text-primary-400 select-none">
        <Sparkles className="w-5 h-5 text-accent-500" />
        <h3 className="font-bold text-sm text-text-primary">AI Case Recommendations</h3>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {suggestions.map((sug) => (
          <div key={sug.id} className="p-4 rounded-lg bg-bg-primary/40 border border-border flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-4 h-4 ${sug.severity === 'high' ? 'text-danger' : 'text-warning'}`} />
              <h4 className="text-xs font-bold text-text-primary">{sug.title}</h4>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              {sug.desc}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/cases/${sug.caseId}`)}
              className="text-[10px] py-1 px-0 self-start text-primary-400 hover:text-primary-300 font-bold"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Address Recommendation
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default AISuggestionsPanel;
