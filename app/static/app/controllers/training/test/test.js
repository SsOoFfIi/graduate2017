app.controller('testController', [
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
                $scope.getTestData($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
            }
        };

        $scope.testData = {};
        $scope.getTestData = function(pageNo, pageSize) {
            $ajax.get('/cms/train/selectEvaluateForPage', {pageNum: pageNo || $scope.paginationConf.currentPage, pageSize: pageSize || $scope.paginationConf.itemsPerPage, name: $scope.paginationConf.name}, function(data) {
                if(data.total == 0 && !$scope.paginationConf.name) {
                    $state.go('app.training.test.create', {}, {'location': 'replace'});
                } else {
                    $scope.testData = data;
                    $scope.paginationConf.totalItems = data.total;
                    $state.go('app.training.test.list', {}, {'location': 'replace'});
                }
            });
        };
        $scope.getTestData();

        $scope.showTestStartModal = function (testId) {
            $modal.open({
                windowClass: '',
                templateUrl: 'testStartModal.html',
                controller: 'testStartModalController',
                backdrop: 'static',
                size: '',

                resolve: {
                    data: function () {
                        return {
                            startTest: function() {
                                $ajax.get('/cms/train/startEvaluate', {id: testId}, function() {
                                    $scope.$parent.showDownloadAppModal(2);
                                    $scope.getTestData();
                                }, function(result) {
                                    Notify.error(result.msg);
                                    $scope.disableBtn = false;
                                });
                            },
                            toList: function() {
                                $scope.getTestData();
                            }
                        };
                    }
                }
            });
        };
    }]);

app.controller('testStartModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', '$state', 'data', function ($scope, $rootScope, $ajax, $modalInstance, $state, data) {
    $scope.startTest = function() {
        data.startTest();
        $modalInstance.close();
    };
    $scope.addAssistant = function() {
        $state.go("app.base.assistant");
        $modalInstance.close();
    };
    $scope.cancel = function () {
        data.toList();
        $modalInstance.close();
    };
}]);