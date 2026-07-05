import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { CaseGrid } from '@/components/dashboard/CaseGrid';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { AISuggestionsPanel } from '@/components/dashboard/AISuggestionsPanel';
import { CreateCaseModal } from '@/components/cases/CreateCaseModal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { useCases } from '@/hooks/useCases';
import { Loader } from '@/components/ui/Loader';

export const DashboardPage: React.FC = () => {
  const { cases, isLoading, fetchCases } = useCases();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <AppLayout title="My Case Vaults">
      <div className="flex flex-col gap-8 w-full pb-10">
        {/* Top Header & action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome to SaakshyaAI</h1>
            <p className="text-xs font-semibold text-text-secondary mt-1">
              Lock down digital evidence trails and keep them court-ready.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Vault Case
          </Button>
        </div>

        {isLoading && cases.length === 0 ? (
          <Loader text="Decrypting vaults..." />
        ) : (
          <>
            {/* Stats blocks */}
            <StatsOverview cases={cases} />

            {/* Main cases lists grid */}
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-bold text-text-primary select-none">Active Dispute Cases</h2>
              <CaseGrid cases={cases} onCreateClick={() => setCreateOpen(true)} />
            </div>

            {/* Bottom logs & suggestions panels */}
            {cases.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <RecentActivity />
                <AISuggestionsPanel />
              </div>
            )}
          </>
        )}

        {/* Modal for creating a new vault case */}
        <CreateCaseModal open={createOpen} onClose={() => setCreateOpen(false)} />
      </div>
    </AppLayout>
  );
};
export default DashboardPage;
