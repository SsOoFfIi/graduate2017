app.controller('testListController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.stop = function(test) {
            layer.confirm('是否确认结束测评【'+test.name+'】？', {
                btn: ['结束', '取消'] //按钮
            }, function (index) {
                $ajax.get('/cms/train/cancelEvaluate', {id: test.id}, function(data) {
                    Notify.success('测评已停止！');
                    layer.close(index);
                    $scope.$parent.getTestData();
                });
            }, function () {
            });
        };
    }]);