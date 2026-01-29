'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import {
  getRegionOptions,
  getCityOptions,
} from '@/constants/philippine-locations';

// TASK A-2 & B-3 IMPORTS
import { useWizardStore } from '@/app/store/use-wizard-store';
import { wizardSchema } from '@/lib/validations/wizard';

interface WizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WizardModal({ open, onOpenChange }: WizardModalProps) {
  const router = useRouter();

  // Connect to Zustand Store
  const { step, data, setStep, updateData, completeWizard, reset } =
    useWizardStore();

  const totalSteps = 3;

  const regionOptions = useMemo(() => getRegionOptions(), []);
  const cityOptions = useMemo(() => getCityOptions(data.region), [data.region]);

  const toggleRole = (role: string) => {
    const currentRoles = data.userRoles;
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];
    updateData({ userRoles: newRoles });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // 1. Task A-4 & B-3: Persist to the single key 'mitsors-wizard-data'
    completeWizard();

    // 2. Remove the line below to stop creating 'mitsors_user_profile'
    // setAnonymousProfile(data);

    // 3. Navigate to dashboard as per Flow 1 specifications
    router.push('/dashboard');

    // 4. Reset Zustand store memory and close modal
    reset();
    onOpenChange(false);
  };

  // Task A-2: Strict Validation using Zod
  const canProceed = () => {
    try {
      if (step === 1) {
        wizardSchema.pick({ firstName: true, lastName: true }).parse(data);
      } else if (step === 2) {
        wizardSchema.pick({ region: true, city: true }).parse(data);
      } else if (step === 3) {
        wizardSchema.pick({ userRoles: true }).parse(data);
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0B0E14] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-500">
            Welcome to MITSORS
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Let's personalize your experience in just a few steps
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    s === step
                      ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : s < step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {s < step ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < totalSteps && (
                  <div
                    className={`mx-2 h-0.5 w-16 ${s < step ? 'bg-emerald-500' : 'bg-gray-800'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold">Tell us about you</h3>
                <p className="text-sm text-gray-400">
                  Names must be at least 2 characters.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-300">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    value={data.firstName}
                    onChange={(e) => updateData({ firstName: e.target.value })}
                    placeholder="Juan"
                    className="bg-[#1A1D23] border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-300">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    value={data.lastName}
                    onChange={(e) => updateData({ lastName: e.target.value })}
                    placeholder="Dela Cruz"
                    className="bg-[#1A1D23] border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <h3 className="text-lg font-semibold">
                  Where are you located?
                </h3>
                <p className="text-sm text-gray-400">
                  We’ll default prices to your area.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-300">Region</Label>
                  <Combobox
                    options={regionOptions}
                    value={data.region}
                    onValueChange={(value) => {
                      updateData({ region: value, city: '' });
                    }}
                    placeholder="Select region..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">City / Municipality</Label>
                  <Combobox
                    options={cityOptions}
                    value={data.city}
                    onValueChange={(value) => updateData({ city: value })}
                    placeholder={
                      data.region ? 'Select city...' : 'Choose region first'
                    }
                    disabled={!data.region}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Roles */}
          {step === 3 && (
            <div className="space-y-4 text-center animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Choose your roles</h3>
                <p className="text-sm text-gray-400">
                  Select all that apply to your business.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: 'hog_raiser', label: 'Pig Farmer' },
                  { value: 'trader', label: 'Buyer / Trader' },
                  { value: 'observer', label: 'Market Observer' },
                ].map((role) => {
                  const active = data.userRoles.includes(role.value);
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => toggleRole(role.value)}
                      className={`rounded-lg border px-4 py-3 text-xs font-semibold transition-all ${
                        active
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                          : 'border-gray-800 text-gray-400 hover:border-emerald-500/50'
                      }`}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>

              {/* Profile summary preview */}
              <div className="rounded-lg bg-gray-900/50 p-4 text-left text-xs border border-gray-800">
                <h4 className="mb-2 font-semibold text-emerald-500 uppercase tracking-wider">
                  Draft Profile
                </h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="text-gray-200">
                      {data.firstName || '—'} {data.lastName || ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="text-gray-200">{data.region || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Roles</span>
                    <span className="text-gray-200">
                      {data.userRoles.length ? data.userRoles.join(', ') : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-800">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]"
          >
            {step === totalSteps ? (
              <>
                Finish <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
