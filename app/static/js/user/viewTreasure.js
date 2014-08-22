/* global google:true */

(function(){
  'use strict';

  var map,
      directionsDisplay;

  $(document).ready(function(){
    directionsDisplay = new google.maps.DirectionsRenderer();
    var lat = parseFloat($('#data').attr('data-lat')),
        lng = parseFloat($('#data').attr('data-lng'));
    initMap(lat,lng,9);
  });

  function initMap(lat, lng, zoom){
    var styles     =[{'stylers':[{'hue':'#ff8800'},{'gamma':0.4}]}],
        mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styles, icon:'/img/shovel.gif'};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

})();
