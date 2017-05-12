app.controller('replyController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $state.current.url == '/reply' && $state.go('app.base.reply.subscribe', {}, {location: 'replace'});
    }]);