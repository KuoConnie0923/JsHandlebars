$("#login").on('click', login);
$("#join").on('click', join);

console.log("aaa");

function login() {
    var $userId = $('#userId').val();
    var $password = $('#password').val();
    var $role = $('#role').val();
    //console.log($userId, $password, $role);

    if ($userId === "" || $password === "" || $role === "") {
        alert("資料輸入不全!");
    }

    //Get contactuser資料庫
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://kuokuo0923-e094.restdb.io/rest/contactuser",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "5ab86334f0a7555103cea7ba",
            "cache-control": "no-cache"
        }
    }

    var i = 0;
    $.ajax(settings).done(function (response) {
        $.each(response, function () {
            console.log($userId, $password, $role);
            console.log(response);

            if ($userId == response[i].userId && $password == response[i].password) {
                console.log("123", $userId, $password, $role);
                if ($role == "viewer") {
                    sessionStorage["role"] = $role;
                    $(location).attr('href', './web/index.html');
                } else if ($role == "admin") {
                    sessionStorage["role"] = $role;
                    $(location).attr('href', './web/index.html');
                }
            } 
            i++;
        });
    });
}

function join() {
    console.log("set up");
    var $userId = $('#userId').val();
    var $password = $('#password').val();
    var $role = $('#role').val();
    //post
    var jsondata = {
        "userId": $userId,
        "password": $password,
        "role": $role
    };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://kuokuo0923-e094.restdb.io/rest/contactuser",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "x-apikey": "5ab86334f0a7555103cea7ba",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
    }

    $.ajax(settings).done(function (response) {
        console.log(response);

        alert("已註冊成功!請再登入一遍");
    });

}