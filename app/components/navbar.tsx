'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { Menu, X, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthModal } from './auth-modal';
import { WizardModal } from './wizard-modal';
import { useToast } from '@/hooks/use-toast';
import { useGuestProfile } from '@/hooks/use-guest-profile';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const pathname = usePathname();
  const { toast } = useToast();
  // Task B-3: Use centralized hook instead of manual localStorage
  const { data: guestProfile } = useGuestProfile();

  const isActive = (path: string) => pathname === path;

  const handleDashboardClick = (e: React.MouseEvent) => {
    // Guard: Check if user has guest profile data
    // We check localStorage directly here to avoid hook synchronization issues during the interaction
    const hasLocalData =
      typeof window !== 'undefined' &&
      localStorage.getItem('mitsors-wizard-data');

    if (!guestProfile && !hasLocalData) {
      e.preventDefault();
      setIsWizardOpen(true);

      // Safe toast call
      if (toast && toast.info) {
        toast.info(
          'Setup Required: Please check prices first to initialize your dashboard.',
        );
      }
    }

    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      href: '/',
      label: 'Home',
      onClick: () => setMobileMenuOpen(false),
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      onClick: handleDashboardClick,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="px-2 sm:px-3">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Left: Logo + Brand Name + Navigation */}
          <div className="flex items-center gap-6 ml-3">
            {/* Logo & Brand */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg shrink-0 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <Image
                src="/mitsors_logo1.png"
                alt="MITSORS Logo"
                width={38}
                height={38}
                className="h-10 w-10 bg-transparent"
              />
              <span className="hidden sm:inline">MITSORS</span>
            </Link>

            {/* Navigation Items (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    'text-base font-medium transition-colors whitespace-nowrap',
                    isActive(item.href)
                      ? 'text-emerald-600'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-0 shrink-0">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Login Button - Wired to Modal*/}
            <Button
              variant="ghost"
              onClick={() => setIsAuthModalOpen(true)}
              size="default"
              className="cursor-pointer flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-4 py-2 mr-3"
              title="Login"
            >
              <LogIn className="h-5 w-5" />
              <span className="font-medium">Login</span>
            </Button>

            {/* Corrected Props: open/onOpenChange */}
            <AuthModal
              open={isAuthModalOpen}
              onOpenChange={setIsAuthModalOpen}
            />

            {/* Render the WizardModal for Dashboard Guard */}
            <WizardModal open={isWizardOpen} onOpenChange={setIsWizardOpen} />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'text-foreground hover:bg-muted',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
