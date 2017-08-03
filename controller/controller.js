// Code goes here

(function(){
  
  'use strict';
  
  var app = angular.module('myApp',[]);
  app.controller('myCtrl',myFunc);
  myFunc.$inject = ['$scope'];
  
  function myFunc($scope){
    
    $scope.getFunc = function (){
      
    var map, marker,flightPath;
    //SVG of the car symbol
    var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
    var icon = {
                  path: car,
                  scale: .7,
                  strokeColor: 'white',
                  strokeWeight: .10,
                  fillOpacity: 1,
                  fillColor: 'Red',
                  offset: '5%',
                  anchor: new google.maps.Point(10, 25) 
                 };
                 
      var startPos = [47.631619, -122.132378,"movement"];
      var locations =[[47.631619, -122.132378,"movement"], [47.631533, -122.143064,"movement"],
            [47.627888, -122.143107,"one"],
            [47.627946, -122.132421,"two"],
            [47.629841,-122.132335,"three"]
            ];
            
     
      var drc1 =[ {lat:47.631619,lng: -122.132378} ,
                  {lat:47.631533,lng: -122.143064},
            {lat:47.627888, lng:-122.143107},
            {lat:47.627946, lng:-122.132421},
            {lat:47.629841,lng:-122.132335}
            ];
            
    //show the route from the locations 
       flightPath = new google.maps.Polyline({
          path: drc1,
          geodesic: true,
          strokeColor: 'LightBlue',
          strokeOpacity: 2.0,
          strokeWeight: 7
        });
      
      var markers = [];
      var speed = 20;
      var delay = 100;
             
  //Loading the map           
        var myOptions = {
        zoom: 16,
        center: new google.maps.LatLng(42.425175091823974, -83.2943058013916),
        mapTypeId: google.maps.MapTypeId.ROADMAP
           };
    
         map = new google.maps.Map(document.getElementById("map"),myOptions);
  
  //set the marker for all position in drc
        angular.forEach( locations,function(k){
          setMarker(map,new google.maps.LatLng(k[0],k[1]),k[2]);
        });
        
      flightPath.setMap(map);
 
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(startPos[0], startPos[1]),
        map: map,
        icon:icon
    });
    
  
  function init(){ 
  google.maps.event.addListenerOnce(map, 'idle', function()
    {
        animateMarker(marker,locations, speed);
    });
  }
  
  init();
   
   function animateMarker(marker, coords, km_h){
    var target = 0;
    var km_h = km_h || 80;
     coords.push([startPos[0], startPos[1]]);
    
    goToPoint();
    
    function goToPoint()
    {
        var lat = marker.position.lat();
        var lng = marker.position.lng();
        var step = (km_h * 10000 * delay) / 3600000; // in meters
      
        var dest = new google.maps.LatLng(coords[target][0], coords[target][1]);
    
        var distance = google.maps.geometry.spherical.computeDistanceBetween(dest,marker.position);
     
        
        var numStep = distance / step;
        var i = 0;
        var deltaLat = (coords[target][0] - lat) / numStep;
        var deltaLng = (coords[target][1] - lng) / numStep;
        
        function moveMarker() {
            lat += deltaLat;
            lng += deltaLng;
           
            i += step;
            
            if (i < distance)
            {    
                var p = new google.maps.LatLng(lat,lng);
                map.panTo(p);
                var lastPosn = marker.getPosition();
                var heading = google.maps.geometry.spherical.computeHeading(lastPosn,p);
                icon.rotation = heading;
                map.setHeading=heading,
                map.setCenter(marker.getPosition());
               
                marker.setIcon(icon);
                marker.setPosition(new google.maps.LatLng(lat, lng));
                setTimeout(moveMarker, delay);
                map.setZoom(17);
                
                
            }
            else
            
            {   marker.setPosition(dest);
                target++;
                
                
                if (target == coords.length){ target = 0; }
                
                setTimeout(goToPoint, delay);
                
            }
        }
        moveMarker();
    }
   
}
    function setMarker(map, position, title, content) {
           
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array
        }
    
    
    }
  }
})();