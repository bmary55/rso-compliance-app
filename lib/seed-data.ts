import pool from './db';

export async function seedSampleData() {
  const client = await pool.connect();
  try {
    // Check if data already exists
    const result = await client.query('SELECT COUNT(*) FROM patients');
    if (parseInt(result.rows[0].count) > 0) {
      console.log('Sample data already exists');
      return;
    }

    // Insert 30 sample patients with more scan types
    const patients = [
      { name: 'John Smith', id: 'PT001', scan: 'PET/CT', duration: 60, insurance: 'Blue Cross', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Mary Johnson', id: 'PT002', scan: 'Bone Scan', duration: 45, insurance: 'Aetna', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Robert Williams', id: 'PT003', scan: 'Cardiac Stress', duration: 90, insurance: 'Medicare', status: 'Pending', date: '2025-10-17' },
      { name: 'Patricia Brown', id: 'PT004', scan: 'PET/CT', duration: 60, insurance: 'United Healthcare', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Michael Jones', id: 'PT005', scan: 'Thyroid Scan', duration: 30, insurance: 'Cigna', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Linda Garcia', id: 'PT006', scan: 'DaT Scan', duration: 90, insurance: 'Blue Cross', status: 'Confirmed', date: '2025-10-16' },
      { name: 'David Miller', id: 'PT007', scan: 'Bone Scan', duration: 45, insurance: 'Aetna', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Barbara Davis', id: 'PT008', scan: 'Renal Scan', duration: 120, insurance: 'Medicare', status: 'Pending', date: '2025-10-18' },
      { name: 'William Rodriguez', id: 'PT009', scan: 'Amyloid PET', duration: 75, insurance: 'United Healthcare', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Elizabeth Martinez', id: 'PT010', scan: 'Cardiac PET', duration: 90, insurance: 'Cigna', status: 'Confirmed', date: '2025-10-17' },
      { name: 'James Hernandez', id: 'PT011', scan: 'PET/CT', duration: 60, insurance: 'Blue Cross', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Jennifer Lopez', id: 'PT012', scan: 'PSMA PET', duration: 75, insurance: 'Aetna', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Charles Gonzalez', id: 'PT013', scan: 'Thyroid Scan', duration: 30, insurance: 'Medicare', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Susan Wilson', id: 'PT014', scan: 'PET/CT', duration: 60, insurance: 'United Healthcare', status: 'Pending', date: '2025-10-18' },
      { name: 'Joseph Anderson', id: 'PT015', scan: 'Cardiac Stress', duration: 90, insurance: 'Cigna', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Sarah Thomas', id: 'PT016', scan: 'DaT Scan', duration: 90, insurance: 'Blue Cross', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Thomas Taylor', id: 'PT017', scan: 'Bone Scan', duration: 45, insurance: 'Aetna', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Karen Moore', id: 'PT018', scan: 'Renal Scan', duration: 120, insurance: 'Medicare', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Christopher Jackson', id: 'PT019', scan: 'Amyloid PET', duration: 75, insurance: 'United Healthcare', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Nancy Martin', id: 'PT020', scan: 'Cardiac PET', duration: 90, insurance: 'Cigna', status: 'Pending', date: '2025-10-18' },
      { name: 'Daniel Lee', id: 'PT021', scan: 'PSMA PET', duration: 75, insurance: 'Blue Cross', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Lisa Perez', id: 'PT022', scan: 'Bone Scan', duration: 45, insurance: 'Aetna', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Matthew Thompson', id: 'PT023', scan: 'Thyroid Scan', duration: 30, insurance: 'Medicare', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Betty White', id: 'PT024', scan: 'PET/CT', duration: 60, insurance: 'United Healthcare', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Mark Harris', id: 'PT025', scan: 'Cardiac Stress', duration: 90, insurance: 'Cigna', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Sandra Sanchez', id: 'PT026', scan: 'DaT Scan', duration: 90, insurance: 'Blue Cross', status: 'Pending', date: '2025-10-18' },
      { name: 'Donald Clark', id: 'PT027', scan: 'Bone Scan', duration: 45, insurance: 'Aetna', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Ashley Ramirez', id: 'PT028', scan: 'Amyloid PET', duration: 75, insurance: 'Medicare', status: 'Confirmed', date: '2025-10-16' },
      { name: 'Steven Lewis', id: 'PT029', scan: 'PSMA PET', duration: 75, insurance: 'United Healthcare', status: 'Confirmed', date: '2025-10-17' },
      { name: 'Kimberly Robinson', id: 'PT030', scan: 'Cardiac PET', duration: 90, insurance: 'Cigna', status: 'Confirmed', date: '2025-10-16' },
    ];

    for (const patient of patients) {
      await client.query(
        `INSERT INTO patients (patient_name, patient_id, scan_type, duration, insurance, appointment_status, appointment_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [patient.name, patient.id, patient.scan, patient.duration, patient.insurance, patient.status, patient.date]
      );
    }

    console.log('Sample data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    client.release();
  }
}
