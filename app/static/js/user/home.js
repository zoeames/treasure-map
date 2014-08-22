/* global google:true, _:true*/

(function(){
  'use strict';

  var map,
      directionsDisplay;

  $(document).ready(function(){
    directionsDisplay = new google.maps.DirectionsRenderer();
    initMap(39.82,-98.58,4);
    directionsDisplay.setMap(map);
    var locations = getLocations();
    calcRoute(locations);
  });

  function initMap(lat, lng, zoom){
    var styles     =[{'stylers':[{'hue':'#ff8800'},{'gamma':0.4}]}],
        mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles:styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function getLocations(){
    var locations = $('table tbody tr').toArray().map(function(o){
      var loc = {};
      loc.name = $(o).attr('data-name');
      loc.lat = parseFloat($(o).attr('data-lat'));
      loc.lng = parseFloat($(o).attr('data-lng'));
      loc.order = parseInt($(o).attr('data-order'));
      return loc;
    });
    return locations;
  }

  function calcRoute(locs){
    var directionsService = new google.maps.DirectionsService(),
        start             = _.min(locs, 'order'),
        end               = _.max(locs, 'order'),
        waypts            = _.cloneDeep(locs);

    // remove start from locations
    _.remove(waypts, function(point){
      return point.order === start.order;
    });
    // remove end from locations
    _.remove(waypts, function(point){
      return point.order === end.order;
    });
    // sort waypts based on order
    waypts.sort(function(a,b){
      return a.order - b.order;
    });
    //convert points to waypoints
    waypts = waypts.map(function(p){
      return {location:p.name, stopover:true};
    });
    // create request object
    var request = {
      origin: start.name,
      destination: end.name,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };
    //debugger;
    directionsService.route(request, function(response, status){
      //debugger;
      if (status === google.maps.DirectionsStatus.OK){
        directionsDisplay.setDirections(response);
      }else{
        alert('Driving directions not available. Is your treasure on different continents?');
      }
    });
  }
})();
