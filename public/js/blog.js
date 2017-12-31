/*
    Adds blogs to page from database
    Author: Liandra Giacomine
*/

$(document).ready(function(){

    //Get comments for table from ajax call which will return
    //all the comments where paper_id equals this paper_id
    //AND EVENTUALLY USER WHO COMMENTED
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/blogdata",
        dataType: "JSON", // data type expected from server
        success: function () {
            //Call function to add paper returned to page
        },
        error: function(err) {
            console.log('Error: ' + err);
        }
    }).done(function(data){
        if (data["Data"] != "No data Found.."){
            blog_count = Object.keys(data["Data"]).length;
            addBlogsToTable(data, blog_count);
        }
    });


    function addBlogsToTable(data, blog_count){
        //  Create table in specified division
        var myTableDiv = document.getElementById("blog_post_table");
        var table = document.createElement("TABLE");
        table.style.border ="ridge";

        var tableHead = document.createElement("THEAD");
        var tr = document.createElement("TR");
        tableHead.appendChild(tr);

        //Create table headers

        //COMMENT
        var th1 = document.createElement("TH");
        var th1data = document.createTextNode("Posts");
        th1.appendChild(th1data);
        table.appendChild(th1);

        //Add table body
        var tableBody = document.createElement("TBODY");
        table.appendChild(tableBody);

        row_count = 0;

        while (row_count != blog_count) {
            
            //Create ROW
            var row = document.createElement("TR");
            tableBody.appendChild(row);
            
            //Add PAPER TITLE to ROW
            var td1 = document.createElement('TD');
            //Add paper title to column 1 in row

            //Link TITLE to PDF
            var h3 = document.createElement("H3");
            blog_post = data["Data"][row_count]["blog_post"];
            h3.appendChild(document.createTextNode(blog_post));
            h3.style.fontWeight = "bold";
            td1.appendChild(h3);

            //Link TITLE to PDF
            var h5 = document.createElement("H5");
            username = data["Data"][row_count]["username"];
            h5.appendChild(document.createTextNode(username));
            h5.style.fontWeight = "bold";
            td1.appendChild(h5);
            tableBody.appendChild(td1);

            //Next row
            row_count = row_count + 1;

        }
        
        myTableDiv.appendChild(table);
    }
    

});