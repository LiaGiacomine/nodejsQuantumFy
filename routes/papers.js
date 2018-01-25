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
    database : "arxiv_papers"
});


db.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error connecting database");
}
});

exports.paperdata = function(req,res) {
    var data = {
        "Data": ""
    };
    //Selects all papers in the table in the order of most stars
    db.query("SELECT * FROM paper_data ORDER BY paper_stars DESC",function(err, rows, fields){
    if(rows.length != 0){
        data["Data"] = rows;
        res.json(data);
    }else{
        data["Data"] = 'No data Found..';
        res.json(data);
    }
    });
}

exports.individualpaper = function(req,res, next){
    //get the name of the paper
    var paperid = req.params.paperid;
    //Store JSON result to be extracted in data
    var data = {
        "Data": ""
    };
    db.query("SELECT * FROM paper_data WHERE paper_id = ?",paperid,function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
        });
}


exports.getpapercomments = function(req,res, next){
    //get the name of the paper
    var paperid = req.params.paperid;
    //Store JSON result to be extracted in data
    var data = {
        "Data": ""
    };
    db.query("SELECT * FROM comments WHERE paper_id = ?",paperid,function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
        });
}

exports.addcomment = function(req,res){
    
//Get the values entered in register form
var comment = req.body.post_comment;
var paperid = req.params.paperid;
var username = req.params.username;

var new_comment = {"paper_id": parseInt(paperid), "paper_comments": comment,"username":username};

db.query('INSERT INTO comments SET ?', new_comment, function(error, results, fields){
    if (error) {
        console.log("error occured", error);
        res.send({
            "code": 400,
            "failed": "error ocurred"
        });
    } else {
        console.log("solution is: ", results);
        //This reloads the page after the comment has been added
        res.redirect("/papers/individual/" + paperid.toString());
    }
});

req.checkBody('post_comment', 'You can not enter a blank commment').notEmpty();


var errors = req.validationErrors();
}

exports.checklike = function(req,res, next){
    //get paper id and username
    var paperid = req.params.paperid;
    var username = req.params.username;
    //Store JSON result to be extracted in data
    var data = {
        "Like": ""
    };
    db.query("SELECT * FROM likes WHERE paper_id = ? AND username=?",[paperid,username],function(err, rows, fields){
        if(rows.length != 0){
            data["Like"] = rows;
            console.log(data["Like"]);
            res.json(data);
        }else{
            data["Like"] = 'Like does not exist';
            res.json(data);
        }
        });
}

exports.addlike = function(req,res){
    
    var paperid = req.params.paperid;
    var username = req.params.username;

    var add_like  = {"paper_id": parseInt(paperid), "username": username.toString()};

    //IF USER HAS LIKED PAPER DONT LET THEM LIKE AGAIN
    //ELSE ADD A LIKE TO THE TABLE
    db.query('INSERT INTO likes SET ?',[add_like], function(error, results, fields){
            if (error) {
                console.log("error occured", error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                //This reloads the page after the comment has been added
                res.redirect("/papers/individual/" + paperid.toString());
            }
    });
}

exports.addstar = function(req,res){
    
    var paperid = req.params.paperid;
    var username = req.params.username;

    var add_star  = {"paper_id": parseInt(paperid), "username": username.toString()};

    //IF USER HAS LIKED PAPER DONT LET THEM LIKE AGAIN
    //ELSE ADD A LIKE TO THE TABLE
    db.query('INSERT INTO stars SET ?',[add_star], function(error, results, fields){
            if (error) {
                console.log("error occured", error);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                //This reloads the page after the comment has been added
                res.redirect("/papers/individual/" + paperid.toString());
            }
    });
}


exports.checkstar = function(req,res, next){
    //get paper id and username
    var paperid = req.params.paperid;
    var username = req.params.username;
    //Store JSON result to be extracted in data
    var data = {
        "Star": ""
    };
    db.query("SELECT * FROM stars WHERE paper_id = ? AND username=?",[paperid,username],function(err, rows, fields){
        if(rows.length != 0){
            data["Star"] = rows;
            console.log(data["Star"]);
            res.json(data);
        }else{
            data["Star"] = 'Star does not exist';
            res.json(data);
        }
        });
}



