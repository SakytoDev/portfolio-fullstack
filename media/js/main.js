const socket = io()

var account = null

var profileList
var authBtn
var avatarBtn

var menuList
var mainMenu

var chatMenu

var memberPrefab
var onlineList

var msgPrefab
var messagesList
var msgInput
var authToSendBlur

var notification
var getNotification

$(document).ready(function() {
    profileList = document.getElementById("profileList")
    authBtn = document.getElementById("authBtn")
    avatarBtn = document.getElementById("avatarBtn")

    menuList = document.getElementById("menuList")
    mainMenu = document.getElementById("mainMenu")
    
    chatMenu = document.getElementById("chatMenu")
    
    memberPrefab = document.getElementById("memberObj")
    onlineList = document.getElementById("onlineList")
    
    msgPrefab = document.getElementById("messageObj")
    messagesList = document.getElementById("messagesList")
    msgInput = document.getElementById("msgInput")
    authToSendBlur = document.getElementById("authToSendBlur")

    notification = document.getElementById("Notification")
    getNotification = bootstrap.Toast.getOrCreateInstance(notification)

    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $("#msgInput").on("keypress", function(e) {
        if (e.keyCode == 13) {
            sendMessage()
        }
    })

    $.ajax({
        url: '/version/windows',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            document.getElementById("windowsVersion").innerHTML = "Версия: " + data.version
        }
    })

    socket.on('chatMessage', function(data) {
        var messageObj = msgPrefab.cloneNode(true)

        messageObj.querySelector("#nickname").textContent = data.nickname
        messageObj.querySelector("#message").textContent = data.message
        messageObj.querySelector("#date").textContent = data.sendDate

        messagesList.appendChild(messageObj)
    })

    socket.on('onlineList', function(data) {
        onlineList.innerHTML = ""

        data.forEach(function(value) {
            var memberObj = memberPrefab.cloneNode(true)
            memberObj.querySelector("#nickname").textContent = value
            onlineList.appendChild(memberObj)
        })
    })

    onlineList.innerHTML = ""
    messagesList.innerHTML = ""

    updateAccountInfo()
})

function updateAccountInfo() {
    profileList.innerHTML = ""

    $.ajax({
        url: '/request',
        method: 'GET',
        dataType: 'json',
        data: {
            type: 'getAcc'
        },
        success: function(data) {
            if (data.code === "success") {
                account = { "id": data.account.id, "logoutToken": data.account.logoutToken }

                socket.emit('authUpdate', { "id": account.id })

                var _avatarBtn = avatarBtn.cloneNode(true)
                profileList.appendChild(_avatarBtn)

                $('#authToSendBlur').remove()
            }
            else if (data.code === "failure") {
                var _authBtn = authBtn.cloneNode(true)
                profileList.appendChild(_authBtn)

                if ($('#sendPanel').find('#authToSendBlur').length == 0) {
                    $('#sendPanel').append(authToSendBlur.cloneNode(true))
                }
            }
        }
    })
}

function loginAccount() {
    var formLogin = $("#postLoginInfo").serializeArray()

    if (!formLogin[0].value) {
        showNotification("Ошибка", "Введите никнейм")
        return
    }

    if (!formLogin[1].value) {
        showNotification("Ошибка", "Введите пароль")
        return
    }

    $.ajax({
        url: '/request',
        method: 'GET',
        dataType: 'json',
        data: {
            type: 'accLogin',
            form: formLogin
        },
        success: function(data) {
            if (data.code === "success") {
                updateAccountInfo()

                showNotification("Авторизация успешна", "Добро пожаловать в систему!")

                var _authModal = bootstrap.Modal.getInstance(document.querySelector('#authModal'))
                _authModal.hide()
            }
            else if (data.code === "failure") {
                showNotification("Ошибка", data.reason)
            }
        }
    })
}

function regAccount() {
    var formReg = $("#postRegInfo").serializeArray()

    if (!formReg[0].value) {
        showNotification("Ошибка", "Введите почту")
        return
    }

    if (!formReg[1].value) {
        showNotification("Ошибка", "Введите никнейм")
        return
    }

    if (!formReg[2].value) {
        showNotification("Ошибка", "Введите пароль")
        return
    }

    $.ajax({
        url: '/request',
        method: 'GET',
        dataType: 'json',
        data: {
            type: 'accReg',
            form: formReg
        },
        success: function(data) {
            if (data.code === "success") {
                updateAccountInfo()

                showNotification("Регистрация успешна", "Добро пожаловать в систему!")

                var _authModal = bootstrap.Modal.getInstance(document.querySelector('#authModal'))
                _authModal.hide()
            }
            else if (data.code === "failure") {
                showNotification("Ошибка", data.reason)
            }
        }
    })
}

function logoutAccount() {
    $.ajax({
        url: '/request',
        method: 'GET',
        dataType: 'json',
        data: {
            type: 'accLogout',
            token: account.logoutToken
        },
        success: function(data)
        {
            if (data.code === "success") {
                account = null

                updateAccountInfo()
            }
            else if (data.code === "failure") {
                showNotification("Ошибка", data.reason)
            }
        }
    })
}

function sendMessage() {
    if ((account && account != null) && msgInput.value)
    {
        socket.emit('chatMessage', { "id": account.id, "message": msgInput.value })
        msgInput.value = ''
    }
}

function openMenu(menuName) {
    if (menuName == 'chatMenu') {
        $("#mainMenu").addClass('hide')
        $("#chatMenu").removeClass('hide')
    }
    else {
        $("#mainMenu").removeClass('hide')
        $("#chatMenu").addClass('hide')
    }
}

function showNotification(header, message) {
    $("#NotificationHeader").html(header)
    $("#NotificationMessage").html(message)
    getNotification.show()
}