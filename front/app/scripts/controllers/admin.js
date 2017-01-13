'use strict';

angular.module('frontApp')
  .controller('AdminCtrl', ['$scope', '$rootScope', 'apiLinker', function ($scope, $rootScope, apiLinker) {

    //is the popup displayed or not
    $scope.modalShown = false;

    //is the error message in the pop up displayed
    $scope.modalError = false;

    //save the review actually displayed on the pop up
    $scope.currentReview;

    //save all reviews
    $scope.reviews = [];

/***************** FUNCTIONS **********************/

    //used to refresh de reviews array
    var refreshReviews = function(){
  		apiLinker.getAllReviews().then(function(data){
            $scope.reviews = data;
    	});
    }

    //generate a new id for a new review
    var getNewId = function(){
        var id = -1;
        for(var i=0; i<$scope.reviews.length; i++){
            id = ($scope.reviews[i].id > id)?$scope.reviews[i].id:id;
        }
        return id+1;
    }

    //move the elt at depIndex to arrIndex, and move all elts between
    var moveOnArray = function(array, depIndex, arrIndex){
        var el = array[depIndex];
        for(var i = depIndex; i!=arrIndex; ){

            var next = (depIndex-arrIndex > 0)?i-1:i+1;
            array[i] = array[next];
            
            i = next;
        }
        array[arrIndex] = el;
    }

    //hide/show dialog boxfor editing a review
    $scope.toggleModal = function(review) {
    	if(!review){
    		review = {};
    	}
        $scope.modalShown = !$scope.modalShown;
        $scope.modalError=false;
        $scope.currentReview = review;

    };

    //save a new review to the database, at least a title is needed
    $scope.saveReview = function(){

        if( !$scope.currentReview.title){
            $scope.modalError = true;
            return;
        }

        //if id is unknown, create a new one a insert in base
        //else update the existing review
    	if( typeof $scope.currentReview.id === 'undefined'){
    		var newId = getNewId();

    		$scope.currentReview.id = newId;
            $scope.currentReview.order = $scope.reviews.length;
    		apiLinker.insertReview($scope.currentReview).then(function(data){
    			refreshReviews();
    		});
    	}
    	else{
    		apiLinker.updateReview($scope.currentReview).then(function(data){
    			refreshReviews();
    		});
    	}
        $scope.modalError = false;
    	$scope.modalShown = false;    	
    }

    //delete the review from the base
    $scope.deleteReview = function(review){
    	apiLinker.deleteReview(review).then(function(){
    		refreshReviews();
    	});
    	
    }

    //save the current reviews order
    $scope.saveOrder = function(){
        for(var i=0; i<$scope.reviews.length; i++){
            $scope.reviews[i].order = i;
        }
        console.log("saving orders")
        apiLinker.updateOrder($scope.reviews);
        
    }

    //bind dropEvent, to report the change in the data
    $rootScope.$on('dropEvent', function(evt, dragged, dropped) {
        var i, oldIndex1, oldIndex2;
        for(i=0; i<$scope.reviews.length; i++) {
            var c = $scope.reviews[i];
            if(dragged.title === c.title) {
                oldIndex1 = i;
            }
            if(dropped.title === c.title) {
                oldIndex2 = i;
            }
        }

        moveOnArray($scope.reviews, oldIndex1, oldIndex2);

        $scope.$apply();
    });

    //init data
    refreshReviews();

}]);

