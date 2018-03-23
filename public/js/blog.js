/*
    Makes Ajax call to script which connects with db to
    return all the news submitted by admin

    Author: Liandra Giacomine
*/

//GET THE NUMBER OF SUMMARIES IN ORDER TO ADD DYNAMICALLY IN LOOP
$(document).ready(function(){
    //alert("in");
    $.ajax({
        type: "GET",
        url: "/blog/get_news",
        dataType: "JSON", // data type expected from server
        success: function (data) {
            //Get size of JSON object (number of papers)
            news_count = Object.keys(data["Data"]).length;
            //Call function to create table with papers in data object
            addNews(news_count, data);
            //Syntax to get JSON objects:
        },
        error: function() {
            console.log('Error: ' + data);
        }
    });

    function addNews(news_count, data){
    //  Create table in specified division
    var myTableDiv = document.getElementById("blog_table");
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

    while (row_count != news_count) {
        
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
        title = data["Data"][row_count]["title"];
        p1.appendChild(document.createTextNode(title));
        //p1.style.fontWeight = "bold";
        p1.style.fontSize = "1.1em";
        p1.style.fontFamily = "arial";
        td1.appendChild(p1);
        // a.href = "http://localhost:3000/admin/individual/" + data["Data"][row_count]["summary_id"];
        // a.style.color = "black";
        //a.appendChild(p1);

        //DESCRIPTION from query
        description = data["Data"][row_count]["description"];
        var p2 = document.createElement("P"); 
        p2.appendChild(document.createTextNode(description));
        p2.style.fontFamily = "arial";
        p2.style.fontSize = ".9em";
        td1.appendChild(p2);
        
        
        //Add EMAIL AND DATE
        var i = document.createElement("i");
        date = data["Data"][row_count]["date"];
        i.style.fontFamily = "arial";
        i.style.fontSize = ".7em";
        i.style.color = "grey";
        i.appendChild(document.createTextNode("Date-Added: " + date));
        td1.appendChild(i);
        row.appendChild(td1);
        
        //Next row
        row_count = row_count + 1;

    }

        myTableDiv.appendChild(table);

    }

});