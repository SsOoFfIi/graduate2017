app.controller('courseListController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.stop = function(course) {
            layer.confirm('是否确认结束课程【'+course.name+'】？', {
                btn: ['结束', '取消'] //按钮
            }, function (index) {
                $ajax.get('/cms/train/cancelCourse', {id: course.id}, function(data) {
                    Notify.success('课程已停止！');
                    layer.close(index);
                    $scope.$parent.getCourseData();
                });
            }, function () {
            });
        };
    }]);