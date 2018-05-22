$(document).ready(function () {
    $('#email').blur(function () {
        $(this).css("border-color", "")
        var emailRegxp = /^([a-zA-Z0-9_.+-])+\@(([A-Za-z0-0-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!(emailRegxp.test($(this).val()))) {
            $('.error').text('請輸入有效的電子郵件');
            $(this).css("border-color", "red")
        } else {
            $('.error').text('');
        }
    })
    $('#mobile').blur(function () {
        $(this).css("border-color", "")
        var phone = /^09[0-9]{8}$/;
        if (!(phone.test($(this).val()))) {
            $('.error1').text('請輸入有效的手機號碼');
            $(this).css("border-color", "red")
        } else {
            $('.error1').text('');
        }
    })
})

//get資料庫   
var settings = {
    //async為false->同步；async為true->非同步
    "async": true,
    "crossDomain": true,
    //url(String):指定要進行呼叫的位址
    "url": "https://kuokuo0923-e094.restdb.io/rest/contact",
    "method": "GET",
    "headers": {
        "content-type": "application/json",
        "x-apikey": "5ab86334f0a7555103cea7ba",
        "cache-control": "no-cache"
    },
}
var i = 0;
$.ajax(settings).done(function (response) {
    var role = sessionStorage["role"];
    //var role = sessionStorage.getItem("role");
    console.log("role", role);

    $.each(response, function () {

        var source = $('#entry-template').html();
        var template = Handlebars.compile(source);
        var context = {
            "response": [{
                "id": response[i]._id,
                "name": response[i].name,
                "email": response[i].email,
                "mobile": response[i].mobile
            }]
        };

        var html = template(context);
        $("#contactList thead").append(html);


        if (role == "admin") {
            var $form = $("#addForm");
            $form.show();

            var $a = $("#contactList");
            $a.show();
        } else if (role == "viewer") {
            var $form = $("#addForm");
            $form.hide();

            var $a = $("#contactList");
            $a.show();

            $(".update").hide();
            $(".delete").hide();
        }
        i++;

    });
});

$("#add").click(function () {
    //$("#contactList").validate();
    //if ($("#contactList").valid()) {}


    var $contactName = $('#contactName').val();
    var $email = $('#email').val();
    var $mobile = $('#mobile').val();

    //清空input value
    $('#contactName').val("");
    $('#email').val("");
    $('#mobile').val("");

    //判斷輸入的欄位值不能為空值
    if ($contactName == '' || $email == '' || $mobile == '') {
        alert("提醒:\r\n資料輸入不全!");
        return false;
    }

    //驗證電子郵件
    var emailRegxp = /^([a-zA-Z0-9_.+-])+\@(([A-Za-z0-0-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!(emailRegxp.test($email))) {
        alert("請輸入有效的郵件地址");
        return false;
    }

    //驗證手機號碼
    //var phone = /^1[34578]\d{9}$/;
    var phone = /^09[0-9]{8}$/;
    if (!(phone.test($mobile))) {
        alert("請輸入有效的手機號碼");
        return false;
    }

    var data = $("<tr id='myTableRow'><td><input id='update' class='btn btn-info update' type='button' value='update' onclick='updateRow(this)'>&nbsp;<input id='delete' class='btn btn-danger delete' type='button' value='delete' onclick='deleteRow(this)'><input type='hidden' id='id' value='id'></td><td>" + $contactName + "</td><td>" + $email + "</td><td>" + $mobile + "</td></tr>");
    $('#contactList thead').append(data);

    //加入資料庫
    var jsondata = {
        "name": $contactName,
        "email": $email,
        "mobile": $mobile,
    };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://kuokuo0923-e094.restdb.io/rest/contact",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "5ab86334f0a7555103cea7ba",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata) //JSON.stringify為陣列轉字串
    }

    $.ajax(settings).done(function (response) {
        console.log(response);

    });
    console.log($contactName, $email, $mobile);
});

//刪除--方法二,記得在button裡加onclick='deleteRow(this)'
function deleteRow(btn) {
    //if (confirm("Are you sure want to delete thr row?"))
    $(btn).parents("tr").remove();

    //var ObjectID = $(btn).parent().find('input').val();
    var ObjectID = $(btn).parent().parent().find('td').eq(0).find('input:nth-child(3)').val();
    //var ObjectID = $(btn).closest('tr').find('td:first').text();
    console.log(ObjectID);

    //刪除資料庫
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://kuokuo0923-e094.restdb.io/rest/contact/" + (ObjectID),
        "method": "DELETE",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "5ab86334f0a7555103cea7ba",
            "cache-control": "no-cache"
        }
    }

    $.ajax(settings).done(function (response) {
        $(btn).parents("tr").remove();
        //重整網頁
        //location.reload();
        console.log(response);
    });
}

//按update進入修改
function updateRow(btn) {

    //get資料庫   
    var settings = {
        //async為false->同步；async為true->非同步
        "async": true,
        "crossDomain": true,
        //url(String):指定要進行呼叫的位址
        "url": "https://kuokuo0923-e094.restdb.io/rest/contact",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "5ab86334f0a7555103cea7ba",
            "cache-control": "no-cache"
        },
    }
    var i = 0;
    $.ajax(settings).done(function (response) {
        //取值顯示在input裡
        var $contactName = $(btn).parent().parent().find("td").eq(1).text();
        var $email = $(btn).parent().parent().find("td").eq(2).text();
        var $mobile = $(btn).parent().parent().find("td").eq(3).text();
        console.log($contactName, $email, $mobile);

        var data_update = $("<tr><td><input id='updateU' class='btn btn-info update' type='button' value='update' onclick='updateEnd(this)'><input type='hidden' id='id' value='" + response[i]._id + "'></td><td><input id='contactNameU' type='text' value='" + $contactName + "' name ='name' required></td><td><input id='emailU' type='email' value='" + $email + "' name ='email' required></td><td><input id='mobileU' type='text' value='" + $mobile + "' name ='mobile' required></td></tr>");
        $(btn).parents("tr").replaceWith(data_update); //為甚麼不能用.html()

        i++;
    });
}

