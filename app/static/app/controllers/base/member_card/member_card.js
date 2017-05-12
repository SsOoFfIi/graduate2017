app.controller('memberCardController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.memberCardData = {};
        $scope.getMemberCardData = function() {
            $ajax.get('/cms/cmsCustomerCardSetting/selectOne', {}, function(data) {
                $scope.memberCardData = data;
                switch(data.stepCurrent) {
                    case 0:
                    case 1:
                    case 2:
                        $state.go('app.base.memberCard.createCard');
                        break;
                    case 3:
                        $state.go('app.base.memberCard.messageConfig');
                        break;
                    case 4:
                    //case 5:
                    case 6:
                        $state.go('app.base.memberCard.list');
                        break;
                }
            }, function(result) {
                $scope.memberCardData = undefined;
                if(result.code == 3000) {
                    $state.go('app.base.memberCard.createCard');
                } else {
                    Notify.error(result.msg);
                }
            });
        };
        $scope.getMemberCardData();
    }]);