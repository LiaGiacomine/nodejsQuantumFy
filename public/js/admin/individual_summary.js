/*
Makes Ajax call to script which connects with db to
return the specified paper along with all of its information

Author: Liandra Giacomine
*/

$(document).ready(function(){
    //GET PAPER ID
    var url = window.location.href;
    var end_of_str = url.length;
    summaryid = url.slice(url.indexOf("/individual/") + 12, end_of_str);

    $.ajax({
        type: "GET",
        url: "/admin/individual_summary/" + summaryid,
        dataType: "JSON", // data type expected from server
        success: function (data) {
            //Call function to add paper returned to page
            showSummary(data);
        },
        error: function() {
            console.log('Error:');
        }
    });


    function showSummary(data){
        //Get all components from db
        paper_title = data["Data"][0]["paper_title"];
        author_name = data["Data"][0]["author_name"];
        author_email = data["Data"][0]["author_email"];
        summary = data["Data"][0]["summary"];
        date = data["Data"][0]["date"];

        //ADD VALUES TO INNER HTML OF THE SELECTED ELEMENTS
        $(".paper_title").html(paper_title);
        $(".author_name").html("Author: " + author_name);
        $(".author_email").html("Email: " + author_email);
        $(".summary_description").html(summary);
        $(".date").html("Date Submitted: " + date);


        //IF ACCEPT BUTTON IS PRESSED ADD TO DIFFERENT DB AND DELETE FROM DATABASE CURRENT
        $("#accept_summary").click(function(){
            $.ajax({
                type: "POST",
                url: "/accept_summary/" + summaryid + "/"+ author_name + "/" + author_email + "/" + paper_title+ "/" + summary + "/" + date,
                dataType: "JSON", // data type expected from server
                success: function () {
                },
                error: function(err) {
                }
            });

            $.ajax({
                type: "POST",
                url: "/delete_summary/" + summaryid,
                dataType: "JSON", // data type expected from server
                success: function () {
                },
                error: function(err) {
                }
            });

            document.location.href = "/admin/summaries";
        });

        //IF DELETE BUTTON IS PRESSED REMOVE FROM DATABASE
        $("#delete_summary").click(function(){
            $.ajax({
                type: "POST",
                url: "/delete_summary/" + summaryid,
                dataType: "JSON", // data type expected from server
                success: function () {
                    window.location.href("/admin/summaries");
                },
                error: function(err) {
                }
                
            });
        });

    }

    

});