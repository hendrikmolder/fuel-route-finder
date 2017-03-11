// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
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
  .state('map', {
    url: '/',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
  });
 
  $urlRouterProvider.otherwise("/");
 
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};

  globalScope = $scope;

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var userCurrentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: userCurrentLocation,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var directionsService = new google.maps.DirectionsService();
 
    // add marker to current location
    add_marker_current_location($scope, userCurrentLocation);

    // calculate distance between current location and X
    calculate_path_distance_between(userCurrentLocation, 'Trafford Park', $scope, directionsService);

  }, function(error){
    console.log("Could not get location");
  });
});

var globalScope;

function add_marker_current_location($scope, userCurrentLocation){
  google.maps.event.addListenerOnce($scope.map, 'idle', function(){
   
    var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: userCurrentLocation
    });     
   
  });
}

function calculate_path_distance_between(latLngOrigin, latLngDestination, $scope, directionsService){

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