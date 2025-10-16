'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Patient {
  id: number;
  patient_name: string;
  patient_id: string;
  scan_type: string;
  duration: number;
  insurance: string;
  appointment_status: string;
  appointment_date: string;
}

export default function DoseOrderingSection() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmedPatients = patients.filter(p => p.appointment_status === 'Confirmed');

  const sortedConfirmedPatients = [...confirmedPatients].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
    }
    return a.patient_name.localeCompare(b.patient_name);
  });

  const getStatusBadge = (status: string) => {
    if (status === 'Confirmed') {
      return <Badge className="bg-green-600">Confirmed</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const getDoseInfo = (scanType: string) => {
    const doses: Record<string, { primary: { dose: string; vendor: string }; secondary: { dose: string; vendor: string; reason: string } }> = {
      'PET/CT': {
        primary: { dose: '10-15 mCi F-18 FDG', vendor: 'Cardinal Health' },
        secondary: { dose: '12 mCi F-18 FDG', vendor: 'Triad Isotopes', reason: 'Backup vendor with faster delivery time' }
      },
      'Bone Scan': {
        primary: { dose: '20-25 mCi Tc-99m MDP', vendor: 'GE Healthcare' },
        secondary: { dose: '22 mCi Tc-99m MDP', vendor: 'Cardinal Health', reason: 'Alternative vendor for supply redundancy' }
      },
      'Cardiac Stress': {
        primary: { dose: '25-30 mCi Tc-99m Sestamibi', vendor: 'Lantheus' },
        secondary: { dose: '28 mCi Tc-99m Sestamibi', vendor: 'GE Healthcare', reason: 'Cost-effective alternative with same quality' }
      },
      'Thyroid Scan': {
        primary: { dose: '5-10 mCi Tc-99m Pertechnetate', vendor: 'GE Healthcare' },
        secondary: { dose: '8 mCi Tc-99m Pertechnetate', vendor: 'Cardinal Health', reason: 'Secondary source for availability assurance' }
      },
      'Renal Scan': {
        primary: { dose: '10 mCi Tc-99m MAG3', vendor: 'Cardinal Health' },
        secondary: { dose: '10 mCi Tc-99m MAG3', vendor: 'GE Healthcare', reason: 'Backup vendor with reliable supply chain' }
      },
      'DaT Scan': {
        primary: { dose: '3-5 mCi I-123 Ioflupane', vendor: 'GE Healthcare' },
        secondary: { dose: '4 mCi I-123 Ioflupane', vendor: 'Jubilant DraxImage', reason: 'Alternative vendor for specialized tracer' }
      },
      'Amyloid PET': {
        primary: { dose: '10 mCi F-18 Florbetapir', vendor: 'Lantheus' },
        secondary: { dose: '10 mCi F-18 Florbetaben', vendor: 'GE Healthcare', reason: 'Different tracer formulation with similar efficacy' }
      },
      'Cardiac PET': {
        primary: { dose: '40-60 mCi Rb-82', vendor: 'Cardinal Health' },
        secondary: { dose: '10 mCi N-13 Ammonia', vendor: 'Triad Isotopes', reason: 'Alternative tracer for cardiac perfusion imaging' }
      },
      'PSMA PET': {
        primary: { dose: '5-8 mCi Ga-68 PSMA-11', vendor: 'Triad Isotopes' },
        secondary: { dose: '6 mCi F-18 PSMA-1007', vendor: 'Lantheus', reason: 'Longer half-life tracer for flexible scheduling' }
      },
    };
    return doses[scanType] || {
      primary: { dose: 'N/A', vendor: 'N/A' },
      secondary: { dose: 'N/A', vendor: 'N/A', reason: 'No secondary option available' }
    };
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Daily Orders</TabsTrigger>
          <TabsTrigger value="dashboard">Patient Dashboard</TabsTrigger>
          <TabsTrigger value="credits">Dose Credits</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daily Dose Orders</CardTitle>
                  <CardDescription>
                    {confirmedPatients.length} confirmed appointments ready for ordering
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value: 'date' | 'name') => setSortBy(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Appointment Date</SelectItem>
                      <SelectItem value="name">Patient Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">Cardinal Health</div>
                    <div className="text-2xl font-bold">{Math.floor(confirmedPatients.length * 0.4)}</div>
                    <div className="text-xs text-muted-foreground">doses ordered</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">GE Healthcare</div>
                    <div className="text-2xl font-bold">{Math.floor(confirmedPatients.length * 0.35)}</div>
                    <div className="text-xs text-muted-foreground">doses ordered</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-card">
                    <div className="text-sm text-muted-foreground">Lantheus</div>
                    <div className="text-2xl font-bold">{Math.floor(confirmedPatients.length * 0.25)}</div>
                    <div className="text-xs text-muted-foreground">doses ordered</div>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading orders...</div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Appt Date</TableHead>
                          <TableHead>Patient Name</TableHead>
                          <TableHead>Patient ID</TableHead>
                          <TableHead>Scan Type</TableHead>
                          <TableHead>Primary Dose</TableHead>
                          <TableHead>Vendor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Secondary Option</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedConfirmedPatients.map((patient) => {
                          const doseInfo = getDoseInfo(patient.scan_type);
                          return (
                            <TableRow key={patient.id}>
                              <TableCell>{new Date(patient.appointment_date).toLocaleDateString()}</TableCell>
                              <TableCell className="font-medium">{patient.patient_name}</TableCell>
                              <TableCell>{patient.patient_id}</TableCell>
                              <TableCell>{patient.scan_type}</TableCell>
                              <TableCell>{doseInfo.primary.dose}</TableCell>
                              <TableCell>{doseInfo.primary.vendor}</TableCell>
                              <TableCell>{getStatusBadge(patient.appointment_status)}</TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">View Secondary</Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Secondary Dose Option</DialogTitle>
                                      <DialogDescription>
                                        Alternative dose and vendor for {patient.patient_name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <div className="text-sm font-medium">Secondary Dose:</div>
                                        <div className="text-lg">{doseInfo.secondary.dose}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium">Secondary Vendor:</div>
                                        <div className="text-lg">{doseInfo.secondary.vendor}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium">Reason for Secondary:</div>
                                        <div className="text-sm text-muted-foreground">{doseInfo.secondary.reason}</div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Patient Dashboard</CardTitle>
              <CardDescription>All scheduled patients</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading patients...</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Scan Type</TableHead>
                        <TableHead>Duration (min)</TableHead>
                        <TableHead>Insurance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.patient_name}</TableCell>
                          <TableCell>{patient.patient_id}</TableCell>
                          <TableCell>{patient.scan_type}</TableCell>
                          <TableCell>{patient.duration}</TableCell>
                          <TableCell>{patient.insurance}</TableCell>
                          <TableCell>{getStatusBadge(patient.appointment_status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits">
          <Card>
            <CardHeader>
              <CardTitle>Dose Credit Tracker</CardTitle>
              <CardDescription>Auto-calculated credits from cancellations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No cancellations recorded</p>
                <p className="mt-2">Credits will appear here when doses are cancelled</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <VendorsTab />
        </TabsContent>

        <TabsContent value="insurance">
          <InsuranceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VendorsTab() {
  const vendors = [
    { name: 'Cardinal Health', term: '12 months', orderWindow: '24 hours', unitPrice: '$450' },
    { name: 'GE Healthcare', term: '12 months', orderWindow: '48 hours', unitPrice: '$425' },
    { name: 'Lantheus', term: '6 months', orderWindow: '24 hours', unitPrice: '$475' },
    { name: 'Triad Isotopes', term: '12 months', orderWindow: '36 hours', unitPrice: '$440' },
    { name: 'Jubilant DraxImage', term: '12 months', orderWindow: '48 hours', unitPrice: '$460' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Management</CardTitle>
        <CardDescription>Vendor contracts and pricing information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Contract Term</TableHead>
                <TableHead>Order Window</TableHead>
                <TableHead>Unit Price (per dose)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.term}</TableCell>
                  <TableCell>{vendor.orderWindow}</TableCell>
                  <TableCell>{vendor.unitPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function InsuranceTab() {
  const insurances = [
    { name: 'Blue Cross Blue Shield', reimbursement: '95%', avgProcessing: '14 days' },
    { name: 'Aetna', reimbursement: '92%', avgProcessing: '21 days' },
    { name: 'Medicare', reimbursement: '100%', avgProcessing: '30 days' },
    { name: 'United Healthcare', reimbursement: '90%', avgProcessing: '18 days' },
    { name: 'Cigna', reimbursement: '93%', avgProcessing: '16 days' },
    { name: 'Humana', reimbursement: '91%', avgProcessing: '20 days' },
    { name: 'Medicaid', reimbursement: '85%', avgProcessing: '45 days' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insurance Reimbursement</CardTitle>
        <CardDescription>Insurance provider reimbursement rates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Insurance Provider</TableHead>
                <TableHead>Reimbursement Rate</TableHead>
                <TableHead>Avg Processing Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insurances.map((insurance, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{insurance.name}</TableCell>
                  <TableCell>{insurance.reimbursement}</TableCell>
                  <TableCell>{insurance.avgProcessing}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
