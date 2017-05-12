app.controller('assistant4MemberController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    'Upload',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal, Upload) {
        //列表数据
        $scope.tableData = [];
        $scope.data = {
            keyWord: $stateParams.keyWord || '',//关键字搜索,非必须
            name: $stateParams.name || '',//店员名
            assistantId: $stateParams.assistantId || ''//店员id
        };

        //分页信息
        $scope.paginationConf = {
            currentPage: $stateParams.pageNum || 1,
            totalItems: 0,
            itemsPerPage: $stateParams.pageSize || 10,
            onChange: function () {
                $scope.changePath(true);
            }
        };

        $scope.changePath = function (isNest) {
            $state.go('app.base.assistant.assistant4Member', {
                pageNum: isNest ? $scope.paginationConf.currentPage : 1,
                pageSize: $scope.paginationConf.itemsPerPage,
                keyWord: $scope.data.keyWord,
                assistantId: $scope.data.assistantId,
            });
        };

        //加载数据请求
        $scope.load = function () {
            $ajax.get('/cms/member/searchByStoreUserId/' + $scope.paginationConf.currentPage + '/' + $scope.paginationConf.itemsPerPage, {
                storeUserId: $scope.data.assistantId,
                nameOrMobile: $scope.data.keyWord

            }, function (data, dataTime) {
                $scope.dataTime = dataTime;
                $scope.tableData = data.list;
                $scope.paginationConf.totalItems = data.total;
            });
        };
        $scope.load();
        $scope.toDays = function (time) {
            return parseInt(($scope.dataTime - time) / 3600 / 24);
        }
    }]);



