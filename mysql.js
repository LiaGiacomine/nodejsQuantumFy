//const express = require("express");
const mysql = require("mysql");

//Create connection with mysql

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "papers"
});

//Connect

db.connect(function(err) {
    if (err) throw err;
    console.log("Mysql connected!");
    var sql = "INSERT INTO paper_data VALUES (1,'title','description','authors','pdf', 0,0,0)";
    db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
    
});

