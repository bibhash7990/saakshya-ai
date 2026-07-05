import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Globe, Search, ThumbsUp, Phone, Info, Award } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { aiService } from '@/services/ai.service';
import { Loader } from '@/components/ui/Loader';

interface LegalResource {
  title: string;
  category: 'legal_aid' | 'helpline' | 'portal' | 'ngo';
  description: string;
  url: string;
  phone?: string;
  state?: string;
  isFree: boolean;
  isAiGenerated?: boolean;
}

interface CaseStudy {
  id: string;
  title: string;
  caseType: string;
  summary: string;
  outcome: string;
  lessons: string[];
  upvotes: number;
}

export const CommunityPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  
  const [aiResources, setAiResources] = useState<LegalResource[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  const toast = useToast();

  const resources: LegalResource[] = [
    {
      title: 'National Legal Services Authority (NALSA)',
      category: 'legal_aid',
      description: 'Provides free legal services to eligible weaker sections of society and organizes Lok Adalats.',
      url: 'https://nalsa.gov.in',
      isFree: true,
    },
    {
      title: 'National Consumer Helpline (NCH)',
      category: 'helpline',
      description: 'Dial 1915 to lodge e-commerce, banking, or service disputes. Completely free grievance resolution.',
      url: 'https://consumerhelpline.gov.in',
      phone: '1915',
      isFree: true,
    },
    {
      title: 'National Cyber Crime Reporting Portal',
      category: 'portal',
      description: 'Official Indian cybercrime cell to report online banking scams, identity thefts, or social media fraud.',
      url: 'https://cybercrime.gov.in',
      phone: '1930',
      isFree: true,
    },
    {
      title: 'MSME SAMADHAAN Portal',
      category: 'portal',
      description: 'Allows micro, small, and medium enterprises to file disputes directly against buyers for delayed payments.',
      url: 'https://samadhaan.msme.gov.in',
      isFree: true,
    },
    {
      title: 'E-Daakhil Consumer Portal',
      category: 'portal',
      description: 'Allows digital filing of consumer complaints directly to state and national consumer dispute commissions.',
      url: 'https://edaakhil.nic.in',
      isFree: true,
    },
  ];

  const caseStudies: CaseStudy[] = [
    {
      id: 'cs-1',
      title: 'Recovered ₹40,000 rent deposit without court',
      caseType: 'Rental Dispute',
      summary: 'A tenant in Pune used SaakshyaAI to calculate SHA-256 hashes of threatening WhatsApp messages and rent receipts, then sent an AI-drafted Legal Notice.',
      outcome: 'The landlord refunded the entire deposit within 5 days of receiving the verified notice to avoid legal action.',
      lessons: ['Always request written confirmation of deposit paid', 'Send demand notices before suing'],
      upvotes: 42,
    },
    {
      id: 'cs-2',
      title: 'E-Commerce package scam refund',
      caseType: 'Online Fraud',
      summary: 'A shopper received stones instead of a tablet. They used live camera snapshots with verified timestamp overlays, logged IP details, and filed a cyber complaint.',
      outcome: 'The payment gateway froze the merchant account and processed a full refund to the buyer.',
      lessons: ['Record unboxing videos when opening expensive packages', 'File cyber complaints within the first 2 hours'],
      upvotes: 18,
    },
  ];

  const handleUpvote = (id: string) => {
    if (voted[id]) {
      toast.info('You have already upvoted this case study.');
      return;
    }
    setUpvotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setVoted((prev) => ({ ...prev, [id]: true }));
    toast.success('Thank you for upvoting!');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setAiResources([]);
      return;
    }
    
    setIsSearchingAI(true);
    toast.info('Searching globally via AI...');
    try {
      const results = await aiService.searchLegalResources(searchQuery);
      setAiResources(results);
    } catch (err) {
      toast.danger('Failed to fetch AI results');
    } finally {
      setIsSearchingAI(false);
    }
  };

  const filteredResources = [...resources, ...aiResources].filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || res.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <AppLayout title="Community & Legal Resources">
      <div className="flex flex-col gap-8 w-full pb-12 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Legal Directory & Success Stories</h1>
          <p className="text-xs font-semibold text-text-secondary mt-1">
            Access free Indian government claims portals and read anonymized deponent case files.
          </p>
        </div>

        {/* Directory Search toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <div className="flex flex-1 items-center gap-2 w-full">
            <Input
              type="text"
              placeholder="Search resources (e.g. consumer, cyber cell...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              leftIcon={<Search className="w-4 h-4" />}
              className="flex-1"
            />
            <Button variant="primary" onClick={handleSearch} isLoading={isSearchingAI}>
              Search
            </Button>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {['all', 'portal', 'helpline', 'legal_aid'].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize text-xs font-semibold"
              >
                {cat.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
          {/* Left panel: Resources list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <Globe className="w-5 h-5 text-primary-400" />
              <span>Verified Portals & Legal Aid</span>
            </h2>

            <div className="flex flex-col gap-4">
              {filteredResources.map((res, idx) => (
                <Card variant="solid" hoverEffect={false} key={idx} className="p-5 border border-border flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                      {res.title}
                      {res.isAiGenerated && (
                        <span className="text-[9px] bg-primary-500/10 text-primary-400 px-1.5 py-0.5 rounded border border-primary-500/20 uppercase tracking-wider">
                          AI FOUND
                        </span>
                      )}
                    </h3>
                    <Badge variant={res.category === 'portal' ? 'primary' : 'success'} size="sm">
                      {res.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{res.description}</p>
                  
                  <div className="flex justify-between items-center mt-2 pt-3 border-t border-border/50">
                    {res.phone ? (
                      <a href={`tel:${res.phone}`} className="flex items-center gap-1.5 text-xs text-accent-500 font-bold hover:underline">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call {res.phone}</span>
                      </a>
                    ) : (
                      <div />
                    )}

                    <a href={res.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" size="sm" className="text-xs">
                        Open Portal
                      </Button>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right panel: Case studies */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <Award className="w-5 h-5 text-accent-500" />
              <span>Deponent Success Stories</span>
            </h2>

            <div className="flex flex-col gap-4">
              {caseStudies.map((study) => {
                const totalUpvotes = study.upvotes + (upvotes[study.id] || 0);
                return (
                  <Card variant="solid" hoverEffect={false} key={study.id} className="p-5 border border-border flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="neutral" size="sm" className="text-[10px] font-mono">
                        {study.caseType}
                      </Badge>
                      <button
                        onClick={() => handleUpvote(study.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold font-mono px-2 py-1 rounded transition cursor-pointer select-none ${
                          voted[study.id]
                            ? 'text-primary-400 bg-primary-500/10 border border-primary-500/20'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-border'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{totalUpvotes}</span>
                      </button>
                    </div>

                    <h3 className="font-bold text-xs text-text-primary">{study.title}</h3>
                    <p className="text-[11px] text-text-secondary leading-relaxed">{study.summary}</p>
                    
                    <div className="bg-success/5 border border-success/15 rounded-lg p-3 text-[10px] leading-relaxed">
                      <strong className="text-success font-bold flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 flex-shrink-0" /> Outcome:
                      </strong>
                      <p className="text-text-secondary mt-1">{study.outcome}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
export default CommunityPage;