//修改
function updateEnd(btn) {
    //取值
    var $contactNameUU = $('#contactNameU').val();
    var $emailUU = $('#emailU').val();
    var $mobileUU = $('#mobileU').val();

    //驗證空值
    if ($contactNameUU == '' || $emailUU == '' || $mobileUU == '') {
        alert("提醒:\r\n資料輸入不全!");
        return false;
    }

    //驗證電子郵件
    var emailRegxp = /^([a-zA-Z0-9_.+-])+\@(([A-Za-z0-0-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!(emailRegxp.test($emailUU))) {
        alert("請輸入有效的郵件地址");
        return false;
    }

    //驗證手機號碼
    //var phone = /^1[34578]\d{9}$/;
    var phone = /^09[0-9]{8}$/;
    if (!(phone.test($mobileUU))) {
        alert("請輸入有效的手機號碼");
        return false;
    }

    //put修改資料庫
    var ObjectID = $(btn).parent().parent().find('td').eq(0).find('input:nth-child(2)').val();
    console.log(ObjectID);

    var jsondata = {
        "name": $contactNameUU,
        "email": $emailUU,
        "mobile": $mobileUU,
    };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://kuokuo0923-e094.restdb.io/rest/contact/" + ObjectID,
        "method": "PUT",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "5ab86334f0a7555103cea7ba",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    }

    $.ajax(settings).done(function (response) {
        var data_update2 = $("<tr><td><input id='update' class='btn btn-info update' type='button' value='update' onclick='updateRow(this)'>&nbsp;<input id='delete' class='btn btn-danger delete' type='button' value='delete' onclick='deleteRow(this)'><input type='hidden' id='id' value='id'></td><td>" + $contactNameUU + "</td><td>" + $emailUU + "</td><td>" + $mobileUU + "</td></tr>");
        $(btn).parents("tr").replaceWith(data_update2);
        console.log($contactNameUU, $emailUU, $mobileUU);
        //重整網頁
        //location.reload();
        console.log(response);
    });
}