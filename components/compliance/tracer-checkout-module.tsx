'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import * as XLSX from 'xlsx';

interface TracerCheckout {
  id: number;
  checkout_date: string;
  tracer_type: string;
  technologist: string;
  check_out_time: string;
  check_in_time: string;
  patient_id: string;
  status: string;
}

export default function TracerCheckoutModule() {
  const [checkouts, setCheckouts] = useState<TracerCheckout[]>([]);
  const [formData, setFormData] = useState({
    checkout_date: new Date().toISOString().split('T')[0],
    tracer_type: '',
    technologist: '',
    check_out_time: '',
    check_in_time: '',
    patient_id: '',
    status: 'Checked Out'
  });

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const fetchCheckouts = async () => {
    try {
      const response = await fetch('/api/compliance/tracer-checkout');
      const data = await response.json();
      setCheckouts(data);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/compliance/tracer-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchCheckouts();
        setFormData({
          checkout_date: new Date().toISOString().split('T')[0],
          tracer_type: '',
          technologist: '',
          check_out_time: '',
          check_in_time: '',
          patient_id: '',
          status: 'Checked Out'
        });
      }
    } catch (error) {
      console.error('Error submitting checkout:', error);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(checkouts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tracer Checkout');
    XLSX.writeFile(wb, 'tracer_checkout.xlsx');
  };

  const tracerOptions = [
    'F-18 FDG',
    'Tc-99m MDP',
    'Tc-99m Sestamibi',
    'I-123 Ioflupane',
    'I-131 Sodium Iodide',
    'Tl-201 Thallous Chloride',
    'Ga-67 Citrate',
    'In-111 Pentetreotide',
    'F-18 Florbetapir',
    'Rb-82 Rubidium'
  ];

  const statusOptions = ['Checked Out', 'Checked In', 'In Transit', 'Delayed'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tracer Checkout</CardTitle>
          <CardDescription>Track tracer check-in and check-out times</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkout_date">Date</Label>
                <Input
                  id="checkout_date"
                  type="date"
                  value={formData.checkout_date}
                  onChange={(e) => setFormData({ ...formData, checkout_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tracer_type">Tracer Type</Label>
                <Select value={formData.tracer_type} onValueChange={(value) => setFormData({ ...formData, tracer_type: value })}>
                  <SelectTrigger id="tracer_type">
                    <SelectValue placeholder="Select tracer" />
                  </SelectTrigger>
                  <SelectContent>
                    {tracerOptions.map((tracer) => (
                      <SelectItem key={tracer} value={tracer}>
                        {tracer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="technologist">Technologist</Label>
                <Input
                  id="technologist"
                  value={formData.technologist}
                  onChange={(e) => setFormData({ ...formData, technologist: e.target.value })}
                  placeholder="Name"
                  required
                />
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check_out_time">Check Out Time</Label>
                <Input
                  id="check_out_time"
                  type="time"
                  value={formData.check_out_time}
                  onChange={(e) => setFormData({ ...formData, check_out_time: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="check_in_time">Check In Time</Label>
                <Input
                  id="check_in_time"
                  type="time"
                  value={formData.check_in_time}
                  onChange={(e) => setFormData({ ...formData, check_in_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="bg-[#1a2332] hover:bg-[#0f1419]">
              Record Checkout
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Checkout Records</CardTitle>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          {checkouts.length === 0 ? (
            <p className="text-gray-500">No checkout records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Tracer Type</TableHead>
                    <TableHead>Technologist</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkouts.map((checkout) => (
                    <TableRow key={checkout.id}>
                      <TableCell>{checkout.checkout_date}</TableCell>
                      <TableCell>{checkout.tracer_type}</TableCell>
                      <TableCell>{checkout.technologist}</TableCell>
                      <TableCell>{checkout.check_out_time}</TableCell>
                      <TableCell>{checkout.check_in_time}</TableCell>
                      <TableCell>{checkout.patient_id}</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-600">{checkout.status}</Badge>
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
