/**
 * 客户管理
 */
app.controller('customController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {

      $scope.swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay : 2000,
          loop:true
    });
}]);
