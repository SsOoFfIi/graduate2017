app.controller('keywordsController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.tableData = [];
        $scope.data = {
            keyword: ''
        };

        //分页信息
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.changePath();
            }
        };

        $scope.changePath = function () {
            $scope.load();
        };

        $scope.load = function() {
            $ajax.get('/cms/wechat/reply/keyword', {
                pageSize: $scope.paginationConf.itemsPerPage,
                pageNum: $scope.paginationConf.currentPage,
                mpAppid: $rootScope.mpAppid,
                keyword: $scope.data.keyword
            }, function (data) {
                $scope.tableData = data.list;
                $scope.paginationConf.totalItems = data.total;
            });
        };
        $scope.load();

        $scope['delete'] = function(id) {
            layer.confirm('是否要删除关键词回复？', {
                btn: ['删除', '取消'] //按钮
            }, function(index) {
                $ajax.post('/cms/wechat/reply/keyword/del/' + id, {}, function () {
                    layer.close(index);
                    Notify.success("删除关键词回复成功!");
                    $scope.load();
                });
            });
        }
    }]);