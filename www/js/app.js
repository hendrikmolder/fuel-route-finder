// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var globalScope;
var userCurrentLocation;
var directionsService;

angular.module('starter', ['ionic'])
// require ngCordova
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
    .state('landing', {
      url: '/',
      templateUrl: 'templates/landing.html',
    })
    .state('map', {
      url: '/map',
      templateUrl: 'templates/map.html',
      controller: 'MapCtrl',
    })
 
  $urlRouterProvider.otherwise("/");
 
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};
 
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    userCurrentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: userCurrentLocation,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // init direction service
    directionsService = new google.maps.DirectionsService();

    ///////////////////////////////////////////////////////////////////////
    // all functions must be called asynchronously (after gmaps API loaded)
    do_setup();


  }, function(error){
    console.log("Could not get location");
  });
})

function add_marker_at_location(location){
  google.maps.event.addListenerOnce(globalScope.map, 'idle', function(){
   
    var marker = new google.maps.Marker({
        map: globalScope.map,
        animation: google.maps.Animation.DROP,
        position: location
    });     
   
  });
}

function calculate_path_distance_between(latLngOrigin, latLngDestination, directionsService){

  // request dict to pass to directionService
  var request = {
                // latLng of users current location
    origin      : latLngOrigin, // a city, full address, landmark etc
    destination : latLngDestination,
    travelMode  : google.maps.DirectionsTravelMode.DRIVING
  };
  
  directionsService.route(request, function(response, status) {
    if ( status == google.maps.DirectionsStatus.OK ) {
      // distance in metres
      console.log(response.routes[0].legs[0].distance.value);
    }
    else {
      console.log("Error calling calculate_path_distance_between().");
    }
  });

}

// A method to create a marker on the position of a given place
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
  map: globalScope.map,
  position: place.geometry.location 
  });
}

// A method to search for places 
function search(currentLocation, radius, placeType){
  var service = new google.maps.places.PlacesService(globalScope.map);

  // The specifications for the search
  var request = {
    location: currentLocation,
    radius: radius,
     type: [placeType]
  };

  // Perform the search
  service.nearbySearch(request, callback);

  // A method to deal with the results of the search
  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {

      console.log("Callback: Number of results - " + results.length);
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  }
}

function do_setup(){
// add marker to current location
add_marker_at_location(userCurrentLocation);

// calculate distance between current location and X
calculate_path_distance_between(userCurrentLocation, 'Trafford Park', directionsService);

// Test for search
search(userCurrentLocation, 5000, 'gas_station');
}