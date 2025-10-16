import pool from './db';

export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Patients table for dose ordering
    await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        patient_name VARCHAR(255) NOT NULL,
        patient_id VARCHAR(100) UNIQUE NOT NULL,
        scan_type VARCHAR(100) NOT NULL,
        duration INTEGER NOT NULL,
        insurance VARCHAR(100) NOT NULL,
        appointment_status VARCHAR(50) NOT NULL,
        appointment_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Dose orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dose_orders (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(100) REFERENCES patients(patient_id),
        dose_type VARCHAR(50) NOT NULL,
        vendor VARCHAR(100) NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Ordered'
      );
    `);

    // Dose credits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dose_credits (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(100) REFERENCES patients(patient_id),
        order_id INTEGER REFERENCES dose_orders(id),
        credit_amount DECIMAL(10, 2),
        reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Daily Area Surveys
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_area_surveys (
        id SERIAL PRIMARY KEY,
        survey_date DATE NOT NULL,
        technologist VARCHAR(255) NOT NULL,
        area VARCHAR(255) NOT NULL,
        radiation_reading DECIMAL(10, 2) NOT NULL,
        actions TEXT,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Weekly Area Surveys
    await client.query(`
      CREATE TABLE IF NOT EXISTS weekly_area_surveys (
        id SERIAL PRIMARY KEY,
        week_ending DATE NOT NULL,
        technologist VARCHAR(255) NOT NULL,
        areas TEXT NOT NULL,
        max_reading DECIMAL(10, 2) NOT NULL,
        avg_reading DECIMAL(10, 2) NOT NULL,
        comments TEXT,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Sealed Source Inventory
    await client.query(`
      CREATE TABLE IF NOT EXISTS sealed_source_inventory (
        id SERIAL PRIMARY KEY,
        inventory_date DATE NOT NULL,
        source_id VARCHAR(100) NOT NULL,
        isotope VARCHAR(100) NOT NULL,
        activity DECIMAL(10, 2) NOT NULL,
        location VARCHAR(255) NOT NULL,
        condition VARCHAR(100) NOT NULL,
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check-In/Check-Out Tracers
    await client.query(`
      CREATE TABLE IF NOT EXISTS tracer_checkout (
        id SERIAL PRIMARY KEY,
        checkout_date DATE NOT NULL,
        tracer_type VARCHAR(100) NOT NULL,
        technologist VARCHAR(255) NOT NULL,
        check_in_time TIME,
        check_out_time TIME,
        patient_id VARCHAR(100),
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Dose-Patient Info
    await client.query(`
      CREATE TABLE IF NOT EXISTS dose_patient_info (
        id SERIAL PRIMARY KEY,
        patient_id VARCHAR(100) NOT NULL,
        patient_name VARCHAR(255) NOT NULL,
        dose_ordered DECIMAL(10, 2) NOT NULL,
        dose_delivered DECIMAL(10, 2),
        scan_date DATE NOT NULL,
        cancellation BOOLEAN DEFAULT FALSE,
        credit_due DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // QC on Calibrator
    await client.query(`
      CREATE TABLE IF NOT EXISTS qc_calibrator (
        id SERIAL PRIMARY KEY,
        qc_date DATE NOT NULL,
        calibrator_id VARCHAR(100) NOT NULL,
        technologist VARCHAR(255) NOT NULL,
        test_type VARCHAR(100) NOT NULL,
        result VARCHAR(100) NOT NULL,
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Dosimeter Tracker
    await client.query(`
      CREATE TABLE IF NOT EXISTS dosimeter_tracker (
        id SERIAL PRIMARY KEY,
        tracking_date DATE NOT NULL,
        employee_name VARCHAR(255) NOT NULL,
        badge_id VARCHAR(100) NOT NULL,
        exposure DECIMAL(10, 2) NOT NULL,
        monthly_total DECIMAL(10, 2),
        quarterly_total DECIMAL(10, 2),
        yearly_total DECIMAL(10, 2),
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}
