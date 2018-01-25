// ================================================================
// USER REGISTER FORM: ADDS USER TO DATABASE AND ENCRYPTS PASSWORD
// LOGIN: CHECKS ENTERED INPUTS MATCH THE DATABASE
// ================================================================
var express = require("express");
var bcrypt = require("bcryptjs");
var isInstitutionalEmail = require('is-institutional-email');
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
        
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

exports.register_user = function(req,res) {

    //Get the values entered in register form
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    
    if (isInstitutionalEmail(email)){
        user_type = 1;
    } else {
        user_type = 0;
    }

    console.log(user_type);

    var new_user = {"username": username, "email": email, "password":password, "user_type":user_type};
    
    if (password != confirm_password){
        res.render("pages/register/user", {
            session: req.session,
            user: req.session.username,
            err: "Password does not match confirm password"
        });
    }else {
        if(validateEmail(email)) {
            db.query('INSERT INTO user_login SET ?', new_user, function(error, results, fields){
                if (error) {
                    console.log("error occured", error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                } else {
                    console.log(req.session.user_type);
                    console.log("solution is: ", results);
                    res.render("pages/login/user", {
                        session: req.session,
                        user: req.session.username,
                        user_type: req.session.user_type,
                        err: "None"
                    });
                }
            });
        }else
            res.render("pages/register/user", {
                session: req.session,
                user: req.session.username,
                user_type: req.session.user_type,
                err: "Email does not exist"
            });
        }

    req.checkBody('forename', 'Please enter a username').notEmpty();
    req.checkBody('surname', 'Please enter a username').notEmpty();
    req.checkBody('password', 'Please enter a username').notEmpty();
    req.checkBody('confirm_password', 'Please enter a username').notEmpty();

}


exports.register_author = function(req,res) {
    
        //Get the values entered in register form
        var forename = req.body.forename;
        var surname = req.body.surname;
        var email = req.body.email;
        var password = req.body.password;
        var confirm_password = req.body.confirm_password;
        var user_type = 1;

        var new_user = {"username": forename + " " + surname, "email": email, "password":password, "user_type":user_type};
        
        if (password!=confirm_password){
            res.render("pages/register/author", {
                session: req.session,
                user: req.session.username,
                err: "Password does not match confirm password"
            });
        }else{
            if (isInstitutionalEmail(email)) {
                db.query('INSERT INTO user_login SET ?', new_user, function(error, results, fields){
                    if (error) {
                        console.log("error occured", error);
                        res.send({
                            "code": 400,
                            "failed": "error ocurred"
                        })
                    } else {
                        console.log("solution is: ", results);
                        res.render("/login/author", {
                            session: req.session,
                            user: req.session.username,
                            user_type: req.session.user_type,
                            err: "None"
                        });
                    }
                });
            } else {
                res.render("pages/register/author", {
                    session: req.session,
                    user: req.session.username,
                    user_type: req.session.user_type,
                    err: "Email not institutional"
                });
            }
        }

        req.checkBody('username', 'Please enter a username').notEmpty();
        req.checkBody('forename', 'Please enter a username').notEmpty();
        req.checkBody('email', 'Please enter a username').notEmpty();
        req.checkBody('password', 'Please enter a username').notEmpty();
        req.checkBody('confirm_password', 'Please enter a username').notEmpty();
    
}

exports.userlogin = function(req,res){
    var username= req.body.username;
    var email= req.body.username;
    var password = req.body.password;

    if (isInstitutionalEmail(email)){
        user_type = 1;
    } else {
        user_type = 0;
    }
    var data = {
        "Data": ""
    };

    //var user = {"email": email, "password":password};
    var sql = "SELECT * FROM user_login WHERE (username=\"" + username + "\" OR email=\"" + username + "\") AND password=\"" + password + "\"";
    console.log(user_type);
    db.query(sql, function(err, rows, fields) {
        if(rows.length != 0){
            data["Data"] = rows;
            req.session.username = email;
            req.session.user_type = data["Data"][0]["user_type"];
            res.render("pages/login/loginSuccess",{                
                session: req.session,
                user: req.session.username,
                user_type: req.session.user_type,
                err: "Wrong login"
            });
        }else{
            res.render("pages/login/user",{                
                session: req.session,
                user: req.session.username,
                user_type: req.session.user_type,
                err: "Wrong login"
            });
        }
                // console.log(results);
        // if (error) {
        //     res.send({
        //         "code":400,
        //         "failed":"error ocurred"
        //     });
        // }else{

        //     if(results.length != 0){
        //         req.session.username = email;
        //         req.session.user_type = user_type;
        //         res.redirect("login/loginSuccessful");
        //     } else {
        //         res.render("pages/login/user",{                
        //         session: req.session,
        //         user: req.session.username,
        //         user_type: req.session.user_type,
        //         err: "Wrong login"
        //         });
        //     }
        // }
    });
}

exports.authorlogin = function(req,res){
    var username= req.body.username;
    var email= req.body.username;
    var password = req.body.password;
    var user_type = 3;
    //var user = {"email": email, "password":password};
    var sql = "SELECT * FROM user_login WHERE (username=\"" + username + "\" OR email=\"" + username + "\") AND password=\"" + password + "\"" + " AND user_type=" + user_type;
    console.log(sql);
    db.query(sql, function (error, results, fields) {
        console.log(results);
        if (error) {
            res.send({
                "code":400,
                "failed":"error ocurred"
            });
        }else{

            if(results.length != 0){
                req.session.username = email;
                req.session.user_type = user_type;
                res.redirect("login/loginSuccessful");
            } else {
                res.render("pages/login/user",{                
                session: req.session,
                user: req.session.username,
                user_type: req.session.user_type,
                err: "Wrong login"
                });
            }
        }
    });
}

exports.adminlogin = function(req,res){
    var username= req.body.username;
    var email= req.body.username;
    var password = req.body.password;
    var user_type = 4;
    //var user = {"email": email, "password":password};
    var sql = "SELECT * FROM user_login WHERE (username=\"" + username + "\" OR email=\"" + username + "\") AND password=\"" + password + "\"" + " AND user_type=" + user_type;
    console.log(sql);
    db.query(sql, function (error, results, fields) {
        console.log(results);
        if (error) {
            res.send({
                "code":400,
                "failed":"error ocurred"
            });
        }else{

            if(results.length != 0){
                req.session.username = email;
                req.session.user_type = user_type;
                res.redirect("login/loginSuccessful");
            } else {
                res.render("pages/login/user",{                
                session: req.session,
                user: req.session.username,
                user_type: req.session.user_type,
                err: "Wrong login"
                });
            }
        }
    });
}