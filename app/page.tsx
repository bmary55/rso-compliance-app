'use client';

import { useState, useEffect } from 'react';
import { MNKLogo } from '@/components/mnk-logo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DoseOrderingSection from '@/components/dose-ordering-section';
import RSOComplianceSection from '@/components/rso-compliance-section';

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize database on first load
    fetch('/api/init-db', { method: 'POST' })
      .then(() => setIsInitialized(true))
      .catch(console.error);
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MNKLogo />
            <h1 className="text-xl font-semibold text-foreground">
              RSO Compliance & Dose Ordering System
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dose-ordering" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="dose-ordering">Dose Ordering</TabsTrigger>
            <TabsTrigger value="rso-compliance">RSO Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="dose-ordering">
            <DoseOrderingSection />
          </TabsContent>

          <TabsContent value="rso-compliance">
            <RSOComplianceSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
