app.controller('activateGiftController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.needSave = false;
        $scope.memberCardData = {};

        $scope.style = {
            'background-size': '100% 100%',
            'background-position': 'center'
        };

        $scope.getMemberCardData = function() {
            $ajax.get('/cms/cmsCustomerCardSetting/selectOne', {}, function(data) {
                $scope.memberCardData = data;
                $scope.style['background-image'] = 'url(' +($scope.memberCardData.backgroundPicUrlLocal || 'http://yaodian-10063702.cos.myqcloud.com/cms/customer/card/images/20160923154601cFjMzW.jpg')+ ')';
            }, function(result) {
                $scope.memberCardData = undefined;
                if(result.code == 3000) {
                    layer.confirm('你还没有创建会员卡！', {
                        btn: ['马上创建'] //按钮
                    }, function(index) {
                        $state.go('app.base.memberCard.createCard');
                        layer.close(index);
                    });
                } else {
                    Notify.error(result.msg);
                }
            });
        };
        $scope.getMemberCardData();



        $scope.selectCoupon = function () {
            if($scope.needSave || !$scope.memberCardData.coupon) {
                $modal.open({
                    windowClass: 'selectCouponModal',
                    templateUrl: 'selectCouponModal.html',
                    controller: 'selectCouponModalController',
                    backdrop: 'static',
                    size: 'lg',

                    resolve: {
                        data: function () {
                            return {
                                selectedCoupon: angular.copy($scope.memberCardData.coupon),
                                onSelect: function (coupon) {
                                    if(coupon.batchSequence != ($scope.memberCardData.coupon ? $scope.memberCardData.coupon.batchSequence : null)) {
                                        $scope.needSave = true;
                                        $scope.memberCardData.coupon = coupon;
                                    }
                                }
                            };
                        }
                    }
                });
            } else {
                layer.confirm('确定换一批优惠券?<br>你可以在优惠券列表中重新选择礼品；之前已被领取的优惠券，在有效期内还能继续使用', {
                    btn: ['确定', '取消'] //按钮
                }, function(index) {
                    layer.close(index);
                    $modal.open({
                        windowClass: 'selectCouponModal',
                        templateUrl: 'selectCouponModal.html',
                        controller: 'selectCouponModalController',
                        backdrop: 'static',
                        size: 'lg',

                        resolve: {
                            data: function () {
                                return {
                                    selectedCoupon: angular.copy($scope.memberCardData.coupon),
                                    onSelect: function (coupon) {
                                        if(coupon.batchSequence != ($scope.memberCardData.coupon ? $scope.memberCardData.coupon.batchSequence : null)) {
                                            $scope.needSave = true;
                                            $scope.memberCardData.coupon = coupon;
                                        }
                                    }
                                };
                            }
                        }
                    });
                });
            }
        };

        $scope.cancelActivateGift = function() {
            layer.confirm('确定不发优惠券？<br>确定不发后，粉丝激活会员不会获得优惠券；之前已被领取的优惠券在有效期内还能继续使用。', {
                btn: ['确定', '取消'] //按钮
            }, function(index) {
                $ajax.post('/cms/cmsCustomerCardSetting/cancelGifts', {}, function(data) {
                    Notify.success('激活有礼取消成功！');
                    $scope.getMemberCardData();
                });
                layer.close(index);
            });
        };

        $scope.saveActivateGift = function() {
            $ajax.post('/cms/cmsCustomerCardSetting/setGifts', {couponBatchSequence: $scope.memberCardData.coupon.batchSequence}, function(data) {
                Notify.success('激活有礼设置成功！');
                $scope.getMemberCardData();
                $scope.needSave = false;
            });
        };
    }]);

app.controller('selectCouponModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    $scope.data = data;

    //分页信息
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 5,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.getCouponData($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
        }
    };

    $scope.couponList = [];
    $scope.getCouponData = function(pageNo, pageSize) {
        $ajax.get('/cms/coupon/selectUsable', {pageNo: pageNo || $scope.paginationConf.currentPage, pageSize: pageSize || $scope.paginationConf.itemsPerPage}, function(data) {
            $scope.couponList = data.list;
            $scope.paginationConf.totalItems = data.total;
        });
    };
    $scope.getCouponData();
    $scope.cancel = function () {
        $modalInstance.close();
    };
    $scope.ok = function() {
        data.onSelect($scope.data.selectedCoupon);
        $modalInstance.close();
    }
}]);