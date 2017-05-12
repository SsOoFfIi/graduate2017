app.controller('couponListController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.data = {
            cardId: ''
        };

        $scope.copyUrlAndGo = function(id) {
            var urlCopied = $rootScope.copyUrl(id);
            if(urlCopied) {
                $state.go('app.base.menu');
            }
        };

        $scope.showPromotionModal = function(coupon) {
            $modal.open({
                windowClass: 'coupon-promotion-modal',
                templateUrl: 'couponPromotionModal.html',
                controller: 'couponPromotionModalController',
                backdrop: 'static',
                size: '',

                resolve: {
                    data: function () {
                        return {
                            coupon: coupon
                        }
                    }
                }
            });
        };

        $scope.edit = function() {
            $state.go('app.tools.coupon.edit');
        };

        $scope.stop = function(coupon) {
            layer.confirm('停止后将不能再领取优惠券，但已领取优惠券的仍然有效，是否确认？', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                $ajax.get('/cms/coupon/cancel', {batchSequence: coupon.batchSequence}, function(data) {
                    Notify.success('已停止！');
                    layer.close(index);
                    $scope.$parent.getCouponData();
                });
            }, function () {
            });
        };
    }]);

app.controller('couponPromotionModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', '$modal', 'data', function ($scope, $rootScope, $ajax, $modalInstance, $modal, data) {
    $scope.coupon = data.coupon;
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);