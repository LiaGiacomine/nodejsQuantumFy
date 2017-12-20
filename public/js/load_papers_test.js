/*
This script connects and inserts into the SQL database,
after retrieving all the papers from arxiv.org. This is done
with string manipulation. It runs once a day.

Author: Liandra Giacomine
*/

var express = require("express");
var cors = require("cors");
var mysql = require("mysql");
var fs = require("fs");
var app = express();

module.exports = function(){


//Creates a connection with the papers database
var db = mysql.createConnection({
    host : "localhost",
    user : "liandragiacomine",
    password : "password",
    port: 3306,
    database : "arxiv_papers"
});

//Crops string between start and end position
//First start should equal 0, offset is html to leave out
function getStr(start, str, searchStr, offset, endStr) {
    str_start = str.indexOf(searchStr, start) + offset;
    str_end = str.indexOf(endStr,str_start);
    the_string = str.slice(str_start,str_end);
    return the_string;
}


function totalOfPapers(response_text) {
    //Finds out how many papers there should be in total in order to stop the while loop when it has collected all the data necessary
    //This information is in response text, between b tags
    paper_amount_start = response_text.indexOf("<b>1-") + 5;
    paper_amount_end = response_text.indexOf("</b>",paper_amount_start);
    //Slice the value between the two indexes to obtain number
    paper_amount = response_text.slice(paper_amount_start,paper_amount_end);

    return paper_amount;
}
//THE MATRIX
var values = [];

function addData(response_text) {
    var paper_amount = totalOfPapers(response_text);
    //Create matrix with the correct dimension for database
    for (var i=0; i < paper_amount;i++){
        values.push(new Array(8).fill(0));
    }

    //Write a loop which finds and adds all titles of papers to the table 
    var start_from = 0;
    //Each time it loops, the variable below will be a check as to whether it has reached the end
    var total_paper = 0;
    //Values is are all values that get added to the database
    while (total_paper != paper_amount) {
        
        //Data extraction in the order of the content on the html page

        //Get PDF page
        paper_pdf_id = getStr(start_from, response_text, "arXiv:", 6, "</");
        paper_pdf = "https://arxiv.org/pdf/" + paper_pdf_id + ".pdf";
        //paper_pdf = paper_pdf.replace(/["']/g, "");
        //paper_pdf = paper_pdf.replace(",","");
        //console.log(paper_pdf);

        //Link TITLE to PDF
        paper_title = getStr(start_from, response_text, "Title:</span>", 13, "</div>");
        paper_title = paper_title.replace(/["']/g, "");
        paper_title = paper_title.replace(",","");
        //console.log(paper_title);

        //GET AUTHORS
        paper_author_section = getStr(response_text.indexOf(paper_title), response_text, "\"descriptor\">Authors", 20, "</div>");
        console.log(paper_author_section);
        author_count = (paper_author_section.match(/<a href=/g) || []).length;
        //Get the first author
        author = getStr(0, paper_author_section, "\">", 2, "</a>");
        //Creates string with all authors in author section, adds comma if there's more than one
        if (author_count > 1) {
            author += ", ";
            for (i=1; i<author_count;i++) {
            //This cuts the section each time to get the other authors
                paper_author_section = paper_author_section.slice(80 , paper_author_section.length);
                author += getStr(0, paper_author_section, "\">", 2, "</a>");
                //Don't add a comma to the last author
                if (i != author_count-1){
                    author += ", ";
                }
            }
        };
        console.log(author);
        //write a loop to select all authors then add to description section 
        //Make the description a button which when clickes reveals the description
        //Past the replacements section, the papers don't have a description
        var paper_description = "";
        if (response_text.indexOf(paper_title) < response_text.indexOf("<h3>Replacements for")){
            //Paper description
            paper_description = getStr(response_text.indexOf(paper_title), response_text, "class=\"mathjax\">", 16, "</p>");
            paper_description = paper_description.replace(/["']/g, "");
            paper_description = paper_description.replace(",","");
            //console.log(paper_description);
        };

        //Add all row values to matrix to be inserted in the 9 columns of the table
        values[total_paper][1] = paper_title;
        values[total_paper][2] = paper_description;
        values[total_paper][3] = author;
        values[total_paper][4] = paper_pdf;
        values[total_paper][5] = "type";
        values[total_paper][6] = 0;
        values[total_paper][7] = 0;
        values[total_paper][8] = 0;

        
       //Where to start from next
        start_from = response_text.indexOf(paper_title);
        author = "";
        total_paper = total_paper + 1;

        }

        //After the loop gets all papers, connect and insert into database
        db.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO paper_data (paper_id, paper_title, paper_description, paper_authors, paper_pdf, paper_type, paper_comments, paper_likes, paper_stars) VALUES ?";
            db.query(sql,[values], function (err, result) {
              if (err) throw err;
              console.log("Result: " + result.affectedRows);
            });
        });
};

var response_text;

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
//Get the html of the website
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.withCredentials = true;
        xhr.open(method, url, true);
        xhr.send();    
    } else if (typeof XDomainRequest != "undefined") {
  
      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
      xhr.send();
    } else {
  
      // Otherwise, CORS is not supported by the browser.
      xhr = null;
  
    }
    return xhr;
  }
  
  var url = "https://arxiv.org/list/quant-ph/new";

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    throw new Error('CORS not supported');
  }

  xhr.onload = function() {
    response_text = xhr.responseText;
    addData(response_text);
    //console.log(response_text);
    // process the response.
   }
   
   xhr.onerror = function() {
     console.log('There was an error!');
   }
}
