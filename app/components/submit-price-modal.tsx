'use client';

import * as React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useSubmitPrice } from '@/hooks/use-submit-price';
import { useToast } from '@/hooks/use-toast';
import {
  getRegionOptions,
  getCityOptions,
} from '@/constants/philippine-locations';
import {
  getLivestockTypeOptions,
  getPigBreedOptions,
} from '@/constants/livestock-data';

const formSchema = z.object({
  region: z.string().min(1, 'Region is required'),
  city: z.string().min(1, 'City is required'),
  pricePerKg: z.coerce
    .number()
    .min(50, 'Minimum is 50 PHP')
    .max(500, 'Maximum is 500 PHP'),
  livestockType: z.string().min(1, 'Livestock type is required'),
  breed: z.string().max(100, 'Max 100 characters').optional().or(z.literal('')),
  notes: z
    .string()
    .max(500, 'Max 500 characters')
    .refine(
      (val: string | undefined) => {
        if (!val || val.length === 0) return true;
        return val.length >= 10;
      },
      { message: 'Notes must be at least 10 characters if provided' },
    )
    .optional()
    .or(z.literal('')),
  dateObserved: z
    .string()
    .optional()
    .refine(
      (val: string | undefined) => {
        if (!val) return true;
        const today = new Date();
        const d = new Date(val);
        d.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return d <= today;
      },
      { message: 'Date cannot be in the future' },
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function SubmitPriceModal() {
  const [open, setOpen] = React.useState(false);
  const { data: profile } = useUserProfile();
  const { toast } = useToast();
  const submitPrice = useSubmitPrice();
  const [selectedRegion, setSelectedRegion] = React.useState<string>('');

  const regionOptions = React.useMemo(() => getRegionOptions(), []);
  const cityOptions = React.useMemo(
    () => getCityOptions(selectedRegion),
    [selectedRegion],
  );
  const livestockTypeOptions = React.useMemo(
    () => getLivestockTypeOptions(),
    [],
  );
  const breedOptions = React.useMemo(() => getPigBreedOptions(), []);

  const defaultValues = React.useMemo<FormValues>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return {
      region: '',
      city: '',
      pricePerKg: 50,
      livestockType: '',
      breed: '',
      notes: '',
      dateObserved: `${yyyy}-${mm}-${dd}`,
    };
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues,
    mode: 'onSubmit',
  });

  React.useEffect(() => {
    if (open) {
      form.reset(defaultValues);
      setSelectedRegion('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await submitPrice.mutateAsync({
        region: values.region,
        city: values.city,
        pricePerKg: Number(values.pricePerKg),
        livestockType: values.livestockType as any,
        breed: values.breed ? values.breed : undefined,
        notes: values.notes ? values.notes : undefined,
        dateObserved: values.dateObserved,
      });
      toast.success('Price submitted!');
      setOpen(false);
      form.reset(defaultValues);
    } catch (e: any) {
      toast.error(e?.message || 'Submission failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
          Submit Price
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Liveweight Price</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField<FormValues>
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Combobox
                        options={regionOptions}
                        value={String(field.value || '')}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedRegion(value);
                          // Reset city when region changes
                          form.setValue('city', '');
                        }}
                        placeholder="Select or type region..."
                        emptyMessage="No region found."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<FormValues>
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City / Municipality</FormLabel>
                    <FormControl>
                      <Combobox
                        options={cityOptions}
                        value={String(field.value || '')}
                        onValueChange={field.onChange}
                        placeholder="Select or type city/municipality..."
                        emptyMessage={
                          selectedRegion
                            ? 'No city found.'
                            : 'Please select a region first.'
                        }
                        disabled={!selectedRegion}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField<FormValues>
                control={form.control}
                name="pricePerKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (PHP/kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={50}
                        max={500}
                        placeholder="e.g. 185.50"
                        {...field}
                        onChange={(e) => {
                          // Allow user to type freely, including erasing
                          field.onChange(e.target.value);
                        }}
                        onBlur={(e) => {
                          // Validate only after user finishes typing
                          const value = parseFloat(e.target.value);
                          if (e.target.value !== '' && value < 50) {
                            field.onChange(50);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<FormValues>
                control={form.control}
                name="livestockType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Livestock Type</FormLabel>
                    <FormControl>
                      <Combobox
                        options={livestockTypeOptions}
                        value={String(field.value || '')}
                        onValueChange={field.onChange}
                        placeholder="Select or type livestock type..."
                        emptyMessage="No livestock type found."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField<FormValues>
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed (optional)</FormLabel>
                    <FormControl>
                      <Combobox
                        options={breedOptions}
                        value={String(field.value || '')}
                        onValueChange={field.onChange}
                        placeholder="Select or type breed..."
                        emptyMessage="No breed found."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<FormValues>
                control={form.control}
                name="dateObserved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Observed</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField<FormValues>
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Additional context (min 10 characters if provided)"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground text-right">
                    {String(field.value || '').length}/500 characters
                    {field.value &&
                      String(field.value).length > 0 &&
                      String(field.value).length < 10 && (
                        <span className="text-destructive ml-2">
                          Min 10 characters required
                        </span>
                      )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitPrice.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitPrice.isPending}>
                {submitPrice.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
