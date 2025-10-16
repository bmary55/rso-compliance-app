'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';

interface DosimeterRecord {
  id: number;
  tracking_date: string;
  employee_name: string;
  badge_id: string;
  exposure: number;
  monthly_total: number;
  quarterly_total: number;
  yearly_total: number;
  status: string;
}

export default function DosimeterTrackerModule() {
  const [records, setRecords] = useState<DosimeterRecord[]>([]);
  const [formData, setFormData] = useState({
    tracking_date: new Date().toISOString().split('T')[0],
    employee_name: '',
    badge_id: '',
    exposure: '',
    monthly_total: '',
    quarterly_total: '',
    yearly_total: '',
    status: 'Normal'
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/compliance/dosimeter-tracker');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/compliance/dosimeter-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchRecords();
        setFormData({
          tracking_date: new Date().toISOString().split('T')[0],
          employee_name: '',
          badge_id: '',
          exposure: '',
          monthly_total: '',
          quarterly_total: '',
          yearly_total: '',
          status: 'Normal'
        });
      }
    } catch (error) {
      console.error('Error submitting record:', error);
    }
  };

  const getStatusBadge = (yearlyTotal: number) => {
    // Assuming 5000 mrem/year is the limit
    if (yearlyTotal < 3000) return <Badge className="bg-green-600">Normal</Badge>;
    if (yearlyTotal < 4500) return <Badge className="bg-yellow-600">Caution</Badge>;
    return <Badge className="bg-red-600">Alert</Badge>;
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dosimeter Tracker');
    XLSX.writeFile(wb, 'dosimeter_tracker.xlsx');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dosimeter Tracker</CardTitle>
          <CardDescription>Track employee radiation exposure via dosimeter badges</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tracking_date">Date</Label>
                <Input
                  id="tracking_date"
                  type="date"
                  value={formData.tracking_date}
                  onChange={(e) => setFormData({ ...formData, tracking_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee_name">Employee Name</Label>
                <Input
                  id="employee_name"
                  value={formData.employee_name}
                  onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badge_id">Badge ID</Label>
                <Input
                  id="badge_id"
                  value={formData.badge_id}
                  onChange={(e) => setFormData({ ...formData, badge_id: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exposure">Exposure (mrem)</Label>
                <Input
                  id="exposure"
                  type="number"
                  step="0.01"
                  value={formData.exposure}
                  onChange={(e) => setFormData({ ...formData, exposure: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_total">Monthly Total (mrem)</Label>
                <Input
                  id="monthly_total"
                  type="number"
                  step="0.01"
                  value={formData.monthly_total}
                  onChange={(e) => setFormData({ ...formData, monthly_total: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quarterly_total">Quarterly Total (mrem)</Label>
                <Input
                  id="quarterly_total"
                  type="number"
                  step="0.01"
                  value={formData.quarterly_total}
                  onChange={(e) => setFormData({ ...formData, quarterly_total: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearly_total">Yearly Total (mrem)</Label>
                <Input
                  id="yearly_total"
                  type="number"
                  step="0.01"
                  value={formData.yearly_total}
                  onChange={(e) => {
                    const yearly = parseFloat(e.target.value);
                    let status = 'Normal';
                    if (yearly >= 4500) status = 'Alert';
                    else if (yearly >= 3000) status = 'Caution';
                    setFormData({ ...formData, yearly_total: e.target.value, status });
                  }}
                />
              </div>
            </div>
            <Button type="submit">Submit Record</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Dosimeter Records</CardTitle>
            <Button onClick={exportToExcel} variant="outline">Export to Excel</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Badge ID</TableHead>
                  <TableHead>Exposure</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Quarterly</TableHead>
                  <TableHead>Yearly</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No dosimeter records yet
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{new Date(record.tracking_date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.employee_name}</TableCell>
                      <TableCell>{record.badge_id}</TableCell>
                      <TableCell>{record.exposure} mrem</TableCell>
                      <TableCell>{record.monthly_total ? `${record.monthly_total} mrem` : '-'}</TableCell>
                      <TableCell>{record.quarterly_total ? `${record.quarterly_total} mrem` : '-'}</TableCell>
                      <TableCell>{record.yearly_total ? `${record.yearly_total} mrem` : '-'}</TableCell>
                      <TableCell>{getStatusBadge(record.yearly_total)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
