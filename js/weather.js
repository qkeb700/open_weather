$(function(){
  let vicon = wicon("11n");
  let myLat = 0, myLng = 0;
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myLat = position.coords.latitude;
      myLng = position.coords.longitude;
      getWeather(myLat, myLng, '');
    })
  }

  // 요일 배열
  let weeks = ["일", "월", "화", "수", "목", "금", "토"];
  let allUrl = "http://api.openweathermap.org/data/2.5/forecast?";
  
  function getWeather(lat, lon, city) {
    let mydata;
    if(city==''){
      mydata = {
        lat: lat,
        lon: lon,
        appid: "0bc036367add64f728d5da1bbf17cd35", 
        units: "metric", 
        lang: "kr"
      };
    }else{
      mydata = {
        q: city,
        appid: "0bc036367add64f728d5da1bbf17cd35", 
        units: "metric", 
        lang: "kr"
      };
    }
    $.ajax({
      url: allUrl,
      dataType: "json",
      type: "GET",
      data: {lat: lat, lon: lon, q: city, appid: "0bc036367add64f728d5da1bbf17cd35", units: "metric", lang: "kr"},
      success: function(rs) {
        console.log(rs);

        // 일출,일몰 시간
        let sunrise = rs.city.sunrise;
        sunrise = new Date(sunrise*1000);
        sunrise = gTime(sunrise.getHours())+"시 " + gTime(sunrise.getMinutes()) + "분";
        let sunset = rs.city.sunset;
        sunset = new Date(sunset*1000);
        sunset = gTime(sunset.getHours())+"시 " + gTime(sunset.getMinutes()) + "분";
        
        //화면에 출력
        $('.sunrisein').text(sunrise);
        $('.sunsetin').text(sunset);
        //현재 바람
        $('.windin').text(rs.list[0].wind.speed + "hPa");
        // 현재 습도
        $('.humidityin').text(rs.list[0].main.humidity + "%");
        // 현재 온도
        let nowTemp = rs.list[0].main.temp;
        nowTemp = nowTemp.toFixed(1);
        $('.temp').text(nowTemp + "℃");
        // 도시명
        $('.city').text(rs.city.name);
        // 날씨 설명
        $('.description').text(rs.list[0].weather[0].description);
        // 아이콘
        let icon = wicon(rs.list[0].weather[0].icon);
        $('.temp-icon>i').removeClass().addClass('wi ' + icon);
        let str = "";
        for(let i = 1; i < rs.list.length; i++) {
          //날짜
          let fTime = new Date(rs.list[i].dt*1000);
          let icon = wicon(rs.list[i].weather[0].icon);
          let des = rs.list[i].weather[0].description;
          let temp = rs.list[i].main.temp;
          temp = temp.toFixed(1);
          str += '<div class="weeks">';
          str += '<ul class="weeks-box">';
          str += '<li class="w-day">'+ fTime.getDate()+'('+ weeks[fTime.getDay()]+') '+ fTime.getHours()+'시'+'</li>';
          str += '<li class="w-icon"><i class="wi '+icon[0]+'"></i></li>';
          str += '<li class="w-weather">'+des+'</li>';
          str += '<li class="w-temp">'+gTime(temp)+'<i class="wi wi-degrees"></i>C</li>';
          str += '</ul>';
          str += '</div>';
        }
        $('.w-slider').html(str);
      }, /*beforeSend: function(){
        $('.loading').fadeIn();
      },*/ complete:function() {
        $('.loading').fadeOut();
        $('.w-slider').slick({
          slidesToShow: 2,
          slidesToscroll: 2,
          arrows: false,
          dots: false, 
          centerMode: true,
          autoplay: true,
          autoplaySpeed: 3000
        });
      }
    });
  }

  $('.weatherbox').slick({
    slidesToShow: 3,
    slidesToscroll: 2,
    arrows: false,
    dots: false,
    autoplay: true,
    autoplaySpeed: 3000
  })

  $('.fa-search').click(function(){
    let reset = $('.search-nav').css('left');
    if(reset == '0px'){
      $('.search-nav').animate({
        left: '-250px',
        opacity: 0
      })
    } else {
      $('.search-nav').animate({
        left: '0px',
        opacity: 1
      })
    }
    $('.close').click(function(){
      $('.search-nav').animate({
        left: '-250px'
      });
    });
    $('#searchinput').focus();
    $('#searchinput').on('blur keyup', function(){
      $(this).val($(this).val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ''));
    })
    $('#searchinput').on('keypress', function(event){
      if(event.keyCode == 13) {
        let q = $(this).val();
        $('.search-nav').animate({
          left: '-250px',
          opacity: 0
        });
        $('.w-slider').slick('unslick');
        getWeather('', '', q);
      }
    }); 
  })
});




function gTime(t) {
  t = Number(t);
  if(t < 12) {
    t = "0" + t;
  }
  return t;
}


function wicon(icon) {
  let wcs;
  let bk = false;
  let viewIcon = new Array();
  switch(icon) {
    case "01d":
      wcs= "wi-day-sunny";
    break;
    case "02d":
      wcs= "wi-day-cloudy";
    break;
    case "03d":
      wcs= "wi-cloud";
    break;
    case "04d":
      wcs= "wi-cloudy";
    break;
    case "09d":
      wcs= "wi-showers";
    break;
    case "10d":
      wcs= "wi-rain";
    break;
    case "11d":
      wcs= "wi-thunderstorm";
    break;
    case "13d":
      wcs= "wi-snowflake-cold";
    break;
    case "50d":
      wcs= "wi-fog";
    break;
    case "01n":
      wcs= "wi-night-clear";
      bk = true;
    break;
    case "02n":
      wcs= "wi-night-alt-cloudy";
      bk = true;
    break;
    case "03n":
      wcs= "wi-cloud";
      bk = true;
    break;
    case "04n":
      wcs= "wi-cloudy";
      bk = true;
    break;
    case "09n":
      wcs= "wi-showers";
      bk = true;
    break;
    case "10n":
      wcs= "wi-rain";
      bk = true;
    break;
    case "11n":
      wcs= "wi-thunderstorm";
      bk = true;
    break;
    case "13n":
      wcs= "wi-snowflake-cold";
      bk = true;
    break;
    case "50n":
      wcs= "wi-fog";
      bk = true;
    break;
  }
  viewIcon[0] = wcs;
  if(bk) {
    viewIcon[1] = "linear-gradient(rgb(7,99,168), rgb(5, 47,80))";
  }
  return viewIcon;
}