app.controller('faqController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        if($state.current.name == 'app.help.faq') {
            $state.go('app.help.faq.list', {}, {reload: true, location: 'replace'});
            return;
        }
        $scope.id = $state.params.id;
        $scope.faqList = [{
            id: 1,
            name: '素材库与群发消息常见问题',
            time: '1484382603'
        }, {
            id: 2,
            name: '门店管理常见问题',
            time: '1484382603'
        }, {
            id: 3,
            name: '自动回复常见问题',
            time: '1484382603'
        }, {
            id: 4,
            name: '会员卡常见问题',
            time: '1484382603'
        }, {
            id: 5,
            name: '粉丝管理常见问题',
            time: '1484382603'
        }, {
            id: 6,
            name: '数据中心常见问题',
            time: '1484382603'
        }
        ];
    }]);