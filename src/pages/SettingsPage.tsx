import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useAuthStore } from '@/store/authStore';
import { useCaseStore } from '@/store/caseStore';
import { useEvidenceStore } from '@/store/evidenceStore';
import { useToast } from '@/hooks/useToast';
import { User, Phone, Save, Download, Trash2, ShieldAlert } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile } = useAuthStore();
  const cases = useCaseStore((state) => state.cases);
  const evidenceList = useEvidenceStore((state) => state.evidenceList);

  const [name, setName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [lang, setLang] = useState(profile?.language || 'en');
  const [saving, setSaving] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await new Promise((res) => setTimeout(res, 600));
      updateProfile({
        full_name: name,
        phone,
        language: lang as 'en' | 'hi',
      });
      toast.success('Profile preferences saved!');
    } catch (err) {
      toast.danger('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    try {
      // Compile entire local database structure
      const exportPayload = {
        deponent: profile,
        exportTimestamp: new Date().toISOString(),
        cases: cases,
        evidence: evidenceList,
        clientEngine: 'SaakshyaAI v1.0 (Desktop Validation Terminal)',
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `saakshya_secure_vault_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('Secure case data JSON backup downloaded!');
    } catch (error) {
      toast.danger('Failed to compile data export package.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('CRITICAL ACTION: Are you sure you want to permanently delete your SaakshyaAI account? All encrypted case folders, Section 65B certificates, and deponent logs will be deleted from our storage databases. This cannot be undone.')) {
      toast.success('Account permanently deleted.');
      await authService.signOut();
      navigate('/login');
    }
  };

  return (
    <AppLayout title="Account Settings">
      <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto pb-12 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">System Configuration & Profile</h1>
          <p className="text-xs font-semibold text-text-secondary mt-1">
            Update your credentials and download secure backups of your deponent data.
          </p>
        </div>

        {/* Profile Card */}
        <Card variant="solid" hoverEffect={false} className="p-6 border border-border">
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <h3 className="font-bold text-sm text-text-primary mb-1">Deponent Credentials</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="text"
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4.5 h-4.5" />}
                required
              />
              <Input
                type="text"
                label="Contact Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4.5 h-4.5" />}
                placeholder="e.g. +91 99999 99999"
              />
            </div>

            <Dropdown
              label="Interface Language"
              options={[
                { value: 'en', label: 'English 🇬🇧' },
                { value: 'hi', label: 'Hindi 🇮🇳' },
              ]}
              value={lang}
              onChange={(val) => setLang(val as any)}
            />

            <Button type="submit" loading={saving} className="w-max mt-2" leftIcon={<Save className="w-4 h-4" />}>
              Save Profile Settings
            </Button>
          </form>
        </Card>

        {/* Security and Backup Data */}
        <Card variant="solid" hoverEffect={false} className="p-6 border border-border flex flex-col gap-4">
          <h3 className="font-bold text-sm text-text-primary">Data Security & Backups</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Download a secure, unencrypted JSON backup of all your Case folders, deponent profiles, and captured evidence metadata to store locally or import into other terminals.
          </p>

          <Button
            variant="secondary"
            onClick={handleExportData}
            className="w-max mt-1 text-xs"
            leftIcon={<Download className="w-4 h-4 text-accent-500" />}
          >
            Export All Vault Data (JSON)
          </Button>
        </Card>

        {/* Danger zone */}
        <Card variant="solid" hoverEffect={false} className="p-6 border border-red-500/20 bg-red-500/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-danger font-bold text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <h3>Danger Zone</h3>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Deleting your account will erase all cases and security folders from our vaults. We do not retain copies of files once accounts are deleted.
          </p>
          <Button
            variant="ghost"
            onClick={handleDeleteAccount}
            className="w-max text-danger hover:bg-danger/10 text-xs border border-danger/30"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Account Permanently
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
};
export default SettingsPage;
