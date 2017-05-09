
//TODO: allow full youtube urls http://stackoverflow.com/a/8260383/1486716
//TODO: add play/pause button
//TODO: add default video

//Youtube api reference: https://developers.google.com/youtube/iframe_api_reference#Events

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player, startTime, endTime, timeInterval, vid;
var bitStart = '0:00'; //$("#startTime0").val();
var bitEnd = '0:00'; //$("#endTime0").val();
var currentBits;

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '200',
        width: '300',
        videoId: $("#videoid").val(),     
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function SetVideoId() {

    clearInterval(timeInterval);

    vid = $("#videoid").val();
    startTime = convertTime(bitStart);
    endTime = convertTime(bitEnd);

    timeInterval = setInterval(function () {
        GetTime();
    }, 0);

    player.cueVideoById(vid);
    player.seekTo(startTime);
    player.playVideo();
}

function onPlayerReady(event) {
    timeInterval = setInterval(function () {
        GetTime();
    }, 0);
    event.target.playVideo(); 
    player.seekTo(startTime);
}

function onPlayerStateChange(e) {

    //console.log(e);

    if (e.data == 1) {
        // 
    }
}

function GetTime() {
    currentTime = player.getCurrentTime();
    if (currentTime >= endTime) {
        player.seekTo(startTime);
    }

    var current = player.getCurrentTime();
    current = current.toFixed(2);
    $('#currentSeconds').html(current);
    var minutes = Math.floor(current / 60);
    var seconds = current % 60;
    seconds = parseFloat(seconds).toFixed(2);
    $('#currentTime').html(minutes + ":" + seconds);
}

function convertTime(input) {
    var parts = input.split(':'),
        minutes = +parts[0],
        seconds = +parts[1];
    return (minutes * 60 + seconds);
}

function reset() {
    window.location.hash = '';
    startTime = convertTime($("#startTime").val());
    endTime = convertTime($("#endTime").val());
    player.seekTo(startTime); //parseFloat($("#seekto").val()));
}

function LoadState() {

    var hash = window.location.hash.substr(1);

    // Decode the String
    var decodedString = Base64.decode(hash);
    console.log(decodedString);

    var formData = JSON.parse(decodedString);

    //console.log(formData);

    for (var i = 0, len = formData.length; i < len; i++) {

        var key = Object.keys(formData[i])[0];
        var value = Object.values(formData[i])[0];
        $("#" + key).val(value)
    }

    document.title = "BitPractice-" + $("#title").val();
}

function SaveState() {

    //TODO: save previous state in history https://developer.mozilla.org/en-US/docs/Web/API/History_API
    //var form1 = $("#form :input");

    document.title = "BitPractice-" + $("#title").val();

    var formData = [];

    $("#form :input").each(function (index) {
        var key = $(this).attr('id');
        formData.push({ [key]: $(this).val() });
    });

    //var form = { title: "Cool Video Title", videoId: "O8wwnhdkPE4", bits: [["2:00", "2:10"], ["3:00", "3:10"], ["4:00", "4:10"], ["5:00", "5:10"], ["6:00", "6:10"], ["7:00", "7:10"], ["8:00", "8:10"], ["9:00", "9:10"]] }
    //TODO: build object from form inputs

    // Encode the String
    var encodedString = Base64.encode(JSON.stringify(formData));

    setTimeout(function (e) {
        window.location.hash = e;
    }, 1, encodedString);

    //window.location.hash = '' + encodedString;
    //var hash = window.location.hash.substr(1);
    //console.log(hash);  
}

$(window).load(function () {
    startTime = convertTime(bitStart);
    endTime = convertTime(bitEnd);
    setTimeout(function (e) {
        player.seekTo(e);
        //player.setPlaybackRate(0.5); // 0.25, 0.5, 1, 1.5, and 2
    }, 1000, startTime); //HACK: Use an event to detect when player is ready to call seekTo
});

$('.save').click(
    function (e) {
        e.preventDefault;
        SaveState();
    });

$('.bitSelector').click(
    function (e) {
        e.preventDefault;
        var inputs = $(this).find("input");

        if ($(inputs[0]).val() == "0:00" && $(inputs[1]).val() == "0:00") {
            //TODO: alert user to choose a valid timespan
            return;
        }
        else {
            currentBits = $(this).find("input");
            startTime = convertTime($(currentBits[0]).val());
            endTime = convertTime($(currentBits[1]).val());
        }

        $('.highlight').removeClass('highlight');
        $(this).addClass('highlight');

        //toggle class: activeFont and inactiveFont on child div
        $('.activeStatus').removeClass('activeFont');
        $('.activeStatus').addClass('inactiveFont');
        $(this).find(".activeStatus").removeClass('inactiveFont');
        $(this).find(".activeStatus").addClass('activeFont');

        player.seekTo(startTime);
    });

$("#dropdownMenu2").on("click", "li a", function (e) {
    e.preventDefault;
    var speedText = $(this).text();
    $("#dropdown_title2").html(speedText);
    var speedData = $(this).data("speed");
    player.setPlaybackRate(speedData);  
});

$(document).ready(function () {
    $('input').on('click', function () {
        return false;
    });

    if (window.location.hash.substr(1).length > 0){
        LoadState();
        bitStart = $("#startTime0").val();
        bitEnd = $("#endTime0").val();
    }
});

function locationHashChanged() {
    if (window.location.hash.substr(1).length > 0) {
        LoadState();

        if (currentBits != null) {
            console.log(currentBits);
            bitStart = $(currentBits[0]).val();
            bitEnd = $(currentBits[1]).val();
        }
        else {
            bitStart = $("#startTime0").val();
            bitEnd = $("#endTime0").val();
        }

        //TODO: start video...

        SetVideoId();
    }
}

window.onhashchange = locationHashChanged;

var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}