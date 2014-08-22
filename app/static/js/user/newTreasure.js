/* global google:true */
(function(){
  'use strict';

  $(document).ready(function(){
    $('#addHint').click(addHint);
    $('form').submit(addTreasure);
  });

  function addHint(){
    var $input = "<input id='hint' type='text' placeholder='Hint' name='hints' class='form-control'>";
    $('#hints').append($input);
  }

  function addTreasure(e){
    var lat = $('#locLat').val();
    if(!lat){
      var name = $('#locName').val();
      geocode(name);
      e.preventDefault();
    }
  }

  function geocode(address){
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: address}, function(results, status){
      var name = results[0].formatted_address,
           lat = results[0].geometry.location.lat(),
           lng = results[0].geometry.location.lng();
      $('#locLat').val(lat);
      $('#locLng').val(lng);
      $('#locName').val(name);

      console.log($('form').serialize());

      $('form').submit();
    });
  }
})();
