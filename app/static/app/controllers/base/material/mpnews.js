app.controller('mpnewsController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.newsList = [];

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

        $scope.load = function () {
            $ajax.get('/cms/wechat/material/news', {
                mpAppid: $rootScope.mpAppid,
                offset: ($scope.paginationConf.currentPage - 1) * $scope.paginationConf.itemsPerPage,
                count: $scope.paginationConf.itemsPerPage
            }, function (data) {
                $scope.newsList = data.items;
                $scope.paginationConf.totalItems = data.totalCount;
            });
        };

        $scope.load();

        $scope.deleteNews = function(news) {
            layer.confirm('确定要删除微信图文吗？', {
                btn: ['删除', '取消'] //按钮
            }, function (index) {
                $ajax.post('/cms/wechat/material/delete', {
                    mpAppid: $rootScope.mpAppid,
                    mediaId: news.mediaId
                }, function() {
                    $scope.load();
                    Notify.success('微信图文已删除');
                    layer.close(index);
                });
            }, function () {
            });
        };
    }]);