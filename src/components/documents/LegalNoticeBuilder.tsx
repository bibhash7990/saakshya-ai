import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '@/hooks/useToast';
import { FileText, Printer, Sparkles, AlertCircle } from 'lucide-react';
import { aiService } from '@/services/ai.service';
import DOMPurify from 'dompurify';

interface LegalNoticeBuilderProps {
  caseTitle: string;
  caseDescription: string;
}

export const LegalNoticeBuilder: React.FC<LegalNoticeBuilderProps> = ({
  caseTitle,
  caseDescription,
}) => {
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [drafting, setDrafting] = useState(false);
  const [draftedNotice, setDraftedNotice] = useState<string | null>(null);

  const toast = useToast();

  const handleDraftNotice = async () => {
    if (!recipient.trim() || !address.trim()) {
      toast.warning('Please enter recipient details.');
      return;
    }
    setDrafting(true);
    setDraftedNotice(null);

    try {
      const prompt = `
        Draft a formal Demand Legal Notice in English under Indian laws.
        Sender: A citizen (Use deponent placeholder).
        Recipient Name: "${recipient}"
        Recipient Address: "${address}"
        Claim/Loss Amount: "${claimAmount || 'unspecified'}"
        Dispute Details: "${caseDescription}"
        
        FORMAT:
        - Date at the top
        - TO: Recipient details
        - SUBJECT: Demand Notice / Cease & Desist
        - BODY paragraphs referencing relevant laws (IPC, Rent Act, Contract Act)
        - DEMAND: Pay within 15 days to avoid legal action
        - SIGNATURE block.
      `;
      const result = await aiService.askLegalQuery(prompt);
      setDraftedNotice(result);
      toast.success('Legal Notice drafted by AI!');
    } catch (err) {
      toast.danger('Failed to draft legal notice.');
    } finally {
      setDrafting(false);
    }
  };

  const handlePrint = () => {
    if (!draftedNotice) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Legal Notice</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                body { background: white; color: black; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body class="bg-gray-100 py-10">
            <div class="no-print max-w-3xl mx-auto mb-4 flex justify-end">
              <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold shadow cursor-pointer">
                Print / Save PDF
              </button>
            </div>
            <div class="p-8 max-w-3xl mx-auto bg-white text-gray-900 border border-gray-300 font-serif leading-relaxed text-xs whitespace-pre-wrap">
              ${DOMPurify.sanitize(draftedNotice)}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {!draftedNotice ? (
        <Card variant="solid" hoverEffect={false} className="p-6 border border-border flex flex-col gap-5">
          <div className="flex flex-col gap-1 select-none">
            <h3 className="text-sm font-bold text-text-primary">Draft AI Legal Notice</h3>
            <p className="text-xs text-text-secondary">
              Fill in the details to draft a demand notice to the other party using AI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Recipient / Offending Party Name"
              placeholder="e.g. Landlord Rahul Verma"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
            <Input
              type="text"
              label="Claim / Disputed Amount (INR)"
              placeholder="e.g. 40,000"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
            />
          </div>
          <Input
            type="text"
            label="Recipient Complete Address"
            placeholder="e.g. Flat 302, Green Glen Layout, Bengaluru"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <Button
            variant="accent"
            onClick={handleDraftNotice}
            loading={drafting}
            className="w-full"
            leftIcon={<Sparkles className="w-4 h-4 text-accent-500" />}
          >
            Draft Notice with AI
          </Button>
        </Card>
      ) : (
        <Card variant="solid" hoverEffect={false} className="p-6 border border-border flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-border pb-3 select-none">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <FileText className="w-5 h-5 text-accent-500" />
              <span>AI Legal Notice drafted</span>
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setDraftedNotice(null)}>
                Edit Details
              </Button>
              <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
                Print / Save PDF
              </Button>
            </div>
          </div>

          {/* Render drafted Notice inside a paper wrapper */}
          <div className="p-1.5 bg-gray-200 border border-gray-300 rounded-xl overflow-hidden shadow-inner">
            <div className="bg-white rounded-lg p-6 max-h-[450px] overflow-y-auto">
              <pre className="text-xs text-gray-900 font-serif leading-relaxed whitespace-pre-wrap">
                {draftedNotice}
              </pre>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
export default LegalNoticeBuilder;
