app.controller('overviewController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
    $scope.tableLoaded = false;
    $scope.tableList = [];
    $scope.data = {
        num: $stateParams.serialNum || -1
    };

      //分页信息
        $scope.paginationConf = {
            currentPage: $stateParams.page || 1,
            totalItems: 0,
            itemsPerPage:  10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.getHistory();
            }
        };
         $scope.getHistory = function () {
         $state.go('app.main.overview', {
                // pageNum: $scope.paginationConf.currentPage,
                // pageSize: $scope.paginationConf.itemsPerPage,
             page: $scope.paginationConf.currentPage,
             serialNum: $scope.data.num
            });
         };


    $scope.load =function () {
        console.log($stateParams.serialNum);
        $scope.intNum = parseInt($scope.data.num);
        $ajax.post('/index/userhistory/',{
        // pageSize:1000,
        // pageNum:1
        page: parseInt($scope.paginationConf.currentPage),
        serialNum: $scope.intNum
    },function (data) {
        $scope.tableLoaded = true;
        $scope.tableList = data.list;
        // $scope.paginationConf.totalItems = data.totalRow;
        $scope.paginationConf.totalItems = data.totalRow;
        console.log($scope.data.num);
    });
    };
    $scope.load();



    $scope.typeList = [
        {id:"OPC",name:"选修表"},
        {id:"ACT",name:"班级活动表"},
        {id:"VOT",name:"投票表"}
        ];
    $scope.tableType = function (type) {
        $scope.typeList.map(function (x){
            if (x.id == type){
                $scope.Type_name= x.name;
            }
        });
        return $scope.Type_name;
        };


        
        $scope.changePath = function () {
         $state.go('app.main.statistics', {
                serialNum: $scope.table.id,
                tablePwd: $scope.table.pwd
            });
        };

    }]);