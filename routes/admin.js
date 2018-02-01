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
    database : "admin_db"
});

db.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error connecting database");
}
});

exports.submitsummary = function(req,res, next){
    //get the name of the paper
    var author_email = req.body.author_email;
    var paper_title = req.body.paper_title;
    var author_name = req.body.author_name;
    var summary = req.body.summary;
    //Store JSON result to be extracted in data
    var data = {
        "Data": ""
    };

    var d = new Date();

    date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

    var summary_post = {"author_name": author_name, "author_email":author_email, "paper_title": paper_title,"summary":summary,"date":date};
    
    req.checkBody('author_email', 'Please enter a username').notEmpty();
    req.checkBody('paper_title', 'Please enter a username').notEmpty();
    req.checkBody('author_name', 'Please enter a username').notEmpty();
    req.checkBody('summary', 'Please enter a username').notEmpty();
    
    if (author_email == "" || paper_title == "" || author_name == "" || summary == "") {
        res.render("pages/blog/write_summary", {
            session: req.session,
            user: req.session.username,
            user_type: req.session.user_type,
            err: "Contains empty fields"
        });
    }
    else {
        db.query("INSERT INTO check_summaries SET ?",[summary_post],function(err, rows, fields){
            if (err) {
                console.log("error occured", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                console.log("solution is: ", rows);
                //This reloads the page after the comment has been added
                res.render("pages/blog/summary_sent", {
                    session: req.session,
                    user: req.session.username,
                    user_type: req.session.user_type,
                    err: "None"
                });
            }
            });
    }
}

//DUE TO ENTRIES BEING AUTO INCREMENT, THE OLDEST WILL BE THE LOWEST NUMBERS THUS ASCENDING ORDER
exports.getsummaries = function(req,res) {
    var data = {
        "Data": ""
    };
    //Selects all papers in the table in the order of most stars
    db.query("SELECT * FROM check_summaries ORDER BY summary_id ASC",function(err, rows, fields){
    if(rows.length != 0){
        data["Data"] = rows;
        res.json(data);
    }else{
        data["Data"] = 'No data Found..';
        res.json(data);
    }
    });
}

//DUE TO ENTRIES BEING AUTO INCREMENT, THE OLDEST WILL BE THE LOWEST NUMBERS THUS ASCENDING ORDER
exports.individualsummary = function(req,res) {

    summary_id = req.params.summary_id;
    
    var data = {
        "Data": ""
    };
    //Selects all papers in the table in the order of most stars
    db.query("SELECT * FROM check_summaries WHERE summary_id =" + summary_id,function(err, rows, fields){
    if(rows.length != 0){
        data["Data"] = rows;
        res.json(data);
    }else{
        data["Data"] = 'No data Found..';
        res.json(data);
    }
    });
}


exports.deletesummary = function(req,res, next){
    //get the name of the paper
    var summary_id = req.params.summary_id;

    db.query("DELETE FROM check_summaries WHERE summary_id="+summary_id,function(err, rows, fields){
        if (err) {
            console.log("error occured", err);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log("solution is: ", rows);
            //This reloads the page after the comment has been added
            res.redirect("/admin/summaries");
        }
    });
}

exports.acceptsummary = function(req,res, next){
    //get the name of the paper
    var summary_id = req.params.summary_id;
    var author_name = req.params.author_name;
    var author_email = req.params.author_email;
    var paper_title = req.params.paper_title;
    var summary = req.params.summary;
    var date = req.params.date;

    var add_summary = {"author_name": author_name, "author_email":author_email, "paper_title": paper_title,"summary":summary,"date":date};
    
    db.query("INSERT INTO author_summaries SET ?",add_summary,function(err, rows, fields){
        if (err) {
            console.log("error occured", err);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log("solution is: ", rows);
            //This reloads the page after the comment has been added
            res.redirect("/admin/summaries");
        }
    });
}

exports.summarydata = function(req,res) {
    var data = {
        "Data": ""
    };
    //Selects all papers in the table in the order of most stars
    db.query("SELECT * FROM author_summaries",function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else {
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });
}
