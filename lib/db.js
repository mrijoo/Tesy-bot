const fs = require('fs')
var mysql = require('mysql');
const setting = JSON.parse(fs.readFileSync('./settings.json'))

var db = mysql.createConnection({
    host: setting.mysql.host,
    user: setting.mysql.user,
    password: setting.mysql.password,
    database: setting.mysql.database,
    dateStrings: setting.mysql.dateStrings
});

db.connect(function (err) {
    if (err) throw err;
    console.log("DB Connected!");
    db.query("show tables like 'user'", function (err, result, fields) {
        if (err) throw err;
        if (result.length === 0) {
            db.query("CREATE TABLE user (id INT AUTO_INCREMENT PRIMARY KEY, no_hp VARCHAR(17), nama VARCHAR(255), asal VARCHAR(255), tgl_lahir DATE, status VARCHAR(255), sekolah VARCHAR(255), kelas VARCHAR(255), absen INT(2), penguruskelas BOOLEAN, prefix VARCHAR(1), simi BOOLEAN, StickerAutoResize BOOLEAN, status_pendaftaran VARCHAR(255), pendaftaran DATETIME)", function (err, result) {
                console.log("Table User created");
            });
        }
    });
    db.query("show tables like 'grup'", function (err, result, fields) {
        if (err) throw err;
        if (result.length === 0) {
            db.query("CREATE TABLE grup (id INT AUTO_INCREMENT PRIMARY KEY, grup_id VARCHAR(255), sekolah VARCHAR(255), kelas VARCHAR(255), jumlahsiswa INT(3), prefix VARCHAR(1), simi BOOLEAN, status_pendaftaran VARCHAR(255), pendaftaran DATETIME)", function () {
                console.log("Table Grup created");
            });
        }
    });
});

module.exports = db;