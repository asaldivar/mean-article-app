angular.module('reddit')

.controller('articlesController', ['$scope', function($scope) {
  $scope.article = {
    title: 'The Book of Disquiet'
  }
}]);