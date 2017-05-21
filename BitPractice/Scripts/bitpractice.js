
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

    try {
        current = current.toFixed(2);
    }
    catch (ex) {
        console.log(ex);
    }

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
    var BitPracticeModel = decodeURI(hash);
    BitPracticeModel = JSON.parse(BitPracticeModel);

    console.log(BitPracticeModel);

    //get t & v from querystring...
    $("#title").val(getParameterByName('t'));
    $("#videoid").val(getParameterByName('v'));

    for (var property in BitPracticeModel) {
        if (BitPracticeModel.hasOwnProperty(property)) {
            if (property != undefined) {
                $("#" + property).val(BitPracticeModel[property]);
            }      
        }
    }

    document.title = "BitPractice-" + $("#title").val();
}

function SaveState() {

    //TODO: save previous state in history https://developer.mozilla.org/en-US/docs/Web/API/History_API

    document.title = "BitPractice-" + $("#title").val();

    var BitPracticeModel = {};

    var title = $("#title").val();
    var vid = $("#videoid").val();

    $("#bitTimes :input").each(function (index) {
        var key = $(this).attr('id');
        if (key != undefined) {
            if ($(this).val() != "0:00") {
                BitPracticeModel[key] = $(this).val();
            }
        }        
    });

    var json = encodeURI(JSON.stringify(BitPracticeModel));

    json = json.replace(/%7B/g, '{')
    json = json.replace(/%7D/g, '}')

    setTimeout(function (e) {
        window.location.hash = e;
    }, 1, json);


    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?v=' + vid + '&t=' + title;
    window.history.pushState({ path: newurl }, '', newurl);
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
        bitStart = $("#s0").val();
        bitEnd = $("#e0").val();
    }
});

function locationHashChanged() {
    if (window.location.hash.substr(1).length > 0) {
        LoadState();

        if (currentBits != null) {
            //console.log(currentBits);
            bitStart = $(currentBits[0]).val();
            bitEnd = $(currentBits[1]).val();
        }
        else {
            bitStart = $("#s0").val();
            bitEnd = $("#e0").val();
        }

        //TODO: start video...

        SetVideoId();
    }
}

window.onhashchange = locationHashChanged;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}