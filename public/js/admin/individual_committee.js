/*
    Adds blogs to page from database
    Author: Liandra Giacomine
*/

$(document).ready(function(){
    //Get comments for table from ajax call which will return
    //all the comments where paper_id equals this paper_id
    //AND EVENTUALLY USER WHO COMMENTED

    var url = window.location.href;
    var end_of_str = url.length;
    committee_name_id = url.slice(url.indexOf("/manage_committee/") + 18, end_of_str);
    committee_name = committee_name_id.slice(0,committee_name_id.indexOf("/"));
    committee_id = committee_name_id.slice(committee_name_id.indexOf("/")+1, end_of_str);
    $.ajax({
        type: "GET",
        url: "/user_list",
        dataType: "JSON", // data type expected from server
        success: function () {
            //Call function to add paper returned to page
        },
        error: function(err) {
            console.log('Error: ' + err);
        }
    }).done(function(data){
        if (data["Data"] != "No data Found.."){
            user_count = Object.keys(data["Data"]).length;
            getListofAllMembers(data, user_count);
        }
    });

    $.ajax({
        type: "GET",
        url: "/committee/members/" + committee_id,
        dataType: "JSON", // data type expected from server
        success: function () {
            //Call function to add paper returned to page
        },
        error: function(err) {
            console.log('Error: ' + err);
        }
    }).done(function(data){
        if (data["Data"] != "No data Found.."){
            user_count = Object.keys(data["Data"]).length;
            getCommitteeMembers(data, user_count);
        }
    });

    function getListofAllMembers(data, user_count){
     
        var member_list = document.getElementById("all_members");
        
        for (i=0;i<user_count;i++){
            var option = document.createElement("OPTION");
            member = data["Data"][i]["username"];
            member_node = document.createTextNode(member);
            option.appendChild(member_node);
            member_list.appendChild(option);
        }
    }

    function getCommitteeMembers(data, user_count){
        
           var member_list = document.getElementById("committee_members");
           
           for (i=0;i<user_count;i++){
               var li = document.createElement("LI");
               member = data["Data"][i]["username"];
               member_node = document.createTextNode(member);
               li.appendChild(member_node);
               member_list.appendChild(li);
           }
       }

});