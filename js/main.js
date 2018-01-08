$(window).on("load",function(){

});
Date.prototype.addHours = function(h) {
   this.setTime(this.getTime() + (h*60*60*1000));
   return this;
}

function makeTimeClimateChanges(){
  $.getJSON('//freegeoip.net/json/?callback=?', function(dataLocation) {
    let locationData = JSON.stringify(dataLocation, null, 2)
    $.getJSON('//api.openweathermap.org/data/2.5/weather?lat='+ dataLocation.latitude+'&lon='+ dataLocation.longitude +'&APPID=dca3bdf26ddbcbd2c250a040654956b3', function(dataWeather) {
      let currentCondition = dataWeather.weather[0].main;
      let currentDate = (new Date());
      let skyBrightness = (currentDate.getHours() >= 6 && currentDate.getHours() <= 17 ? 1:0.6 );
      let skyHue = (currentDate.getHours() >= 6 && currentDate.getHours() <= 17 ? 0:25 );
      let sunColor = (currentDate.getHours() >= 6 && currentDate.getHours() <= 17 ? 1: -1);
      let sunInvert = (currentDate.getHours() >= 6 && currentDate.getHours() <= 17 ? 0: 0.7);
      let sunPosition = (currentDate.getHours() >= 6 && currentDate.getHours() <= 17 ? 5: 80);
      $(".presentation-sun").attr("style","filter:brightness("+sunColor+") invert("+sunInvert+") ; right:"+sunPosition + "%");
      if(currentCondition=="Rain" || currentCondition=="Drizzle" || currentCondition=="Thunderstorm"  ){
        $("#presentation-sky").attr("style","background: #276190; filter:brightness("+ skyBrightness+") hue-rotate("+ skyHue+"deg)");
        new Rain('presentation-sky', {
          speed: (1000 / dataWeather.wind.speed),
          angle: dataWeather.wind.deg,
          intensity: (dataWeather.main.humidity / 100),
          size: 10,
          color: '#fff'
        });
        if(!$(".presentation-sun").hasClass("hide3"))
          $(".presentation-sun").toggleClass("hide3");
        if(!$(".presentation-cloud.left").hasClass("hide3")){
          $(".presentation-cloud.left").toggleClass("hide3");
          $(".presentation-cloud.right").toggleClass("hide3");
        }
      }
      else if(currentCondition=="Clear"){
        $(".presentation-sun").toggleClass("hide3");
        if($(".presentation-sun").hasClass("hide3"))
          $(".presentation-sun").toggleClass("hide3");
        if(!$(".presentation-cloud.left").hasClass("hide3")){
          $(".presentation-cloud.left").toggleClass("hide3");
          $(".presentation-cloud.right").toggleClass("hide3");
        }
        $("#presentation-sky").attr("style","background: #008eff; filter:brightness("+ skyBrightness+") hue-rotate("+ skyHue+"deg)");
      }
      else if (currentCondition=="Clouds"){
        $("#presentation-sky").attr("style","background: #2196F3; filter:brightness("+ skyBrightness+") hue-rotate("+ skyHue+"deg)");
        if($(".presentation-sun").hasClass("hide3"))
          $(".presentation-sun").toggleClass("hide3");
        if($(".presentation-cloud.left").hasClass("hide3")){
          $(".presentation-cloud.left").toggleClass("hide3");
          $(".presentation-cloud.right").toggleClass("hide3");
        }

      }

    });
  });
}
makeTimeClimateChanges();
var intervalClimate = setInterval(function(){
  makeTimeClimateChanges();
}, (60000 * 10));
