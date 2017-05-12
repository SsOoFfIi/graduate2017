app.controller('docsController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        if($state.current.name == 'app.help.docs') {
            $state.go('app.help.docs.list', {}, {reload: true, location: 'replace'});
            return;
        }
        $scope.id = $state.params.id;

        $scope.docsList = [{
            id: 0,
            name: '帮助文档1-门店物料设计与印刷指南',
            url: 'http://public.cdn.sinoxk.com/cms/customer/demo/帮助文档1-门店物料设计与印刷指南.zip'

        }, {
            id:1,
            name:'帮助文档2-会员卡运营指南',
            url:'http://public.cdn.sinoxk.com/cms/customer/demo/帮助文档2-会员卡运营指南.pdf'
        },{
            id:3,
            name:'帮助文档4-数据中心运营指南',
            url:'http://public.cdn.sinoxk.com/cms/customer/demo/帮助文档4-数据中心运营指南.pdf'
        },{
            id:4,
            name:'帮助文档5-优惠券运营指南',
            url:'http://public.cdn.sinoxk.com/cms/customer/demo/帮助文档5-优惠券运营指南.pdf'
        },{
            id:5,
            name:'帮助文档6-APP使用指南总部版（适用于总部学习）',
            url:'http://public.cdn.sinoxk.com/cms/customer/demo/帮助文档6-APP使用指南总部版（适用于总部学习）.pdf'
        },{
            id:6,
            name:'帮助文档7-APP使用指南店员培训版（适用于对店员培训）',
            url:'http://public.cdn.sinoxk.com/cms/customer/demo/帮助文档6-APP使用指南店员培训版（适用于对店员培训）.pdf'
        }
        ];
    }]);