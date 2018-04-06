/*
    Adds admin users to QuantumFy
    Author: Liandra Giacomine
*/

$(document).ready(function(){
    //Get list of users
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

    //Get list of admin
    $.ajax({
        type: "GET",
        url: "/admin_list",
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
            addAdminMembers(data, user_count);
        }
    });


    function getListofAllMembers(data, user_count){
     
        var member_list = document.getElementById("all_members");

        for (i=0;i<user_count;i++){
            var option = document.createElement("OPTION");
            member = data["Data"][i]["email"];
            member_node = document.createTextNode(member);
            option.appendChild(member_node);
            member_list.appendChild(option);
        }
    }

    function addAdminMembers(data, user_count){
        
           var admin_list = document.getElementById("admin_member_list");
           
           for (i=0;i<user_count;i++){
               var li = document.createElement("LI");
               member = data["Data"][i]["username"];
               member_node = document.createTextNode(member);
               li.appendChild(member_node);
               admin_list.appendChild(li);
           }
       }

});