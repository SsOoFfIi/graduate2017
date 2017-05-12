app.controller('couponController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        //分页信息
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.getCouponData($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
            }
        };

        $scope.couponData = {};
        $scope.getCouponData = function(pageNo, pageSize) {
            $ajax.get('/cms/coupon/select', {pageNo: pageNo || $scope.paginationConf.currentPage, pageSize: pageSize || $scope.paginationConf.itemsPerPage}, function(data) {
                if(data.total == 0) {
                    $state.go('app.tools.coupon.create', {}, {'location': 'replace'});
                } else {
                    $scope.couponData = data.pageInfo;
                    $scope.couponUrl = data.url;
                    $scope.paginationConf.totalItems = data.pageInfo.total;
                    if($state.current.name != 'app.tools.coupon.createType') {
                        $state.go('app.tools.coupon.list', {}, {'location': 'replace'});
                    }
                }
            });
        };
        $scope.getCouponData();
    }]);