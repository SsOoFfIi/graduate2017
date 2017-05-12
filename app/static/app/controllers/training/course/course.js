app.controller('courseController', [
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
                $scope.getCourseData($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
            }
        };

        $scope.courseData = {};
        $scope.getCourseData = function(pageNo, pageSize) {
            $ajax.get('/cms/train/selectCourseForPage', {pageNum: pageNo || $scope.paginationConf.currentPage, pageSize: pageSize || $scope.paginationConf.itemsPerPage, name: $scope.paginationConf.name}, function(data) {
                if(data.total == 0 && !$scope.paginationConf.name) {
                    $state.go('app.training.course.create', {}, {'location': 'replace'});
                } else {
                    $scope.courseData = data;
                    $scope.paginationConf.totalItems = data.total;
                    $state.go('app.training.course.list', {}, {'location': 'replace'});
                }
            });
        };
        $scope.getCourseData();

        $scope.showCourseStartModal = function (courseId) {
            $modal.open({
                windowClass: '',
                templateUrl: 'courseStartModal.html',
                controller: 'courseStartModalController',
                backdrop: 'static',
                size: '',

                resolve: {
                    data: function () {
                        return {
                            startCourse: function() {
                                $ajax.get('/cms/train/startCourse', {id: courseId}, function() {
                                    $scope.getCourseData();
                                    $scope.$parent.showDownloadAppModal(1);
                                }, function(result) {
                                    Notify.error(result.msg);
                                    $scope.disableBtn = false;
                                });
                            }
                        };
                    }
                }
            });
        };
    }]);

app.controller('courseStartModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', '$state', 'data', function ($scope, $rootScope, $ajax, $modalInstance, $state, data) {
    $scope.startCourse = function() {
        data.startCourse();
        $modalInstance.close();
    };
    $scope.addAssistant = function() {
        $state.go("app.base.assistant");
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);