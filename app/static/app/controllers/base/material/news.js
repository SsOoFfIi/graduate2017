app.controller('newsController', [
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
            $ajax.get('/cms/wechatMpMsgPicLink/selectForPage', {
                pageNum: $scope.paginationConf.currentPage,
                pageSize: $scope.paginationConf.itemsPerPage
            }, function (data) {
                $scope.newsList = data.list;
                for(var i=data.size;i--;) {
                    data.list[i].content = JSON.parse(data.list[i].content);
                }
                $scope.paginationConf.totalItems = data.total;
            });
        };

        $scope.load();

        $scope.deleteNews = function(news) {
            layer.confirm('确定要删除高级图文吗？', {
                btn: ['删除', '取消'] //按钮
            }, function (index) {
                $ajax.get('/cms/wechatMpMsgPicLink/deleteByMediaId', {
                    mediaId: news.mediaId
                }, function() {
                    $scope.load();
                    Notify.success('高级图文已删除');
                    layer.close(index);
                });
            }, function () {
            });
        };
    }]);