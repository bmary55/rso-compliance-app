'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReseedPage() {
  const [status, setStatus] = useState('');

  const handleReseed = async () => {
    setStatus('Reseeding patient data...');
    try {
      const response = await fetch('/api/reseed', { method: 'POST' });
      const data = await response.json();
      setStatus('Patient data reseeded. Now seeding compliance data...');
      
      const complianceResponse = await fetch('/api/seed-compliance', { method: 'POST' });
      const complianceData = await complianceResponse.json();
      setStatus('All data reseeded successfully!');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      setStatus('Error: ' + error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Reseed Database</CardTitle>
          <CardDescription>Update patient and compliance data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleReseed}>Reseed All Data</Button>
          {status && <p className="mt-4">{status}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
