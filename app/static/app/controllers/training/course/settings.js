app.controller('settingsController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.digitsRegex = /^[1-9]\d{0,4}$/;
        $scope.numberRegex = /^(([1-9]\d{0,5})|0)(\.\d{1,2})?$/;

        //初始化数据
        $scope.data = {
            trainId: $scope.$parent.course.id,
            duration: $scope.$parent.course.duration,
            chooseCount: $scope.$parent.course.chooseCount,
            passScore: $scope.$parent.course.passScore
        };

        $scope.saveQuestions = function() {
            $scope.data.topics = angular.toJson($scope.$parent.savedQuestions);
            if($scope.$parent.course.topicFlag != 0) {
                    $ajax.post('/cms/train/updateCourseTopic', $scope.data, function() {
                    Notify.success('课后练习保存成功！');
                    $scope.$parent.getCourseData();
                        $scope.$parent.savedQuestions = null;
                }, function(result) {
                    Notify.error(result.msg);
                });
            } else {
                $ajax.post('/cms/train/insertCourseTopic', $scope.data, function() {
                    Notify.success('课后练习保存成功！');
                    $scope.$parent.getCourseData();
                    $scope.$parent.savedQuestions = null;
                }, function(result) {
                    Notify.error(result.msg);
                });
            }
        };
    }]);