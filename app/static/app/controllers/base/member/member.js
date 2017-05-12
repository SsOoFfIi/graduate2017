app.controller('memberController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $state.current.url == '/member' && $state.go('app.base.member.personas', {}, {location: 'replace'});
    }]);