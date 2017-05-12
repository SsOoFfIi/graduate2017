app.controller('xkappController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        !$state.current.url && $state.go('app.xkapp.version', {}, {'location': 'replace'});
    }]);