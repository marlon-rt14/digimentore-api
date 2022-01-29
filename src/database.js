const mysql = require('mysql');
const promisify = require('util').promisify;

const keys = require('./keys');

const pool = mysql.createPool(keys);

pool.getConnection((err, connection) => {
	if (err) {
		console.log(err);
	} else {
		console.log('Database is connected successfully');
		connection.release();
	}
	return;
});

pool.query = promisify(pool.query);

module.exports = pool;