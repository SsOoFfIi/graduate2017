app.controller('trainingController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        !$state.current.url && $state.go('app.training.course', {}, {'location': 'replace'});

        $scope.showDownloadAppModal = function (type) {
            $modal.open({
                windowClass: '',
                templateUrl: 'downloadAppModal.html',
                controller: 'downloadAppModalController',
                backdrop: 'static',
                size: '',

                resolve: {
                    data: function () {
                        return {
                            type: type
                        };
                    }
                }
            });
        };
    }]);

app.controller('downloadAppModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    $scope.type = data.type;
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);