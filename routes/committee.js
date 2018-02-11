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

exports.members = function(req,res) {
    var committee_id = req.params.committee_id;
    var data = {
        "Data": ""
    };
    
    query = "SELECT * FROM committee_members WHERE committee_id = " + committee_id;
   // Selects all members that belong to the committee specified
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


// exports.committee_individual = function(req,res) {
//     var committee_id = req.params.committee_id;

//     var data = {
//         "Data": ""
//     };

//     //Selects all papers in the table in the order of most stars
//     query = "SELECT * FROM committee_members WHERE committee_id = " + committee_id;
//     db.query(query,function(err, rows, fields){
//         if(rows.length != 0){
//             data["Data"] = rows;
//             res.json(data);
//         }else {
//             data["Data"] = 'No data Found..';
//             res.json(data);
//         }
//     });
// }

exports.committee_addmember = function(req,res){
    
    //Get the values entered in register form
    var committee_id = req.params.committee_id;
    var username = req.params.username;

    var d = new Date();
    
    date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
    
    var new_member = {"committee_id": committee_id, "username": username,"date_added":date};

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
            req.session.committee = committee_id;
            res.render("/admin/manage_committee/" + committee_id,{                
                session: req.session,
                user: req.session.username,
                user_type: req.session.user_type,
                err: "Wrong login",
                committee: req.session.committee,
            });
        }
    });
}

exports.committee_deletemember = function(req,res){
    
    //Get the values entered in register form
    var username = req.params.username;
    var committee_id = req.params.committee_id;
    query = "DELETE FROM committee_members WHERE committee_id = " + committee_id + " AND username = \'" + username + "\'";
    
    db.query(query, function(error, results, fields){
        if (error) {
            console.log("error occured", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log("solution is: ", results);
            //This reloads the page after the comment has been added
            res.redirect("/admin/committee");
        }
    });
}

exports.addcommittee = function(req,res){
    
    //Get the values entered in register form
    var committee_title = req.body.committee_title;

    var new_committee = {"committee": committee_title};

    db.query('INSERT INTO committee SET ?', new_committee, function(error, results, fields){
        if (error) {
            console.log("error occured", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log("solution is: ", results);
            //This reloads the page after the comment has been added
            res.redirect("/admin/committee");
        }
    });
}

exports.deletecommittee = function(req,res){
    
    //Get the values entered in register form
    var committee_id = req.body.committee_id;
    query = "DELETE FROM committee WHERE committee_id = " + committee_id;
    
    db.query(query, function(error, results, fields){
        if (error) {
            console.log("error occured", error);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            console.log("solution is: ", results);
            //This reloads the page after the comment has been added
            res.redirect("/admin/committee");
        }
    });
}