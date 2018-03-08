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

exports.papers_from = function(req,res,next) {

    var timeline = req.params.timeline;

    var d = new Date();

    if (timeline == "yesterday") {
        date = (d.getDate() - 1) + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    } else if (timeline == "one_month") {
        //If its january and looking for a month ago papers then look for ones in december of previous
        //Otherwise leave is as month for previous month as its from 0-11 thus subtracts 1 already from stored val for date
        if (d.getMonth == 0) {
            date = "%-" + 12 + "-" + (d.getFullYear()-1) ;
        } else {
            date = "%-" + d.getMonth() + "-" + d.getFullYear();
        }

    } else if (timeline == "this_year") {
        date = "%-%-" + d.getFullYear();
    } else if (timeline == "last_years") {
        date = "%-%-" + (d.getFullYear() -1);
    }

    var data = {
        "Data": ""
    };

    query = "SELECT * FROM paper_data WHERE date_retrieved LIKE ?";
    //Selects all papers in the table in the order of most stars
    db.query(query,date,function(err, rows, fields){
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


exports.getusercomments = function(req,res, next){
    //get the name of the paper
    var paperid = req.params.paperid;
    //Store JSON result to be extracted in data
    var data = {
        "Data": ""
    };

    db.query("SELECT * FROM user_comments WHERE paper_id = ?",paperid,function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
        });
}

exports.getcommitteecomments = function(req,res, next){
    //get the name of the paper
    var paperid = req.params.paperid;
    //Store JSON result to be extracted in data
    var data = {
        "Data": ""
    };

    db.query("SELECT * FROM committee_comments WHERE paper_id = ?",paperid,function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
        });
}

exports.addcommitteecomment = function(req,res){
    
//Get the values entered in register form
var committee_id = req.params.committee_id;
var comment = req.body.post_comment;
var paperid = req.params.paperid;
var username = req.params.username;

var new_comment = {"paper_id": parseInt(paperid),"committee_id": parseInt(committee_id) ,"username":username,"paper_comments": comment};

db.query('INSERT INTO committee_comments SET ?', new_comment, function(error, results, fields){
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

exports.deletecommitteecomment = function(req,res){
    var paperid = req.params.paperid;
    var committee_id = req.params.committee_id;
    var username = req.params.username;

    query = "DELETE FROM committee_comments WHERE paper_id = " + paperid + " AND committee_id = " + committee_id + " AND username = \'" + username + "\'";
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
            res.redirect("/papers/individual/" + paperid.toString());
        }
    });
}

exports.addauthorreply = function(req,res){

    //Get the reply entered in prompt
    var paperid = req.params.paperid;
    var commitee_id = req.params.commitee_id;
    var reply = req.params.reply;
    var username = req.params.username;
    var paper_comments = req.params.paper_comments;

    var new_reply = {"paper_id": parseInt(paperid),"username":username,"paper_comments": paper_comments,"reply": reply};

    db.query('INSERT INTO authors_reply SET ?', new_reply, function(error, results, fields){
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

}

exports.getauthorreply = function(req,res, next){
    //get the name of the paper
    var paperid = req.params.paperid;
    var username = req.params.username;
    var paper_comments = req.params.paper_comments;
    //Store JSON result to be extracted in data
    var data = {
        "Data": ""
    };

    query = "SELECT * FROM authors_reply WHERE paper_id = " + paperid + " AND username = \'" + username + "\' AND paper_comments = \'" + paper_comments + "\'";
    db.query(query,function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
        });
}

exports.addusercomment = function(req,res){
    
    //Get the values entered in register form
    var comment = req.body.post_comment;
    var paperid = req.params.paperid;
    var username = req.params.username;

    var new_comment = {"paper_id": parseInt(paperid),"username":username,"paper_comments": comment};

    db.query('INSERT INTO user_comments SET ?', new_comment, function(error, results, fields){
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

exports.deleteusercomment = function(req,res){
    
    var paperid = req.params.paperid;
    var username = req.params.username;


    db.query('DELETE FROM user_comments WHERE paper_id = ? AND username = ?',[paperid,username], function(error, results, fields){
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

exports.deletelike = function(req,res){
    
    var paperid = req.params.paperid;
    var username = req.params.username;

    query = "DELETE FROM likes WHERE paper_id = " + paperid + " AND username = \'" + username + "\'";
    db.query(query, function(error, results, fields){
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
    var committee_id = req.params.committee_id;

    var add_star  = {"paper_id": parseInt(paperid), "username": username.toString(),"committee": parseInt(committee_id)};

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

exports.deletestar = function(req,res){
    
    var paperid = req.params.paperid;
    var username = req.params.username;
    var committee_id = req.params.committee_id;

    query = "DELETE FROM stars WHERE paper_id = " + paperid + " AND username = \'" + username + "\' AND committee = " + committee_id;
    db.query(query, function(error, results, fields){
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
            data["Star"] = "Star does not exist";
            res.json(data);
        }
        });
}

exports.search = function(req,res, next){
    //Search for keyword
    var keyword = req.params.keyword;
    //Store JSON result to be extracted in data
    var data = {
        "Data": ""
    };
    console.log(keyword);
    query = "SELECT * FROM paper_data WHERE paper_title LIKE \'%" + keyword +"%\' ORDER BY paper_id DESC";
    db.query(query,function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            console.log(data["Data"]);
            res.json(data);
        }else{
            data["Data"] = 'Star does not exist';
            res.json(data);
        }
        });
}

exports.committee_ranking = function(req,res, next){
    //get paper id and username
    var committee_id = req.params.committee_id;
    committee_id = parseInt(committee_id);
    //Store JSON result to be extracted in data
    var data = {
        "Data": ""
    };

    query = "SELECT paper_id, COUNT(*) As total FROM stars WHERE committee = ? GROUP BY paper_id ORDER BY total DESC";

    db.query(query,committee_id,function(err, rows, fields){
        if(rows.length != 0){
            data["Data"] = rows;
            console.log(data["Data"]);
            res.json(data);
        }else{
            res.json(data);
        }
        });
}


