app.controller('managerController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        !$state.current.url && $state.go('app.manager.custom', {}, {'location': 'replace'});
    }]);