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

interface QCCalibrator {
  id: number;
  qc_date: string;
  calibrator_id: string;
  technologist: string;
  test_type: string;
  result: string;
  comments: string;
}

export default function QCCalibratorModule() {
  const [records, setRecords] = useState<QCCalibrator[]>([]);
  const [formData, setFormData] = useState({
    qc_date: new Date().toISOString().split('T')[0],
    calibrator_id: '',
    technologist: '',
    test_type: '',
    result: 'Pass',
    comments: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/compliance/qc-calibrator');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/compliance/qc-calibrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchRecords();
        setFormData({
          qc_date: new Date().toISOString().split('T')[0],
          calibrator_id: '',
          technologist: '',
          test_type: '',
          result: 'Pass',
          comments: ''
        });
      }
    } catch (error) {
      console.error('Error submitting record:', error);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'QC Calibrator');
    XLSX.writeFile(wb, 'qc_calibrator.xlsx');
  };

  const testTypeOptions = [
    'Constancy',
    'Accuracy',
    'Linearity',
    'Geometry',
    'Dose Rate',
    'Timer Accuracy',
    'Exposure Rate',
    'Calibration Factor',
    'Background',
    'Repeatability'
  ];

  const resultOptions = ['Pass', 'Warning', 'Fail'];

  const calibratorOptions = ['CAL-001', 'CAL-002', 'CAL-003', 'CAL-004'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>QC on Calibrator</CardTitle>
          <CardDescription>Quality control tests on dose calibrators</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qc_date">Date</Label>
                <Input
                  id="qc_date"
                  type="date"
                  value={formData.qc_date}
                  onChange={(e) => setFormData({ ...formData, qc_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calibrator_id">Calibrator ID</Label>
                <Select value={formData.calibrator_id} onValueChange={(value) => setFormData({ ...formData, calibrator_id: value })}>
                  <SelectTrigger id="calibrator_id">
                    <SelectValue placeholder="Select calibrator" />
                  </SelectTrigger>
                  <SelectContent>
                    {calibratorOptions.map((cal) => (
                      <SelectItem key={cal} value={cal}>
                        {cal}
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
                <Label htmlFor="test_type">Test Type</Label>
                <Select value={formData.test_type} onValueChange={(value) => setFormData({ ...formData, test_type: value })}>
                  <SelectTrigger id="test_type">
                    <SelectValue placeholder="Select test" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypeOptions.map((test) => (
                      <SelectItem key={test} value={test}>
                        {test}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <Select value={formData.result} onValueChange={(value) => setFormData({ ...formData, result: value })}>
                  <SelectTrigger id="result">
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    {resultOptions.map((result) => (
                      <SelectItem key={result} value={result}>
                        {result}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Input
                id="comments"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Optional comments"
              />
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submit QC Record
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>QC Records</CardTitle>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-gray-500">No QC records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Calibrator ID</TableHead>
                    <TableHead>Technologist</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.qc_date}</TableCell>
                      <TableCell>{record.calibrator_id}</TableCell>
                      <TableCell>{record.technologist}</TableCell>
                      <TableCell>{record.test_type}</TableCell>
                      <TableCell>
                        <Badge className={record.result === 'Pass' ? 'bg-green-600' : record.result === 'Warning' ? 'bg-yellow-600' : 'bg-red-600'}>
                          {record.result}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.comments}</TableCell>
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
