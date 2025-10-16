'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DailySurveysModule from './compliance/daily-surveys-module';
import SealedSourceModule from './compliance/sealed-source-module';
import TracerCheckoutModule from './compliance/tracer-checkout-module';
import DosePatientInfoModule from './compliance/dose-patient-info-module';
import QCCalibratorModule from './compliance/qc-calibrator-module';
import DosimeterTrackerModule from './compliance/dosimeter-tracker-module';

const moduleInfo = {
  'daily-surveys': {
    title: 'Daily Area Surveys',
    description: 'Record daily radiation readings for monitored areas'
  },
  'sealed-source': {
    title: 'Sealed Source Inventory',
    description: 'Manage and track sealed radioactive sources'
  },
  'tracer-checkout': {
    title: 'Tracer Checkout',
    description: 'Track tracer check-in and check-out times'
  },
  'dose-patient': {
    title: 'Patient Dose Log',
    description: 'Track doses ordered and delivered per patient'
  },
  'qc-calibrator': {
    title: 'QC on Calibrator',
    description: 'Quality control tests on dose calibrators'
  },
  'dosimeter': {
    title: 'Dosimeter Tracker',
    description: 'Employee radiation exposure tracking'
  }
};

export default function RSOComplianceSection() {
  const [activeTab, setActiveTab] = useState('daily-surveys');
  const currentModule = moduleInfo[activeTab as keyof typeof moduleInfo];

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <Card>
        <CardHeader>
          <CardTitle>{currentModule.title}</CardTitle>
          <CardDescription>{currentModule.description}</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto gap-1 p-1">
          <TabsTrigger value="daily-surveys" className="text-sm font-medium py-2">Daily Surveys</TabsTrigger>
          <TabsTrigger value="sealed-source" className="text-sm font-medium py-2">Sealed Source</TabsTrigger>
          <TabsTrigger value="tracer-checkout" className="text-sm font-medium py-2">Tracer Checkout</TabsTrigger>
          <TabsTrigger value="dose-patient" className="text-sm font-medium py-2">Dose-Patient</TabsTrigger>
          <TabsTrigger value="qc-calibrator" className="text-sm font-medium py-2">QC Calibrator</TabsTrigger>
          <TabsTrigger value="dosimeter" className="text-sm font-medium py-2">Dosimeter</TabsTrigger>
        </TabsList>

        <TabsContent value="daily-surveys">
          <DailySurveysModule />
        </TabsContent>

        <TabsContent value="sealed-source">
          <SealedSourceModule />
        </TabsContent>

        <TabsContent value="tracer-checkout">
          <TracerCheckoutModule />
        </TabsContent>

        <TabsContent value="dose-patient">
          <DosePatientInfoModule />
        </TabsContent>

        <TabsContent value="qc-calibrator">
          <QCCalibratorModule />
        </TabsContent>

        <TabsContent value="dosimeter">
          <DosimeterTrackerModule />
        </TabsContent>
      </Tabs>
    </div>
  );
}
