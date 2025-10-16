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

interface DailySurvey {
  id: number;
  survey_date: string;
  technologist: string;
  area: string;
  radiation_reading: number;
  actions: string;
  status: string;
}

export default function DailySurveysModule() {
  const [surveys, setSurveys] = useState<DailySurvey[]>([]);
  const [formData, setFormData] = useState({
    survey_date: new Date().toISOString().split('T')[0],
    technologist: '',
    area: '',
    radiation_reading: '',
    actions: '',
    status: 'Normal'
  });

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/compliance/daily-surveys');
      const data = await response.json();
      // Convert radiation_reading to number
      const processedData = data.map((survey: any) => ({
        ...survey,
        radiation_reading: parseFloat(survey.radiation_reading)
      }));
      setSurveys(processedData);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/compliance/daily-surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          radiation_reading: parseFloat(formData.radiation_reading)
        })
      });
      if (response.ok) {
        fetchSurveys();
        setFormData({
          survey_date: new Date().toISOString().split('T')[0],
          technologist: '',
          area: '',
          radiation_reading: '',
          actions: '',
          status: 'Normal'
        });
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  const getStatusBadge = (status: string, reading: number) => {
    if (reading < 0.5) return <Badge className="bg-green-600">Normal</Badge>;
    if (reading < 1.0) return <Badge className="bg-yellow-600">Caution</Badge>;
    return <Badge className="bg-red-600">Alert</Badge>;
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(surveys);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Surveys');
    XLSX.writeFile(wb, 'daily_area_surveys.xlsx');
  };

  const areaOptions = [
    'Hot Lab',
    'Injection Room',
    'Scan Room 1',
    'Scan Room 2',
    'Scan Room 3',
    'QC Room',
    'Storage Room',
    'Waiting Area',
    'Hallway',
    'Restroom'
  ];

  const actionOptions = [
    'None required',
    'Decontamination performed',
    'Area restricted',
    'Equipment checked',
    'Maintenance scheduled'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Area Survey</CardTitle>
          <CardDescription>Record daily radiation readings for monitored areas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="survey_date">Survey Date</Label>
                <Input
                  id="survey_date"
                  type="date"
                  value={formData.survey_date}
                  onChange={(e) => setFormData({ ...formData, survey_date: e.target.value })}
                  required
                />
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Select value={formData.area} onValueChange={(value) => setFormData({ ...formData, area: value })}>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areaOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="radiation_reading">Radiation Reading (mR/hr)</Label>
                <Input
                  id="radiation_reading"
                  type="number"
                  step="0.01"
                  value={formData.radiation_reading}
                  onChange={(e) => setFormData({ ...formData, radiation_reading: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actions">Actions</Label>
                <Select value={formData.actions} onValueChange={(value) => setFormData({ ...formData, actions: value })}>
                  <SelectTrigger id="actions">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Caution">Caution</SelectItem>
                    <SelectItem value="Alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submit Survey
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Survey Records</CardTitle>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          {surveys.length === 0 ? (
            <p className="text-gray-500">No surveys yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Technologist</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Reading (mR/hr)</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell>{survey.survey_date}</TableCell>
                      <TableCell>{survey.technologist}</TableCell>
                      <TableCell>{survey.area}</TableCell>
                      <TableCell>{survey.radiation_reading.toFixed(2)}</TableCell>
                      <TableCell>{survey.actions}</TableCell>
                      <TableCell>{getStatusBadge(survey.status, survey.radiation_reading)}</TableCell>
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
