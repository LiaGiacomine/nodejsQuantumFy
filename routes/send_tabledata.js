/*
This script dynamically creates a table and adds the papers
from the paper database to be shown on the website

Author: Liandra Giacomine
*/

var express = require("express");
var mysql = require("mysql");
var app = express();

//Set up connection with database
var db = mysql.createConnection({
    host : "localhost",
    user : "liandragiacomine",
    password : "password",
    port: 3306,
    database : "arxiv_papers"
});

db.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error connecting database");
}
});

exports.table_data = function(req,res){

    //GET THE NUMBER OF PAPERS IN DATABASE
    db.query("SELECT COUNT(*) FROM paper_data", function (error, results, fields) {
        if (error) {
        // console.log("error ocurred",error);
        res.send({
            "code":400,
            "failed":"error ocurred"
        })
        }else if(results.length > 0){
            console.log(results);
            res.send({
                "code":200,
                "success":"login sucessfull"
                });
            }
            else{
            res.send({
                "code":204,
                "success":"Email and password does not match"
                });
            }
    });

    //GET ALL PAPERS IN DATABASE
    db.query("SELECT * FROM paper_data", function (error, results, fields) {
        if (error) {
        // console.log("error ocurred",error);
        res.send({
            "code":400,
            "failed":"error ocurred"
        })
        }else if(results.length > 0){
            
            res.send({
                "code":200,
                "success":"login sucessfull"
                });
            }
            else{
            res.send({
                "code":204,
                "success":"Email and password does not match"
                });
            }
    });

}