// ================================================================
// USER REGISTER FORM: ADDS USER TO DATABASE AND ENCRYPTS PASSWORD
// LOGIN: CHECKS ENTERED INPUTS MATCH THE DATABASE
// ================================================================
var express = require("express");
var mysql = require('mysql');
var router = express.Router();

//Set up connection with database
var db = mysql.createConnection({
    host : "localhost",
    user : "liandragiacomine",
    password : "password",
    port: 3306,
    database : "committee_db"
});

db.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error connecting database");
}
});

exports.committee_data = function(req,res) {
    var data = {
        "Data": ""
    };
    //Selects all papers in the table in the order of most stars
    db.query("SELECT * FROM committee",function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else {
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });
}


exports.committee_individual = function(req,res) {
    var committee_name = req.params.committee_name;

    var data = {
        "Data": ""
    };

    //Selects all papers in the table in the order of most stars
    query = "SELECT * FROM committee_members WHERE committee = " + topic;
    db.query(query,function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else {
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });
}

exports.committee_addmember = function(req,res){
    
    //Get the values entered in register form
    var committee_name = req.params.committee_name;
    var username = req.params.username;

    var date = "1/1/18";
    var new_member = {"committee": committee_name, "username": username,"date_added":date};

    db.query('INSERT INTO committee_members SET ?', new_member, function(error, results, fields){
        if (error) {
            console.log("error occured", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log("solution is: ", results);
            //This reloads the page after the comment has been added
            res.redirect("/committee/individual/" + committee_name);
        }
    });
}