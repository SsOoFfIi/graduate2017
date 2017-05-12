app.controller('memberCardCreateController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.linkERP = function() {
            $modal.open({
                windowClass: '',
                templateUrl: 'linkErp.html',
                controller: 'linkERPController',
                backdrop: 'static',
                size: 'lg',

                resolve: {
                    data: function () {
                        return {
                            updateMemberCardData: $scope.$parent.getMemberCardData
                        }
                    }
                }
            });
        };
    }]);

app.controller('linkERPController', ['$scope', '$rootScope', '$ajax', '$modalInstance', '$modal', 'data', function ($scope, $rootScope, $ajax, $modalInstance, $modal, data) {
    $scope.data = {
        success: false,
        updateMemberCardData: data.updateMemberCardData
    };
    $scope.ok = function () {
        var modal = $modal.open({
            windowClass: 'linking-erp-modal',
            templateUrl: 'linkingErp.html',
            controller: 'linkingERPController',
            backdrop: 'static',

            resolve: {
                data: function () {
                    return $scope.data;
                }
            }
        });

        $ajax.post('/cms/cmsCustomerCardSetting/one', {}, function(data) {
            $scope.data.success = true;
            setTimeout(function() {
                $scope.data.updateMemberCardData();
                modal.close();
                $modalInstance.close();
            }, 2000);
        }, function(result) {
            modal.close();
            Notify.error(result.msg);
        });
    };
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);

app.controller('linkingERPController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    $scope.data = data;
}]);