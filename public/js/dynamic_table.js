/*
Makes Ajax call to script which connects with db to
return all the papers in the database

Author: Liandra Giacomine
*/

//GET THE NUMBER OF PAPERS TO ADD TO THE TABLE THUS THE NUMBER OF ROWS
$(document).ready(function(){
    //alert("in");
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/paperdata",
        dataType: "JSON", // data type expected from server
        success: function (data) {
            //Get size of JSON object (number of papers)
            paper_count = Object.keys(data["Data"]).length;
            //Call function to create table with papers in data object
            JSON_to_table(paper_count, data);
            //Syntax to get JSON objects:
            //alert(data["Data"][1]["paper_title"]);
        },
        error: function() {
            console.log('Error: ' + data);
        }
    });

    function JSON_to_table(paper_count, data){

    //  Create table in specified division
    var myTableDiv = document.getElementById("paper_main_table");
    var table = document.createElement("TABLE");
    table.style.border ="ridge";

    var tableHead = document.createElement("THEAD");
    var tr = document.createElement("TR");
    tableHead.appendChild(tr);

    //Create table headers

    //TITLE
    var th1 = document.createElement("TH");
    var th1data = document.createTextNode("Title");
    th1.appendChild(th1data);
    table.appendChild(th1);

    //DESCRIPTION
    var th2 = document.createElement("TH");
    var th2data = document.createTextNode("Gold Stars/Likes");
    th2.appendChild(th2data);
    table.appendChild(th2);

    //GOLD STARS and LIKES
    var th3 = document.createElement("TH");
    var th3data = document.createTextNode("Comments");
    th3.appendChild(th3data);
    table.appendChild(th3);


    //Add table body
    var tableBody = document.createElement("TBODY");
    table.appendChild(tableBody);

    row_count = 0;


    while (row_count != paper_count) {
        
        //Create ROW
        var row = document.createElement("TR");
        tableBody.appendChild(row);
        
        //Add PAPER TITLE to ROW
        var td1 = document.createElement('TD');
        //Add paper title to column 1 in row

        //Link TITLE to PDF
        var a = document.createElement("A");
        td1.appendChild(a);
        var p1 = document.createElement("P");
        //TITLE from query -> JSON obj
        paper_title = data["Data"][row_count]["paper_title"];
        p1.appendChild(document.createTextNode(paper_title));
        p1.style.fontWeight = "bold";
        a.href = "http://localhost:3000/papers/individual/" + data["Data"][row_count]["paper_id"];
    
        a.appendChild(p1);
        
        //DESCRIPTION from query
        paper_description = data["Data"][row_count]["paper_description"];
        var p2 = document.createElement("P"); 
        p2.appendChild(document.createTextNode(paper_description));
        td1.appendChild(p2);
        row.appendChild(td1);
        
        //Add gold stars to column two
        var td2 = document.createElement('TD');
        
        //Add number of gold stars
        paper_stars = data["Data"][row_count]["paper_stars"];
        paper_likes = data["Data"][row_count]["paper_likes"];
        td2.appendChild(document.createTextNode(paper_stars));
        row.appendChild(td2);

        //Add likes to column three
        var td3 = document.createElement('TD');
        //Add number of COMMENTS
        paper_commments = data["Data"][row_count]["paper_commments"];
        td3.appendChild(document.createTextNode(paper_commments));
        row.appendChild(td3);
        
        //Next row
        row_count = row_count + 1;

    }

        myTableDiv.appendChild(table);

    }


});