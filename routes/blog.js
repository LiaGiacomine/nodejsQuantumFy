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
    database : "blog_database"
});

db.connect(function(err){
if(!err) {
    console.log("Database is connected");
} else {
    console.log("Error connecting database");
}
});



// exports.individualblogpost = function(req,res, next){
//     //get the name of the paper
//     var blogid = req.params.blogid;
//     //Store JSON result to be extracted in data
//     var data = {
//         "Data": ""
//     };
//     db.query("SELECT * FROM user_blog_post WHERE blog_id = ?",blogid,function(err, rows, fields){
//         if(rows.length != 0){
//             data["Data"] = rows;
//             res.json(data);
//         }else{
//             data["Data"] = 'No data Found..';
//             res.json(data);
//         }
//         });
// }



// exports.getblogcomments = function(req,res, next){
//     //get the name of the paper
//     var blogid = req.params.blogid;
//     //Store JSON result to be extracted in data
//     var data = {
//         "Data": ""
//     };
//     db.query("SELECT * FROM blog_comments WHERE blog_id = ?",blogid,function(err, rows, fields){
//         if(rows.length != 0){
//             data["Data"] = rows;
//             res.json(data);
//         }else{
//             data["Data"] = 'No data Found..';
//             res.json(data);
//         }
//         });
// }


// exports.addpost = function(req,res){
    
// //Get the values entered in register form
// var blog_post = req.body.blog_post;
// var username = req.params.username;
// var date = req.params.date;


// var new_blog_post = {"username":username, "blog_post": blog_post,"date_added":date};

// db.query('INSERT INTO user_blog_post SET ?', new_blog_post, function(error, results, fields){
//     if (error) {
//         console.log("error occured", error);
//         res.send({
//             "code": 400,
//             "failed": "error ocurred"
//         });
//     } else {
//         console.log("solution is: ", results);
//         //This reloads the page after the comment has been added
//         res.redirect("/blog");
//     }
// });

// req.checkBody('post_comment', 'You can not enter a blank commment').notEmpty();


// var errors = req.validationErrors();
// }

// exports.addcomment = function(req,res){
    
// //Get the values entered in register form
// var comment = req.body.post_comment;
// var blogid = req.params.blogid;
// var username = req.params.username;

// var new_comment = {"blog_id": parseInt(blogid), "blog_comments": comment,"username":username};

// db.query('INSERT INTO blog_comments SET ?', new_comment, function(error, results, fields){
//     if (error) {
//         console.log("error occured", error);
//         res.send({
//             "code": 400,
//             "failed": "error ocurred"
//         });
//     } else {
//         console.log("solution is: ", results);
//         //This reloads the page after the comment has been added
//         res.redirect("/papers/individual/" + paperid.toString());
//     }
// });

// req.checkBody('post_comment', 'You can not enter a blank commment').notEmpty();


// var errors = req.validationErrors();
// }



