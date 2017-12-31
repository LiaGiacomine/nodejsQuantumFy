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
    th1.style.backgroundColor = "lightblue";
    var th1data = document.createTextNode("Title");
    th1.appendChild(th1data);
    table.appendChild(th1);


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
        td1.style.border = "1px solid #ddd";
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
        
        //Add PAPER TITLE to ROW
        //Eventually make the like and star a page where you can see who
        //Has liked the paper
        var b = document.createElement("B");
        paper_likes = data["Data"][row_count]["paper_likes"];
        paper_stars = data["Data"][row_count]["paper_stars"];
        b.appendChild(document.createTextNode("Likes: " + paper_likes + " Stars: " + paper_stars));
        td1.appendChild(b);
        row.appendChild(td1);
        
        //Next row
        row_count = row_count + 1;

    }

        myTableDiv.appendChild(table);

    }


});