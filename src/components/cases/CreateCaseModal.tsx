import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CaseTypeSelector } from './CaseTypeSelector';
import { useCases } from '@/hooks/useCases';
import { useToast } from '@/hooks/useToast';
import { CaseType } from '@/types/case.types';

const caseTypes: [CaseType, ...CaseType[]] = [
  'rental_dispute',
  'online_fraud',
  'workplace_harassment',
  'consumer_complaint',
  'medical_negligence',
  'property_dispute',
  'non_payment',
  'cyber_crime',
  'domestic_issue',
  'other',
];

const createCaseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long').regex(/^[^<>]+$/, 'Title contains invalid characters'),
  description: z.string().max(1000, 'Description is too long').regex(/^[^<>]*$/, 'Description contains invalid characters').optional(),
  caseType: z.enum(caseTypes),
  tagsString: z.string().regex(/^[^<>]*$/, 'Tags contain invalid characters').optional(),
});

type CreateCaseFormData = z.infer<typeof createCaseSchema>;

interface CreateCaseModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ open, onClose }) => {
  const { createCase, submitting } = useCases();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateCaseFormData>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      caseType: 'other',
      tagsString: '',
    },
  });

  const selectedCaseType = watch('caseType');

  const onSubmit = async (data: CreateCaseFormData) => {
    const tags = (data.tagsString || '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const result = await createCase(data.title, data.description || '', data.caseType, tags);
    if (result.error) {
      toast.danger(result.error);
    } else {
      toast.success('Evidence Vault Case created!');
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Evidence Vault Case"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} loading={submitting}>
            Create Case
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-1">
        <Input
          type="text"
          label="Case Vault Title"
          placeholder="e.g. Security Deposit dispute with Landlord Rahul"
          {...register('title')}
          error={errors.title?.message}
          disabled={submitting}
        />

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold text-text-secondary select-none font-medium">
            Case Description / Narrative Summary
          </label>
          <textarea
            placeholder="Summarize the core dispute, incident dates, and what you are trying to prove..."
            {...register('description')}
            disabled={submitting}
            className="w-full bg-bg-secondary text-text-primary border border-border focus:border-primary-500 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 h-24 resize-none transition-all"
          />
          {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
        </div>

        <CaseTypeSelector
          value={selectedCaseType}
          onChange={(val) => setValue('caseType', val, { shouldValidate: true })}
        />
        {errors.caseType && <p className="text-xs text-danger">{errors.caseType.message}</p>}

        <Input
          type="text"
          label="Tags (Comma separated)"
          placeholder="e.g. landlord, threat, security_deposit"
          {...register('tagsString')}
          error={errors.tagsString?.message}
          disabled={submitting}
          helperText="Helps filter and classify legal notice drafting blocks later."
        />
      </form>
    </Modal>
  );
};
export default CreateCaseModal;
