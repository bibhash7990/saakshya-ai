import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Evidence } from '@/types/evidence.types';
import { useToast } from '@/hooks/useToast';
import { ShieldCheck, Printer, Download, UserCheck } from 'lucide-react';
import { formatDateLegible } from '@/utils/formatters';
import DOMPurify from 'dompurify';
import { documentsService } from '@/services/documents.service';

interface Section65BGeneratorProps {
  caseTitle: string;
  evidenceList: Evidence[];
}

export const Section65BGenerator: React.FC<Section65BGeneratorProps> = ({
  caseTitle,
  evidenceList,
}) => {
  const [selectedEvIds, setSelectedEvIds] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);

  const toast = useToast();

  const handleToggleSelect = (id: string) => {
    setSelectedEvIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!name.trim()) {
      toast.warning('Please enter your full name.');
      return;
    }
    if (selectedEvIds.length === 0) {
      toast.warning('Please select at least one evidence item to certify.');
      return;
    }

    const selectedEvidence = evidenceList.filter((e) => selectedEvIds.includes(e.id));
    
    const docHtml = documentsService.generateSection65BHtml(name, role, caseTitle, selectedEvidence);

    setGeneratedDoc(docHtml);
    toast.success('Section 65B Certificate generated!');
  };

  const handlePrint = () => {
    if (!generatedDoc) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Section 65B Certificate</title>
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
            ${generatedDoc}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {!generatedDoc ? (
        <Card variant="solid" hoverEffect={false} className="p-6 border border-border flex flex-col gap-5">
          <div className="flex flex-col gap-1 select-none">
            <h3 className="text-sm font-bold text-text-primary">Generate Section 65B Certificate</h3>
            <p className="text-xs text-text-secondary">
              Select the evidence items you want to certify under the Indian Evidence Act / BSA.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Your Full Name"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="text"
              label="Your Designation / Role"
              placeholder="e.g. Tenant, Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {/* Evidence selection checklist */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-text-secondary select-none">
              Select evidence items:
            </span>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto scrollbar-thin">
              {evidenceList.map((e) => {
                const isSelected = selectedEvIds.includes(e.id);
                return (
                  <div
                    key={e.id}
                    onClick={() => handleToggleSelect(e.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer select-none transition ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/5'
                        : 'border-border bg-bg-primary/20 hover:border-border-hover'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="rounded border-border text-primary-500 focus:ring-primary-500"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-text-primary">{e.title}</span>
                      <span className="text-[10px] text-text-muted font-mono truncate max-w-[280px]">
                        Hash: {e.sha256_hash.substring(0, 16)}...
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            variant="accent"
            onClick={handleGenerate}
            disabled={selectedEvIds.length === 0}
            className="w-full"
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Digital Sign & Generate
          </Button>
        </Card>
      ) : (
        <Card variant="solid" hoverEffect={false} className="p-6 border border-border flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-border pb-3 select-none">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-success" />
              <span>Certificate Ready</span>
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setGeneratedDoc(null)}>
                Edit Details
              </Button>
              <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
                Print / Save PDF
              </Button>
            </div>
          </div>

          {/* Render Document inside a styled paper wrapper */}
          <div className="p-1.5 bg-gray-200 border border-gray-300 rounded-xl overflow-hidden shadow-inner">
            <div
              className="bg-white rounded-lg p-6 max-h-[450px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(generatedDoc) }}
            />
          </div>
        </Card>
      )}
    </div>
  );
};
export default Section65BGenerator;
