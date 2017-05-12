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
        $scope.data = angular.copy($scope.$parent.test) || {

        };

        $scope.saveQuestions = function() {
            $scope.data.topics = angular.toJson($scope.$parent.savedQuestions);
            if($scope.data.id) {
                    $ajax.post('/cms/train/updateEvaluate', $scope.data, function() {
                    Notify.success('测评信息保存成功！');
                    $scope.$parent.savedQuestions = null;
                    $scope.$parent.getTestData();
                }, function(result) {
                    Notify.error(result.msg);
                });
            } else {
                $ajax.post('/cms/train/insertEvaluate', $scope.data, function(data) {
                    Notify.success('测评信息保存成功！');
                    $scope.$parent.savedQuestions = null;
                    $scope.$parent.getTestData();
                }, function(result) {
                    Notify.error(result.msg);
                });
            }
        };
    }]);