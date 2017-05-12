app.controller('memberListController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.memberList = [];

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

        $scope.filterParams = {};
        $scope.load = function () {
            $ajax.get('/cms/member/search/' + $scope.paginationConf.currentPage + '/' + $scope.paginationConf.itemsPerPage, $scope.filterParams, function (data, dataTime) {
                $scope.dataTime = dataTime;
                $scope.memberList = data.list;
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

        $scope.getAge = function (birthday) {
            var nowDate = new Date($scope.dataTime * 1000);
            var birthdayDate = new Date(birthday*1000);
            var year = nowDate.getFullYear() - birthdayDate.getFullYear();
            if (year > 0) {
                return year + '岁';
            } else {
                return '1岁';
            }
        }

        $scope.toDays = function (time) {
            return parseInt(($scope.dataTime - time) / 3600 / 24);
        }
    }]);