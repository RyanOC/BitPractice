
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player, startTime, endTime, timeInterval, vid;
var bitStart = $("#startTime").val();
var bitEnd = $("#endTime").val();

function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
        height: '200',
        width: '300',
        videoId: $("#videoid").val(), //'2om9HkZ89G4',
        //'loop': 1,
        //'start': 25.5,
        //'end': 26,
        //'autoplay': 1,        
        events: {
            'onReady': onPlayerReady
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
    //player.setPlaybackRate(0.5);
    //startTime = convertTime('1:24.6');
    //endTime = convertTime('1:28.5');
    //alert(startTime + " - " + endTime);    
    player.seekTo(startTime);
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
    startTime = convertTime($("#startTime").val());
    endTime = convertTime($("#endTime").val());
    player.seekTo(startTime); //parseFloat($("#seekto").val()));
}

$(window).load(function () {
    //jQuery('#seek').click(function(){
    startTime = convertTime(bitStart);
    endTime = convertTime(bitEnd);
    player.seekTo(startTime); //parseFloat($("#seekto").val()));
    //player.setPlaybackRate(0.5); // 0.25, 0.5, 1, 1.5, and 2
    //return false;
    //});
});




$('.bitSelector').click(
    function (e) {
        e.preventDefault;
        $('.highlight').removeClass('highlight');
        $(this).addClass('highlight');
        var id = $(this).attr('id');
        var bitSpanDiv = $(this).html();

        $('input', bitSpanDiv).each(function (index) {

            console.log($(this).val());

            if (index % 2 == 0) {
                //bitStart = $(this).val().toString();
                console.log($(this).val());
                startTime = convertTime($(this).val());
            }
            else {
                //bitEnd = $(this).val().toString();   
                console.log($(this).val());
                endTime = convertTime($(this).val());
            }
        })

        player.seekTo(startTime);
    });


$(document).ready(function () {

    //$(".add-more").click(function () {
    //    //var html = $(".copy").html();
    //    var html = $(".copy").clone();
    //    //var result = $('input', html);

    //    $('input', html).each(function () {

    //        console.log($(this).val());

    //        $(this).val('0:00');

    //        if (bitCount % 2 == 0) {
    //            $(this).attr('id', 'end' + bitCount);
    //        }
    //        else {
    //            $(this).attr('id', 'start' + bitCount);
    //        }
    //        //arrNumber.push($(this).val());
    //        bitCount += 1;
    //    })
    //    // .appendTo
    //    //$(".after-add-more").after(html);

    //    html.appendTo(".after-add-more");
    //});

    //$("body").on("click", ".remove", function () {
    //    $(this).parents(".control-group").remove();
    //});
});