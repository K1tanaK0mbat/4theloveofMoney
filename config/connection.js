const Sequelize = require('sequelize');
require('dotenv').config();
const mysql=require('mysql2');

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
      port:3306,
    });

module.exports = sequelize;


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1mADHDK1d$',
// Note that we are intentionally not passing any database name (And yes it still works :))
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

  createDatabase('ecommerce_db'); // Avoid using hyphen in db names or you will need to change to underscore after facing error message when trying to run it
});

function createDatabase(ecommerce_db) {
  // Execute the CREATE DATABASE query
  connection.query(`CREATE DATABASE IF NOT EXISTS ${ecommerce_db}`, (err, results) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log(`Database ${ecommerce_db} created successfully`);
  });
}

