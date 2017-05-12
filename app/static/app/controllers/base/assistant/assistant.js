app.controller('assistantLayoutController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $state.current.url == '/assistant' && $state.go('app.base.assistant.assistantList', {}, {location: 'replace'});
    }]);