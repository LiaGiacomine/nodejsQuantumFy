/*
Makes Ajax call to script which connects with db to
return the information on the specified committee

Author: Liandra Giacomine
*/

$(document).ready(function(){
    //Get the name of the paper that was clicked
    var url = window.location.href;
    var end_of_str = url.length;
    committee = url.slice(url.indexOf("/individual/") + 12, end_of_str);
    committee = committee.replace(/%20/g, " ");
    
    //Get comments for table from ajax call which will return
    //all the data about the paper to be outputted 
    addToPage(committee)


    function addToPage(committee){

        // row_count = 0;


        // while (row_count != comment_count) {
        $("#committee_title").html(committee);
        $("#committee_members").html("Members: ");



        //member = data["Data"][row_count]["username"];
        //date_added = data["Data"][row_count]["date_added"];
          
    }
    

});