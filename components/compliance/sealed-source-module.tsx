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

interface SealedSource {
  id: number;
  inventory_date: string;
  source_id: string;
  isotope: string;
  activity: number;
  location: string;
  condition: string;
  comments: string;
}

export default function SealedSourceModule() {
  const [sources, setSources] = useState<SealedSource[]>([]);
  const [formData, setFormData] = useState({
    inventory_date: new Date().toISOString().split('T')[0],
    source_id: '',
    isotope: '',
    activity: '',
    location: '',
    condition: 'Good',
    comments: ''
  });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/compliance/sealed-source');
      const data = await response.json();
      // Convert activity to number
      const processedData = data.map((source: any) => ({
        ...source,
        activity: parseFloat(source.activity)
      }));
      setSources(processedData);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/compliance/sealed-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          activity: parseFloat(formData.activity)
        })
      });
      if (response.ok) {
        fetchSources();
        setFormData({
          inventory_date: new Date().toISOString().split('T')[0],
          source_id: '',
          isotope: '',
          activity: '',
          location: '',
          condition: 'Good',
          comments: ''
        });
      }
    } catch (error) {
      console.error('Error submitting source:', error);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sources);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sealed Sources');
    XLSX.writeFile(wb, 'sealed_source_inventory.xlsx');
  };

  const isotopeOptions = [
    'Cs-137',
    'Co-57',
    'Ba-133',
    'Ge-68',
    'Am-241',
    'Sr-90',
    'Tc-99m',
    'I-131',
    'Ir-192',
    'Co-60'
  ];

  const locationOptions = [
    'Hot Lab Cabinet A',
    'Hot Lab Cabinet B',
    'QC Room Shelf A',
    'QC Room Shelf B',
    'Storage Room Safe',
    'Vault A',
    'Vault B',
    'Transport Container',
    'Calibration Stand',
    'Backup Storage'
  ];

  const conditionOptions = ['Good', 'Fair', 'Poor', 'Damaged'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sealed Source Inventory</CardTitle>
          <CardDescription>Manage and track sealed radioactive sources</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inventory_date">Inventory Date</Label>
                <Input
                  id="inventory_date"
                  type="date"
                  value={formData.inventory_date}
                  onChange={(e) => setFormData({ ...formData, inventory_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source_id">Source ID</Label>
                <Input
                  id="source_id"
                  value={formData.source_id}
                  onChange={(e) => setFormData({ ...formData, source_id: e.target.value })}
                  placeholder="CS-137-001"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isotope">Isotope</Label>
                <Select value={formData.isotope} onValueChange={(value) => setFormData({ ...formData, isotope: value })}>
                  <SelectTrigger id="isotope">
                    <SelectValue placeholder="Select isotope" />
                  </SelectTrigger>
                  <SelectContent>
                    {isotopeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity">Activity (mCi)</Label>
                <Input
                  id="activity"
                  type="number"
                  step="0.01"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
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

            <Button type="submit" className="bg-[#1a2332] hover:bg-[#0f1419]">
              Add to Inventory
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inventory Records</CardTitle>
          <Button onClick={exportToExcel} variant="outline" size="sm">
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          {sources.length === 0 ? (
            <p className="text-gray-500">No sources in inventory</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Source ID</TableHead>
                    <TableHead>Isotope</TableHead>
                    <TableHead>Activity (mCi)</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell>{source.inventory_date}</TableCell>
                      <TableCell>{source.source_id}</TableCell>
                      <TableCell>{source.isotope}</TableCell>
                      <TableCell>{source.activity.toFixed(2)}</TableCell>
                      <TableCell>{source.location}</TableCell>
                      <TableCell>
                        <Badge className={source.condition === 'Good' ? 'bg-green-600' : source.condition === 'Fair' ? 'bg-yellow-600' : 'bg-red-600'}>
                          {source.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>{source.comments}</TableCell>
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
