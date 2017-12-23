// ================================================================
// USER REGISTER FORM: ADDS USER TO DATABASE AND ENCRYPTS PASSWORD
// LOGIN: CHECKS ENTERED INPUTS MATCH THE DATABASE
// ================================================================
var express = require("express");
var bcrypt = require("bcryptjs");
var mysql = require('mysql');
var router = express.Router();

//Set up connection with database
var db = mysql.createConnection({
    host : "localhost",
    user : "liandragiacomine",
    password : "password",
    port: 3306,
    database : "users"
});

db.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error connecting database");
}
});

exports.register = function(req,res) {

    //Get the values entered in register form
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;

    var new_user = {"username": username, "email": email, "password":password};

    db.query('INSERT INTO user_login SET ?', new_user, function(error, results, fields){
        if (error) {
            console.log("error occured", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            console.log("solution is: ", results);
            res.send({
                "code": 204,
                "success": "Email does not exist"
            });
        }
    });

    req.checkBody('username', 'Please enter a username').notEmpty();
    req.checkBody('email', 'Please enter a username').notEmpty();
    req.checkBody('password', 'Please enter a username').notEmpty();
    req.checkBody('confirm_password', 'Please enter a username').notEmpty();
    
    var errors = req.validationErrors();

    if (errors){
        res.render('pages/register', {
            errors: errors
        });
    } else {
        console.log('nope.');
    }
    console.log(username);
        
    // bcrypt.genSalt(10,function(err,salt){
    //     bcrypt.hash(new_user.password, salt, function(err, hash){
    //         //Store hash in your password db
    //         new_user.password = hash;
    //         new_user.save(callback);
    //     });
    // });

}

exports.login = function(req,res){
    var email= req.body.username;
    var password = req.body.password;
    db.query('SELECT * FROM user_login WHERE email = ?',[email], function (error, results, fields) {
        if (error) {
        // console.log("error ocurred",error);
        res.send({
            "code":400,
            "failed":"error ocurred"
        })
        }else{
        if(results.length > 0){
            if(results[0].password == password){
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
        }
        else{
            res.send({
            "code":204,
            "success":"Email does not exits"
                });
        }
    }
    });
  }


