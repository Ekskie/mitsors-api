'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useGuestProfile } from '@/hooks/use-guest-profile';
import {
  getRegionOptions,
  getCityOptions,
  getRegionByCode,
} from '@/constants/philippine-locations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, User, Phone, AlertCircle, LogIn } from 'lucide-react';
import { AuthModal } from '@/app/components/auth-modal';

export function ProfileView() {
  const { user, isLoading: isApiLoading, updateProfile } = useUserProfile();
  const { data: guestProfile, saveProfile: saveGuestProfile } =
    useGuestProfile();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [isLocalProfile, setIsLocalProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    region: '',
    city: '', // Standardized to 'city'
  });

  // Strategy: Prefer API user, fallback to Guest Profile
  useEffect(() => {
    if (user && (user.firstName || user.lastName)) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        region: user.region || '',
        city: user.municipality || '', // Map API municipality to local 'city'
      });
      setIsLocalProfile(false);
    } else if (guestProfile) {
      setFormData({
        firstName: guestProfile.firstName || '',
        lastName: guestProfile.lastName || '',
        phone: guestProfile.phone || '',
        region: guestProfile.region || '',
        city: guestProfile.city || '',
      });
      setIsLocalProfile(true);
    }
  }, [user, guestProfile]);

  const regionOptions = useMemo(() => getRegionOptions(), []);

  const cityOptions = useMemo(() => {
    if (!formData.region) return [];
    return getCityOptions(formData.region);
  }, [formData.region]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (type: 'region' | 'city', value: string) => {
    setFormData((prev) => {
      const updates: any = { [type]: value };
      if (type === 'region') {
        updates.city = '';
      }
      return { ...prev, ...updates };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isLocalProfile) {
        // --- Save to Local Storage ---
        saveGuestProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          region: formData.region,
          city: formData.city,
          updatedAt: new Date().toISOString(),
        });

        if (toast && toast.success) {
          toast.success('Local Profile Updated: Changes saved to this device.');
        }
      } else {
        // --- Save to API ---
        await updateProfile({
          ...formData,
          municipality: formData.city, // Map back to API field
        });

        // Update local preference for dashboard views
        const regionObj = getRegionByCode(formData.region);
        if (formData.region && formData.city) {
          localStorage.setItem(
            'user_location_preference',
            JSON.stringify({
              region: regionObj?.name,
              regionCode: formData.region,
              municipality: formData.city,
              city: formData.city,
            }),
          );
        }

        if (toast && toast.success) {
          toast.success('Profile Updated Successfully.');
        }
      }
    } catch (error) {
      if (toast && toast.error) {
        toast.error('Update Failed.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isApiLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {isLocalProfile && (
        <div className="relative w-full rounded-lg border border-primary/50 bg-primary/5 px-4 py-3 text-sm">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-4 w-4 mt-0.5 text-foreground" />
            <div className="flex-1">
              <h5 className="mb-1 font-medium leading-none tracking-tight">
                Guest Profile
              </h5>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-muted-foreground mt-2">
                <span>Stored locally. Clear cache to delete.</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-background"
                >
                  <LogIn className="mr-2 h-3 w-3" />
                  Connect Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Manage your contact details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    className="pl-9"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    className="pl-9"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  className="pl-9"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location Settings</Label>
              <div className="rounded-md border p-4 bg-muted/50 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Region</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(val) =>
                        handleLocationChange('region', val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regionOptions.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">City / Municipality</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(val) => handleLocationChange('city', val)}
                      disabled={!formData.region}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cityOptions.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No cities available
                          </SelectItem>
                        ) : (
                          cityOptions.map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving
                  ? 'Saving...'
                  : isLocalProfile
                    ? 'Save to Device'
                    : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* UPDATED PROPS: open/onOpenChange */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        defaultTab="register"
      />
    </div>
  );
}
