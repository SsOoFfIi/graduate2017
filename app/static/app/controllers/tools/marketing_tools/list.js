app.controller('marketingToolsListController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.data = [{
            name: '优惠券',
            icon: 'coupon',
            creator: '运营团队 | 心康科技',
            summary: '可通过多种线上渠道派发，并在线下门店中使用',
            screenshots: ['/assets/img/tools/screenshots/coupon1.jpg', '/assets/img/tools/screenshots/coupon2.jpg', '/assets/img/tools/screenshots/coupon3.jpg'],
            routerName: 'app.tools.coupon',
            details: [
                {
                    title: '1、支持通过两种方式创建优惠券：',
                    content: '从ERP导入优惠券。不经过ERP，直接在心康云生成优惠券'
                },
                {
                    title: '2、支持四种类型的优惠券：',
                    content: '代金券、折扣券、兑换券、其他券'
                },
                {
                    title: '3、可导出优惠券核销明细，以便财务部门对账'
                }
            ]
        }, {
            name: '激活有礼',
            icon: 'gift',
            creator: '运营团队 | 心康科技',
            summary: '顾客激活微信会员卡即可获得礼品。可以让顾客更愿意激活微信会员卡。',
            screenshots: ['/assets/img/tools/screenshots/gift1.jpg', '/assets/img/tools/screenshots/gift2.jpg', '/assets/img/tools/screenshots/gift3.jpg', '/assets/img/tools/screenshots/gift4.jpg'],
            routerName: 'app.tools.activateGift',
            details: [
                {
                    title: '选择一批优惠券作为激活礼品，当顾客激活微信会员卡后，即可获得该优惠券。'
                },
                {
                    title: '1、目前仅支持赠送优惠券'
                },
                {
                    title: '2、 请注意优惠券的库存，当库存耗完后，将自动停止送券'
                }
            ]
        }, {
            name: '购药记录',
            icon: 'record',
            creator: '运营团队 | 心康科技',
            summary: '会员可在线查询自己的购药记录',
            screenshots: ['/assets/img/tools/screenshots/record1.jpg', '/assets/img/tools/screenshots/record2.jpg', '/assets/img/tools/screenshots/record3.jpg'],
            routerName: 'app.tools.record',
            details: [
                {
                    title: '1、必须是会员才能查询购药纪录'
                },
                {
                    title: '2、购药记录可在会员卡主页中查看，也可以单独放在公众号菜单中'
                }
            ]
        }, {
            name: '问卷投票',
            icon: 'survey',
            creator: '运营团队 | 腾讯问卷',
            summary: '腾讯公司推出的免费、专业的问卷和投票工具',
            screenshots: ['/assets/img/tools/screenshots/survey1.jpg', '/assets/img/tools/screenshots/survey2.jpg'],
            url: 'http://wj.qq.com/login.html',
            details: [
                {
                    title: '既可以创建调查问卷，也可以创建投票'
                }
            ]
        }];
    }]);