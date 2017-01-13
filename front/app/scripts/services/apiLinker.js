'use strict';

angular.module('frontApp')
	.service("apiLinker", function($http){

  //config
  //url of the ws server
  var baseUrl = "http://localhost:8080";

  this.getAllReviews = function () {
  	return $http.get(baseUrl+"/review/")
    	 .then(function(response) {
            return response.data;
    });
  };

  this.getReview = function (review) {
  	$http.get(baseUrl+"/review/"+review.id)
    	 .then(function(response) {
            return response.data;
    });
  };

  this.insertReview = function (review) {
  	return $http.post(baseUrl+"/review/", review)
    	 .then(function(response) {
        
    });
  };

  this.deleteReview = function (review) {
  	return $http.delete(baseUrl+"/review/"+review.id, review)
    	 .then(function(response) {
            //do smthg
    });
  };

  this.updateReview = function (review) {
  	return $http.put(baseUrl+"/review/"+review.id, review)
    	 .then(function(response) {
            //do smthg
    });
  };

  this.updateOrder = function(reviews){
      $http.put(baseUrl+"/review/", reviews)
       .then(function(response) {
            //do smthg
    });
  }

});

