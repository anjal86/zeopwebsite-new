const { initializeDatabase } = require('./database');

console.log('Setting up database for production...');

try {
  initializeDatabase();
  console.log('✅ Database setup completed successfully!');
  console.log('📊 SQLite database created at: ./travel.db');
  console.log('🔄 Next step: Run "npm run migrate-data" to populate the database');
} catch (error) {
  console.error('❌ Database setup failed:', error);
  process.exit(1);
}