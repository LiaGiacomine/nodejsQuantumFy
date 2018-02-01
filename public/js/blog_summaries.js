/*
    Makes Ajax call to script which connects with db to
    return all the summaries submitted by authors

    Author: Liandra Giacomine
*/

//GET THE NUMBER OF SUMMARIES IN ORDER TO ADD DYNAMICALLY IN LOOP
$(document).ready(function(){
    //alert("in");
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/blog/get_summaries",
        dataType: "JSON", // data type expected from server
        success: function (data) {
            //Get size of JSON object (number of papers)
            summary_count = Object.keys(data["Data"]).length;
            //Call function to create table with papers in data object
            addSummaries(summary_count, data);
            //Syntax to get JSON objects:
        },
        error: function() {
            console.log('Error: ' + data);
        }
    });

    function addSummaries(paper_count, data){
    //  Create table in specified division
    var myTableDiv = document.getElementById("summaries_table");
    var table = document.createElement("TABLE");
    table.style.width = "90%";
    //table.style.border ="ridge";

    var tableHead = document.createElement("THEAD");
    var tr = document.createElement("TR");
    tableHead.appendChild(tr);

    //Create table headers
    //Add table body
    var tableBody = document.createElement("TBODY");
    table.appendChild(tableBody);

    var row_count = 0;

    while (row_count != paper_count) {
        
        //Create ROW
        var row = document.createElement("TR");
        tableBody.appendChild(row);
        
        //Add PAPER TITLE to ROW
        var td1 = document.createElement('TD');
        td1.style.borderBottom = "1px solid #ddd";

         //ADD TITLE
        // var a = document.createElement("A");
        // td1.appendChild(a);
        var p1 = document.createElement("P");
        paper_title = data["Data"][row_count]["paper_title"];
        p1.appendChild(document.createTextNode(paper_title));
        p1.style.fontWeight = "bold";
        // a.href = "http://localhost:3000/admin/individual/" + data["Data"][row_count]["summary_id"];
        // a.style.color = "black";
        //a.appendChild(p1);

        //DESCRIPTION from query
        summary = data["Data"][row_count]["summary"];
        var p2 = document.createElement("P"); 
        p2.appendChild(document.createTextNode(summary));
        td1.appendChild(p2);
        
        
        //Add EMAIL AND DATE
        var i = document.createElement("i");
        var br = document.createElement("BR");
        author_email = data["Data"][row_count]["author_email"];
        date = data["Data"][row_count]["date"];
        i.appendChild(document.createTextNode("Email: " + author_email));
        i.appendChild(br);
        i.appendChild(document.createTextNode("Date-Added: " + date));
        td1.appendChild(i);
        row.appendChild(td1);
        
        //Next row
        row_count = row_count + 1;

    }

        myTableDiv.appendChild(table);

    }

});