app.controller('followerController', [
    '$scope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.followerList = [];

        //分页信息
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.load();
            }
        };

        $scope.filterData = {};
        $scope.filterParams = {};
        $scope.load = function () {
            $scope.filterParams.nickName = $scope.filterData.nickName;
            $ajax.get('/cms/wechat/userlist/' + $scope.paginationConf.currentPage + '/' + $scope.paginationConf.itemsPerPage, $scope.filterParams, function (data, dataTime) {
                $scope.dataTime = dataTime;
                $scope.followerList = data.list;
                $scope.paginationConf.totalItems = data.total;
            });
        };

        $scope.onFilter = function (filterParams) {
            $scope.filterParams = filterParams;
            if ($scope.paginationConf.currentPage == 1) {
                $scope.load();
            } else {
                $scope.paginationConf.currentPage = 1;
            }
        };

        $scope.editUser = function (user) {
            var modalInstance = $modal.open({
                windowClass: '',
                templateUrl: 'editFollowerModalContent.html',
                controller: 'editFollowerController',
                backdrop: 'static',
                size: 0,

                resolve: {
                    data: function () {
                        return {
                            user: angular.copy(user),
                            storeList: $scope.storeList,
                            callback: function () {
                                $scope.load();
                            }
                        };
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                // $scope.selected = selectedItem;
            }, function () {
            });
        }

        $scope.getAge = function (birthday) {
            var nowDate = new Date($scope.dataTime * 1000);
            var birthdayDate = new Date(birthday * 1000);
            var year = nowDate.getFullYear() - birthdayDate.getFullYear();
            if (year > 0) {
                return year + '岁';
            } else {
                return '1岁';
            }
        }
        //距今消费时间格式化
        $scope.toDays = function (time) {
            return parseInt(($scope.dataTime - time) / 3600 / 24);
        }
    }]);


app.controller('editFollowerController', ['$scope', '$ajax', '$modalInstance', 'data', function ($scope, $ajax, $modalInstance, data) {
    $scope.data = data;

    $scope.ok = function () {
    };
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);