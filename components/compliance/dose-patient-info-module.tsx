'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';

interface DosePatientRecord {
  id: number;
  patient_id: string;
  patient_name: string;
  dose_ordered: number;
  dose_delivered: number;
  scan_date: string;
  credit_due: number;
}

export default function DosePatientInfoModule() {
  const [records, setRecords] = useState<DosePatientRecord[]>([
    {
      id: 1,
      patient_id: 'PT001',
      patient_name: 'John Smith',
      dose_ordered: 10.0,
      dose_delivered: 9.8,
      scan_date: '2025-10-15',
      credit_due: 0.00
    }
  ]);
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_name: '',
    dose_ordered: '',
    dose_delivered: '',
    scan_date: new Date().toISOString().split('T')[0],
    credit_due: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DosePatientRecord = {
      id: records.length + 1,
      patient_id: formData.patient_id,
      patient_name: formData.patient_name,
      dose_ordered: parseFloat(formData.dose_ordered),
      dose_delivered: parseFloat(formData.dose_delivered),
      scan_date: formData.scan_date,
      credit_due: parseFloat(formData.credit_due)
    };
    setRecords([...records, newRecord]);
    setFormData({
      patient_id: '',
      patient_name: '',
      dose_ordered: '',
      dose_delivered: '',
      scan_date: new Date().toISOString().split('T')[0],
      credit_due: ''
    });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dose-Patient Info');
    XLSX.writeFile(wb, 'dose_patient_info.xlsx');
  };

  const doseOptions = [
    { value: '5.0', label: '5.0 mCi' },
    { value: '7.5', label: '7.5 mCi' },
    { value: '8.5', label: '8.5 mCi' },
    { value: '9.5', label: '9.5 mCi' },
    { value: '10.0', label: '10.0 mCi' },
    { value: '11.0', label: '11.0 mCi' },
    { value: '12.0', label: '12.0 mCi' },
    { value: '15.0', label: '15.0 mCi' },
    { value: '20.0', label: '20.0 mCi' },
    { value: '25.0', label: '25.0 mCi' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Dose Log</CardTitle>
          <CardDescription>Track doses ordered and delivered per patient</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient ID</Label>
                <Input
                  id="patient_id"
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  placeholder="PT001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient_name">Patient Name</Label>
                <Input
                  id="patient_name"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dose_ordered">Dose Ordered (mCi)</Label>
                <Select value={formData.dose_ordered} onValueChange={(value) => setFormData({ ...formData, dose_ordered: value })}>
                  <SelectTrigger id="dose_ordered">
                    <SelectValue placeholder="Select dose" />
                  </SelectTrigger>
                  <SelectContent>
                    {doseOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dose_delivered">Dose Delivered (mCi)</Label>
                <Select value={formData.dose_delivered} onValueChange={(value) => setFormData({ ...formData, dose_delivered: value })}>
                  <SelectTrigger id="dose_delivered">
                    <SelectValue placeholder="Select dose" />
                  </SelectTrigger>
                  <SelectContent>
                    {doseOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scan_date">Scan Date</Label>
                <Input
                  id="scan_date"
                  type="date"
                  value={formData.scan_date}
                  onChange={(e) => setFormData({ ...formData, scan_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit_due">Credit Due ($)</Label>
                <Input
                  id="credit_due"
                  type="number"
                  step="0.01"
                  value={formData.credit_due}
                  onChange={(e) => setFormData({ ...formData, credit_due: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submit Record
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dose-Patient Records</CardTitle>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-gray-500">No records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Dose Ordered (mCi)</TableHead>
                    <TableHead>Dose Delivered (mCi)</TableHead>
                    <TableHead>Credit Due ($)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.scan_date}</TableCell>
                      <TableCell>{record.patient_id}</TableCell>
                      <TableCell>{record.patient_name}</TableCell>
                      <TableCell>{parseFloat(String(record.dose_ordered)).toFixed(1)}</TableCell>
                      <TableCell>{parseFloat(String(record.dose_delivered)).toFixed(1)}</TableCell>
                      <TableCell>${parseFloat(String(record.credit_due)).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
