/**
 * Created by m2wasabi on 15/04/22.
 */
var pinArray ={'s_box_0':'17','s_box_1':'27','s_box_2':'22'};

ZGN(function()
{
    var isPlaying = false;


    // TerminalのGPIOインスタンスを取得します
    var gpio = ZGN.term('1').gpio;

    // 指定ピンを出力に設定
    $.each(pinArray,function(id,pin){
        gpio.pinMode(pin, ZGN.OUTPUT);
    });


    $("#btn_open").click(function(){
        if(isPlaying) return false;
        isPlaying = true;
        $("#btn_open").attr('disabled',"disabled").text("♪ ♪ ♪ 抽選中 ♪ ♪ ♪");


        var sound = $("#sound01");
        var treasures = $(".treasure_box");
        //console.log(treasures);
        var treasure_selected = 0;
        var treasure_mun = treasures.length;
        //var r = Math.random();
        //console.log(r);
        //sound[0].play();
        var interval =10;
        var lastvalue = selection(interval,sound);


        function selection(interval,sound){
            if(interval > 1000) return finish();
            // Advance Selection
            $(treasures[treasure_selected]).attr('data-selected',"false");
            treasure_selected++;
            if(treasure_selected >= treasure_mun) treasure_selected = 0;
            $(treasures[treasure_selected]).attr('data-selected',"true");

            // Play sound
            sound[0].play();
            var add = 1 + Math.random() * 0.2;
            interval = Math.floor(interval * add );
            console.log("Interval: " + interval);
            return setTimeout(function(){
                selection(interval,sound);
            },interval)

        }
        function finish(){
            var selected_box = $(treasures[treasure_selected]);
            var selected_id = selected_box.attr('id');
            gpio.digitalWrite(pinArray[selected_id], ZGN.HIGH);
            selected_box.attr('data-opened',1);
            setTimeout(function(){
                gpio.digitalWrite(pinArray[selected_id], ZGN.LOW);
                selected_box.attr('data-opened',2);
                alert(selected_box.attr('data-name') + "が開いた！");

            },200);


        }
    });
});

