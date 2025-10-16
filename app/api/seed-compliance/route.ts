import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST() {
  try {
    const client = await pool.connect();
    
    // Clear existing compliance data
    await client.query('DELETE FROM daily_area_surveys');
    await client.query('DELETE FROM weekly_area_surveys');
    await client.query('DELETE FROM sealed_source_inventory');
    await client.query('DELETE FROM tracer_checkout');
    await client.query('DELETE FROM dose_patient_info');
    await client.query('DELETE FROM qc_calibrator');
    await client.query('DELETE FROM dosimeter_tracker');
    
    // Seed Daily Area Surveys
    const dailySurveys = [
      { date: '2025-10-15', tech: 'John Smith', area: 'Hot Lab', reading: 0.5, actions: 'None required', status: 'Pass' },
      { date: '2025-10-15', tech: 'John Smith', area: 'Injection Room', reading: 1.2, actions: 'None required', status: 'Pass' },
      { date: '2025-10-15', tech: 'Sarah Johnson', area: 'Scan Room 1', reading: 0.3, actions: 'None required', status: 'Pass' },
      { date: '2025-10-15', tech: 'Sarah Johnson', area: 'Scan Room 2', reading: 0.4, actions: 'None required', status: 'Pass' },
      { date: '2025-10-14', tech: 'Mike Davis', area: 'Hot Lab', reading: 2.5, actions: 'Decontamination performed', status: 'Action Taken' },
      { date: '2025-10-14', tech: 'Mike Davis', area: 'Injection Room', reading: 1.0, actions: 'None required', status: 'Pass' },
      { date: '2025-10-14', tech: 'Lisa Brown', area: 'Scan Room 1', reading: 0.2, actions: 'None required', status: 'Pass' },
      { date: '2025-10-13', tech: 'John Smith', area: 'Hot Lab', reading: 0.8, actions: 'None required', status: 'Pass' },
      { date: '2025-10-13', tech: 'Sarah Johnson', area: 'Injection Room', reading: 1.5, actions: 'None required', status: 'Pass' },
      { date: '2025-10-13', tech: 'Mike Davis', area: 'Scan Room 2', reading: 0.6, actions: 'None required', status: 'Pass' },
    ];

    for (const survey of dailySurveys) {
      await client.query(
        `INSERT INTO daily_area_surveys (survey_date, technologist, area, radiation_reading, actions, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [survey.date, survey.tech, survey.area, survey.reading, survey.actions, survey.status]
      );
    }

    // Seed Weekly Area Surveys
    const weeklySurveys = [
      { weekEnding: '2025-10-11', tech: 'John Smith', areas: 'Hot Lab, Injection Room, Scan Rooms', maxReading: 2.1, avgReading: 0.8, comments: 'All areas within limits', status: 'Pass' },
      { weekEnding: '2025-10-04', tech: 'Sarah Johnson', areas: 'Hot Lab, Injection Room, Scan Rooms', maxReading: 1.8, avgReading: 0.7, comments: 'Normal readings', status: 'Pass' },
      { weekEnding: '2025-09-27', tech: 'Mike Davis', areas: 'Hot Lab, Injection Room, Scan Rooms', maxReading: 2.5, avgReading: 1.0, comments: 'Hot lab required cleaning', status: 'Action Taken' },
    ];

    for (const survey of weeklySurveys) {
      await client.query(
        `INSERT INTO weekly_area_surveys (week_ending, technologist, areas, max_reading, avg_reading, comments, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [survey.weekEnding, survey.tech, survey.areas, survey.maxReading, survey.avgReading, survey.comments, survey.status]
      );
    }

    // Seed Sealed Source Inventory
    const sources = [
      { date: '2025-10-15', sourceId: 'CS-137-001', isotope: 'Cs-137', activity: 10.0, location: 'Hot Lab Cabinet A', condition: 'Good', comments: 'Annual inspection completed' },
      { date: '2025-10-15', sourceId: 'CO-57-002', isotope: 'Co-57', activity: 5.0, location: 'QC Room Shelf B', condition: 'Good', comments: 'Used for calibrator QC' },
      { date: '2025-10-15', sourceId: 'BA-133-003', isotope: 'Ba-133', activity: 8.0, location: 'Hot Lab Cabinet A', condition: 'Good', comments: 'Routine check' },
      { date: '2025-10-10', sourceId: 'CS-137-001', isotope: 'Cs-137', activity: 10.0, location: 'Hot Lab Cabinet A', condition: 'Good', comments: 'Weekly check' },
      { date: '2025-10-10', sourceId: 'CO-57-002', isotope: 'Co-57', activity: 5.0, location: 'QC Room Shelf B', condition: 'Good', comments: 'Weekly check' },
    ];

    for (const source of sources) {
      await client.query(
        `INSERT INTO sealed_source_inventory (inventory_date, source_id, isotope, activity, location, condition, comments)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [source.date, source.sourceId, source.isotope, source.activity, source.location, source.condition, source.comments]
      );
    }

    // Seed Tracer Checkout
    const tracers = [
      { date: '2025-10-15', tracerType: 'F-18 FDG', tech: 'John Smith', checkOut: '08:00', checkIn: '08:30', patientId: 'PT001', status: 'Complete' },
      { date: '2025-10-15', tracerType: 'Tc-99m MDP', tech: 'Sarah Johnson', checkOut: '09:00', checkIn: '09:25', patientId: 'PT002', status: 'Complete' },
      { date: '2025-10-15', tracerType: 'F-18 FDG', tech: 'Mike Davis', checkOut: '10:00', checkIn: '10:35', patientId: 'PT004', status: 'Complete' },
      { date: '2025-10-15', tracerType: 'I-123 Ioflupane', tech: 'Lisa Brown', checkOut: '11:00', checkIn: '11:40', patientId: 'PT006', status: 'Complete' },
      { date: '2025-10-15', tracerType: 'Tc-99m Sestamibi', tech: 'John Smith', checkOut: '13:00', checkIn: '13:35', patientId: 'PT025', status: 'Complete' },
      { date: '2025-10-14', tracerType: 'F-18 FDG', tech: 'Sarah Johnson', checkOut: '08:15', checkIn: '08:45', patientId: 'PT011', status: 'Complete' },
      { date: '2025-10-14', tracerType: 'Tc-99m MDP', tech: 'Mike Davis', checkOut: '09:30', checkIn: '10:00', patientId: 'PT007', status: 'Complete' },
    ];

    for (const tracer of tracers) {
      await client.query(
        `INSERT INTO tracer_checkout (checkout_date, tracer_type, technologist, check_out_time, check_in_time, patient_id, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [tracer.date, tracer.tracerType, tracer.tech, tracer.checkOut, tracer.checkIn, tracer.patientId, tracer.status]
      );
    }

    // Seed Dose-Patient Info
    const dosePatientRecords = [
      { patientId: 'PT001', patientName: 'John Anderson', doseOrdered: 10.0, doseDelivered: 9.8, scanDate: '2025-10-15', creditDue: 150.00, cancellation: false },
      { patientId: 'PT002', patientName: 'Mary Wilson', doseOrdered: 8.5, doseDelivered: 8.3, scanDate: '2025-10-15', creditDue: 127.50, cancellation: false },
      { patientId: 'PT003', patientName: 'Robert Brown', doseOrdered: 12.0, doseDelivered: 0.0, scanDate: '2025-10-15', creditDue: 180.00, cancellation: true },
      { patientId: 'PT004', patientName: 'Patricia Davis', doseOrdered: 9.5, doseDelivered: 9.2, scanDate: '2025-10-14', creditDue: 142.50, cancellation: false },
      { patientId: 'PT005', patientName: 'Michael Johnson', doseOrdered: 11.0, doseDelivered: 10.9, scanDate: '2025-10-14', creditDue: 165.00, cancellation: false },
      { patientId: 'PT006', patientName: 'Jennifer Martinez', doseOrdered: 7.5, doseDelivered: 7.4, scanDate: '2025-10-14', creditDue: 112.50, cancellation: false },
      { patientId: 'PT007', patientName: 'David Garcia', doseOrdered: 10.5, doseDelivered: 10.3, scanDate: '2025-10-13', creditDue: 157.50, cancellation: false },
    ];

    for (const record of dosePatientRecords) {
      await client.query(
        `INSERT INTO dose_patient_info (patient_id, patient_name, dose_ordered, dose_delivered, scan_date, credit_due, cancellation)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [record.patientId, record.patientName, record.doseOrdered, record.doseDelivered, record.scanDate, record.creditDue, record.cancellation]
      );
    }

    // Seed QC Calibrator
    const qcTests = [
      { date: '2025-10-15', calibratorId: 'CAL-001', tech: 'John Smith', testType: 'Constancy', result: 'Pass', comments: 'Within 5% tolerance' },
      { date: '2025-10-15', calibratorId: 'CAL-002', tech: 'Sarah Johnson', testType: 'Constancy', result: 'Pass', comments: 'Normal operation' },
      { date: '2025-10-14', calibratorId: 'CAL-001', tech: 'Mike Davis', testType: 'Linearity', result: 'Pass', comments: 'Quarterly test completed' },
      { date: '2025-10-14', calibratorId: 'CAL-002', tech: 'Lisa Brown', testType: 'Constancy', result: 'Pass', comments: 'All readings normal' },
      { date: '2025-10-13', calibratorId: 'CAL-001', tech: 'John Smith', testType: 'Constancy', result: 'Pass', comments: 'Within tolerance' },
      { date: '2025-10-13', calibratorId: 'CAL-002', tech: 'Sarah Johnson', testType: 'Constancy', result: 'Pass', comments: 'Normal readings' },
      { date: '2025-10-12', calibratorId: 'CAL-001', tech: 'Mike Davis', testType: 'Constancy', result: 'Pass', comments: 'All systems normal' },
    ];

    for (const qc of qcTests) {
      await client.query(
        `INSERT INTO qc_calibrator (qc_date, calibrator_id, technologist, test_type, result, comments)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [qc.date, qc.calibratorId, qc.tech, qc.testType, qc.result, qc.comments]
      );
    }

    // Seed Dosimeter Tracker
    const dosimeters = [
      { date: '2025-10-15', employee: 'John Smith', badgeId: 'BADGE-001', exposure: 15, monthly: 45, quarterly: 120, yearly: 450, status: 'Normal' },
      { date: '2025-10-15', employee: 'Sarah Johnson', badgeId: 'BADGE-002', exposure: 12, monthly: 38, quarterly: 105, yearly: 380, status: 'Normal' },
      { date: '2025-10-15', employee: 'Mike Davis', badgeId: 'BADGE-003', exposure: 18, monthly: 52, quarterly: 145, yearly: 520, status: 'Normal' },
      { date: '2025-10-15', employee: 'Lisa Brown', badgeId: 'BADGE-004', exposure: 10, monthly: 32, quarterly: 95, yearly: 340, status: 'Normal' },
      { date: '2025-09-15', employee: 'John Smith', badgeId: 'BADGE-001', exposure: 16, monthly: 48, quarterly: 135, yearly: 480, status: 'Normal' },
      { date: '2025-09-15', employee: 'Sarah Johnson', badgeId: 'BADGE-002', exposure: 14, monthly: 42, quarterly: 115, yearly: 410, status: 'Normal' },
      { date: '2025-08-15', employee: 'Mike Davis', badgeId: 'BADGE-003', exposure: 20, monthly: 58, quarterly: 155, yearly: 550, status: 'Normal' },
    ];

    for (const dosimeter of dosimeters) {
      await client.query(
        `INSERT INTO dosimeter_tracker (tracking_date, employee_name, badge_id, exposure, monthly_total, quarterly_total, yearly_total, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [dosimeter.date, dosimeter.employee, dosimeter.badgeId, dosimeter.exposure, dosimeter.monthly, dosimeter.quarterly, dosimeter.yearly, dosimeter.status]
      );
    }

    client.release();
    return NextResponse.json({ success: true, message: 'Compliance data seeded successfully' });
  } catch (error) {
    console.error('Seed compliance error:', error);
    return NextResponse.json({ error: 'Failed to seed compliance data' }, { status: 500 });
  }
}
