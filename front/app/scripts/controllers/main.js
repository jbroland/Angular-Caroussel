'use strict';

angular.module('frontApp')
  .controller('MainCtrl', ['$scope', 'apiLinker', '$window', function ($scope, apiLinker, $window) {

  	//init datas
  	apiLinker.getAllReviews().then(function(data){
        $scope.reviews = data;
	});

	//display or hise the dialog box
  	$scope.modalShown = false;

  	//review currently displayed in the dialog box
  	$scope.currentReview;

  	//selected review in slider
	$scope.sliderCursor = 0;

	//position of the selected div (by the slider)
	var leftValue = $window.innerWidth * 20 /100;
	var reviewSize = 402;

	//string representation of leftValue parameter
	$scope.sliderLeftValue = leftValue+"px";


/*************** FUNCTIONS *********************/

	//change cursor value, and compute slider's left value
	$scope.changeCursor = function(index){
		var old = $scope.sliderCursor;

		$scope.sliderCursor =  index;
		console.log(leftValue);
		leftValue += reviewSize*(old - index);
		$scope.sliderLeftValue = leftValue+"px";
	}

	//hide or display the dialog box
	$scope.toggleModal = function(review) {
    	if(!review){
    		review = {};
    	}
        $scope.modalShown = !$scope.modalShown;
        $scope.currentReview = review;
    };

/*	function replaceReviews(){
		leftValue = $window.innerWidth;
		$scope.sliderLeftValue = leftValue * $scope.sliderCursor + "px";
	}

	$scope.$watch($window.innerWidth, replaceReviews);*/




}]);
