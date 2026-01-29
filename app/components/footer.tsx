import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
              <Image
                src="/mitsors_logo1.png"
                alt="MITSORS Logo"
                width={38}
                height={38}
                className="h-8 w-8 rounded-lg"
              />
              <span>MITSORS</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Real-time livestock pricing you can trust. Track markets, compare
              regions, and make confident decisions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Product</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Live Prices</li>
                <li>Regional Insights</li>
                <li>Market Trends</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Support</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Submit Price</li>
                <li>Help Center</li>
                <li>Contact</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Legal</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} MITSORS. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-4">
            <span className="text-foreground font-semibold">
              Live pricing for every region.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
