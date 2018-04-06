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
        url: "http://localhost:3000/summaries/author_summaries",
        dataType: "JSON", // data type expected from server
        success: function (data) {
            //Get size of JSON object (number of papers)
            summary_count = Object.keys(data["Data"]).length;
            //Call function to create table with papers in data object
            summaries_exist = data["Data"];
            if (summaries_exist != "No data Found.."){
                addSummaries(summary_count, data);
            }
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
    table.style.width = "100%";
    myTableDiv.style.marginLeft = "0%";
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
        //td1.style.border = "2px solid gray"
        td1.style.borderBottom = "1px solid #ddd";
        td1.style.border = "1px solid gray";
        td1.style.padding = "25px";

         //ADD TITLE
        // var a = document.createElement("A");
        // td1.appendChild(a);
        var p1 = document.createElement("P");
        paper_title = data["Data"][row_count]["paper_title"];
        p1.appendChild(document.createTextNode(paper_title));
        p1.style.marginLeft = "50px";
        p1.style.fontSize = "1.3em";
        p1.style.fontWeight = "bold";
        td1.appendChild(p1);

        //Add summary 
        summary = data["Data"][row_count]["summary"];
        var p2 = document.createElement("P"); 
        p2.style.marginRight = "50px";
        p2.style.marginLeft = "50px";
        p2.style.fontSize = "1.1em";
        p2.appendChild(document.createTextNode(summary));
        td1.appendChild(p2);
        
        //Add Author's name AND date written
        var i = document.createElement("I");
        var br = document.createElement("BR");
        author_name = data["Data"][row_count]["author_name"];
        date = data["Data"][row_count]["date"];
        i.style.fontSize = ".9em";
        i.style.color = "grey";
        i.appendChild(document.createTextNode("Written by " + author_name + " on " + date));
        // i.appendChild(document.createTextNode("Date-Added: " + date));
        i.style.marginLeft = "50px";
        td1.appendChild(i);
        row.appendChild(td1);
        //Next row
        row_count = row_count + 1;

    }

        myTableDiv.appendChild(table);

    }

});