app.controller('newsController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        if($state.current.name == 'app.help.news') {
            $state.go('app.help.news.list', {}, {reload: true, location: 'replace'});
            return;
        }
        $scope.id = $state.params.id;

        $scope.newsList = [{
            id: 5,
            name: '微信优惠券功能正式上线',
            time: 1481673600,
            isNew: true
        },{
            id: 4,
            name: '高级图文功能正式上线',
            time: 1481673600,
            isNew: true
        },{
            id: 3,
            name: '秀米编辑器正式上线',
            time: 1478563200,
            isNew: true
        },{
            id: 0,
            name: '心康云的数据中心正式开放',
            time: 1478563200
        },{
            id: 1,
            name: '心康云的会员能区分门店了',
            time: 1477267200
        },{
            id: 2,
            name: '心康云的互联网药店会员体系上线了！',
            time: 1475020800
        }];
    }]);