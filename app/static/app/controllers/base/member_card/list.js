app.controller('memberCardListController', [
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

        $scope.showSetMemuFlag = !$scope.$parent.memberCardData.settingMenuFlag;
        $scope.showCouponFlag = !$scope.$parent.memberCardData.coupon && !$scope.showSetMemuFlag;
        $scope.showBindCard = $scope.$parent.memberCardData.stepCurrent == 4 && !$scope.showCouponFlag;

        $scope.copyUrl = function() {
            try {
                document.querySelector('#memberCardUrl').select();
                document.execCommand('copy');
                Notify.success('链接已复制，请配置菜单！');
                return true;
            } catch (e) {
                Notify.error('您的浏览器不支持复制链接，请手动选择链接后从右键菜单复制！');
                return false;
            }
        };

        $scope.copyUrlAndGo = function() {
            var urlCopied = $scope.copyUrl();
            if(urlCopied) {
                $state.go('app.base.menu',{from: 'memberCard'});
            }
        };

        var showAuthModal = function(funcInfoListJSON) {
            var funcInfoList = JSON.parse(funcInfoListJSON || '[]');
            var canAccessCard = funcInfoList.filter(function(d){return d.funcscope_category.id==8}).length > 0;
            if(!canAccessCard) {
                $modal.open({
                    windowClass: 'reauthorization-modal',
                    templateUrl: 'reauthorizationModal.html',
                    controller: 'reauthorizationController',
                    backdrop: 'static',
                    size: 'lg',

                    resolve: {
                        data: function () {
                            return {
                            }
                        }
                    }
                });
            }
        };

        $scope.bindMemberCard = function() {
            $ajax.post('/cms/cmsCustomerCardPushMsg/six', $scope.data, function() {
                $scope.showBindCard = false;
                $scope.$parent.getMemberCardData();
                Notify.success('添加卡包成功！');
                showAuthModal(memberCardData.funInfoList || '[]');
            });
        };

        $scope.showCoupon = function() {
            $scope.showCouponFlag = true;
            $scope.showSetMemuFlag = false;
            $scope.showBindCard = false;
        };

        $scope.showMenu = function() {
            $scope.showCouponFlag = false;
            $scope.showSetMemuFlag = true;
            $scope.showBindCard = false;
        };

        $scope.toBind = function() {
            $scope.showSetMemuFlag = false;
            $scope.showCouponFlag = false;
            $scope.showBindCard = true;
            setTimeout(function() {
                $('#cardId').focus();
            }, 50);
        };

        $scope.edit = function() {
            $state.go('app.base.memberCard.edit');
        };

        $scope.$watch('memberCardData', function(newVal, oldVal) {
            //绑定会员卡id后，判断是否授权使用微信会员卡功能
            if(newVal.stepCurrent == 6) {
                showAuthModal(newVal.funInfoList || '[]');
            }
        });
    }]);

app.controller('reauthorizationController', ['$scope', '$rootScope', '$ajax', '$modalInstance', '$modal', 'data', function ($scope, $rootScope, $ajax, $modalInstance, $modal, data) {
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);