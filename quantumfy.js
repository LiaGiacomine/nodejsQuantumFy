//const express = require("express");
//const mysql = require("mysql");
//
////Create connection with mysql
//
//const db = mysql.createConnection({
//    host : "localhost",
//    user : "root",
//    password : "",
//    database : "user_login"
//});
//
////Connect
//
//db.connect((err) => {
//    if (err) {
//        throw err;
//        }
//    console.log("Mysql connected");
//});
//
//
//const website = express();
//
////Add data to table
//
//website.get("/addData", (req, res) => {
//    let data = {user_id: 1, username: "0", email: "0", password: "0"};
//    let sql = "INSERT INTO user_login_data SET ?";
//    let query = db.query(sql, data, (err, result) => {
//        if (err) throw err;
//        console.log(result);
//        res.send("Data added...");
//    });
//});
//
//website.listen("3000", () => {
//    
//    console.log("server started on port 3000");
//});

var express = require('express')
, jsdom = require('jsdom')
, request = require('request')
, url = require('url')
, app = module.exports = express.createServer();


app.get('/nodetube', function(req, res){
	//Tell the request that we want to fetch youtube.com, send the results to a callback function
        request({uri: 'http://youtube.com'}, function(err, response, body){
                var self = this;
		self.items = new Array();//I feel like I want to save my results in an array
		
		//Just a basic error check
                if(err && response.statusCode !== 200){console.log('Request error.');}
                //Send the body param as the HTML code we will parse in jsdom
		//also tell jsdom to attach jQuery in the scripts and loaded from jQuery.com
		jsdom.env({
                        html: body,
                        scripts: ['http://code.jquery.com/jquery-1.6.min.js']
                }, function(err, window){
			//Use jQuery just as in a regular HTML page
                        var $ = window.jQuery;
                        
                        console.log($('title').text());
                        res.end($('title').text());
                });
        });
});