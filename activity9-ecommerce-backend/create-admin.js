const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('Admin_321', 10);
  console.log('Hashed password:', hashedPassword);
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'stephcurry_30',
      database: 'lab_activity_db'
    });

    // Insert admin user
    const query = 'INSERT INTO ecommerce_users (email, password, firstName, lastName, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())';
    const [result] = await connection.execute(query, [
      'admin@email.com',
      hashedPassword,
      'Admin',
      'User',
      'admin'
    ]);

    console.log('Admin account created successfully!');
    console.log('Email: admin@email.com');
    console.log('Password: Admin_321');
    
    await connection.end();
  } catch (error) {
    console.error('Error creating admin:', error.message);
  }
}

createAdmin();
