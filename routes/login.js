// ================================================================
// USER REGISTER FORM: ADDS USER TO DATABASE AND ENCRYPTS PASSWORD
// LOGIN: CHECKS ENTERED INPUTS MATCH THE DATABASE
// ================================================================
var express = require("express");
var bcrypt = require("bcrypt");
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


//REGISTER WITH USER TYPE 0 OR 1 DEPENDING ON WHETHER EMAIL IS INSTITUTIONAL
exports.register_user = function(req,res) {

    //Get the values entered in register form
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var hash_password;
    var new_user;

    if (isInstitutionalEmail(email)){
        user_type = 1;
    } else {
        user_type = 0;
    }

    if (username == null || email == null || password == null || confirm_password == null) {
        res.render("pages/register/user", {
            session: req.session,
            user: req.session.username,
            err: "Must not be empty"
        });
    }
    else if (password != confirm_password){
        res.render("pages/register/user", {
            session: req.session,
            user: req.session.username,
            err: "Password does not match confirm password"
        });
    }else {
        if(validateEmail(email)) {

            bcrypt.hash(password, 9, function(err, hash) {
                new_user = {"username": username, "email": email, "password":hash, "user_type":user_type};
                    db.query('INSERT INTO user_login SET ?', new_user, function(err, results, fields){
                        if (err) {
                            console.log("error occured", err);
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
    req.checkBody('surname', 'Please enter your surname').notEmpty();
    req.checkBody('password', 'Please enter a password').notEmpty();
    req.checkBody('confirm_password', 'Please confirm your password').notEmpty();

}


//REGISTER WITH USER TYPE 2
exports.register_author = function(req,res) {
    
        //Get the values entered in register form
        var forename = req.body.forename;
        var surname = req.body.surname;
        var email = req.body.email;
        var password = req.body.password;
        var confirm_password = req.body.confirm_password;
        var user_type = 2;
        var hash_password;

        if (password!=confirm_password){
            res.render("pages/register/author", {
                session: req.session,
                user: req.session.username,
                err: "Password does not match confirm password"
            });
        }else{
            if (isInstitutionalEmail(email)) {
                //HASH PASSWORD
                // var hash_password = bcrypt.hash(password, bcrypt.genSaltSync(9));
                
                //HASH PASSWORD
                bcrypt.hash(password, 9, function(err, hash) {
                    var new_user = {"username": forename + " " + surname, "email": email, "password":hash, "user_type":user_type};
                
                    db.query('INSERT INTO user_login SET ?', new_user, function(err, results, fields){
                        if (err) {
                            console.log("error occured", err);
                            res.send({
                                "code": 400,
                                "failed": "error ocurred"
                            })
                        } else {
                            console.log("solution is: ", results);
                            res.render("pages/login/author", {
                                session: req.session,
                                user: req.session.username,
                                user_type: req.session.user_type,
                                err: "None"
                            });
                        }
                    });
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

//USER TYPE IS 1 FOR USERS WITH INSTITUTIONAL EMAIL AND 0 OTHERWISE
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
    var sql = "SELECT * FROM user_login WHERE (username = \"" + username + "\" OR email = \"" + username + "\") AND (user_type= 0 OR user_type=1)";

    db.query(sql, function(err, rows, fields) {
        if(rows.length != 0){
            data["Data"] = rows;
            //HASH PASSWORD
            bcrypt.compare(password, data["Data"][0]["password"], function(err,result) {
                if (result) {
                    req.session.username = email;
                    req.session.user_type = data["Data"][0]["user_type"];
                    req.session.committee = data["Data"][0]["committee"];
                    res.render("pages/login/loginSuccess",{            
                        session: req.session,
                        user: req.session.username,
                        user_type: req.session.user_type,
                        err: "None",
                        committee:  req.session.committee
                    });
                } else{
                    res.render("pages/login/user",{                
                        session: req.session,
                        user: req.session.username,
                        user_type: req.session.user_type,
                        err: "Wrong login",
                        committee: req.session.committee
                    });
                }
            });
        } else {
            res.render("pages/login/user",{                
                session: req.session,
                user: req.session.username,
                user_type: req.session.user_type,
                err: "Wrong login",
                committee: req.session.committee
            });
    }
});


}

//USER TYPE IS 2 FOR AUTHORS
exports.authorlogin = function(req,res){
    var username= req.body.username;
    var email= req.body.username;
    var password = req.body.password;
    var user_type = 2;

    var data = {
        "Data": ""
    };

    //var user = {"email": email, "password":password};
    var sql = "SELECT * FROM user_login WHERE (username = \"" + username + "\" OR email = \"" + username + "\") AND user_type= 2";
    console.log(sql);
    db.query(sql, function(err, rows, fields) {
        if (err) {
                res.send({
                    "code":400,
                    "failed":"error ocurred"
                });
            }else{
                if(rows.length != 0){
                    data["Data"] = rows;
                    //HASH PASSWORD
                    bcrypt.compare(password, data["Data"][0]["password"], function(err,result) {
                        if (result) {
                            req.session.username = email;
                            req.session.user_type = user_type;
                            req.session.committee = data["Data"][0]["committee"];
                            res.render("pages/login/loginSuccess",{                
                                session: req.session,
                                user: req.session.username,
                                user_type: req.session.user_type,
                                err: "None",
                                committee: req.session.committee
                            });
                        } else {
                            res.render("pages/login/user",{                
                            session: req.session,
                            user: req.session.username,
                            user_type: req.session.user_type,
                            err: "Wrong login",
                            committee: req.session.committee
                            });
                        }
                    });
                }
            }
        });
}

//USER TYPE IS 4 FOR SUPER ADMIN AND 3 FOR NORMAL ADMIN
exports.adminlogin = function(req,res){
    var username= req.body.username;
    var email= req.body.username;
    var password = req.body.password;
    var data = {
        "Data": ""
    };

    //var user = {"email": email, "password":password};
    var sql = "SELECT * FROM user_login WHERE (username = \"" + username + "\" OR email = \"" + username + "\") AND user_type > 2";
    db.query(sql, function(err, rows, fields) {
        if (err) {
            res.send({
                "code":400,
                "failed":"error ocurred"
                });
            }else{
                if(rows.length != 0){
                    data["Data"] = rows;
                    //HASH PASSWORD
                    bcrypt.compare(password, data["Data"][0]["password"], function(err,result) {
                        if (result) {
                            req.session.username = email;
                            req.session.user_type = data["Data"][0]["user_type"];
                            req.session.committee = data["Data"][0]["committee"];
                            res.render("pages/admin/index",{                
                                    session: req.session,
                                    user: req.session.username,
                                    user_type: req.session.user_type,
                                    err: "None",
                                    committee: req.session.committee
                                    });
                        } else {
                                res.render("pages/login/user",{                
                                session: req.session,
                                user: req.session.username,
                                user_type: req.session.user_type,
                                err: "Wrong login",
                                committee: req.session.committee
                                });
                            }
                        });
                    }
                }
        });
}

exports.userlist = function(req,res){
    var data = {
        "Data": ""
    };
    //var user = {"email": email, "password":password};
    var sql = "SELECT * FROM user_login WHERE user_type < 4";
    db.query(sql, function (err, rows, fields) {
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });
}

exports.adminlist = function(req,res){
    var data = {
        "Data": ""
    };
    //var user = {"email": email, "password":password};
    var sql = "SELECT * FROM user_login WHERE user_type = 3";
    db.query(sql, function (err, rows, fields) {
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });
}

exports.add_committee = function(req,res){

    var username = req.params.username;
    var committee_id = req.params.committee_id;

    //var user = {"email": email, "password":password};
    var sql = "UPDATE user_login SET committee = " + committee_id + " WHERE username = \'" + username + "\'";
    db.query(sql, function (err, rows, fields) {
        if (err) {
            console.log("error occured", err);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            res.render("/login/author", {
                session: req.session,
                user: req.session.username,
                user_type: req.session.user_type,
                err: "None",
                committee: req.params.committee
            }
        )};
    });
}

exports.add_admin = function(req,res){
    
        var email = req.params.email;
    
        //var user = {"email": email, "password":password};
        var sql = "UPDATE user_login SET user_type = " + 3 + " WHERE email = \'" + email + "\'";
        db.query(sql, function (err, rows, fields) {
            if (err) {
                console.log("error occured", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                res.render("/admin/index", {
                    session: req.session,
                    user: req.session.username,
                    user_type: req.session.user_type,
                    err: "None",
                    committee: req.params.committee
                }
            )};
        });
}

exports.delete_admin = function(req,res){
    var email = req.params.email;

    if (isInstitutionalEmail(email)){
        user_type = 1;
    } else {
        user_type = 0;
    }
    
    //var user = {"email": email, "password":password};
    var sql = "UPDATE user_login SET user_type = " + user_type + " WHERE email = \'" + email + "\'";
    db.query(sql, function (err, rows, fields) {
        if (err) {
            console.log("error occured", err);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            res.render("/admin/index", {
                session: req.session,
                user: req.session.username,
                user_type: req.session.user_type,
                err: "None",
                committee: req.params.committee
            }
        )};
    });
    
}

exports.delete_committee = function(req,res){
    
        var username = req.params.username;
    
        //var user = {"email": email, "password":password};
        var sql = "UPDATE user_login SET committee = null WHERE username = \'" + username + "\'";
        db.query(sql, function (err, rows, fields) {
            if (err) {
                console.log("error occured", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                res.render("/login/author", {
                    session: req.session,
                    user: req.session.username,
                    user_type: req.session.user_type,
                    err: "None",
                    committee: req.params.committee
                }
            )};
        });
    }