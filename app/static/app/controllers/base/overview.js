app.controller('overviewController', ['$scope', '$rootScope', '$ajax', '$location', '$modal', function ($scope, $rootScope, $ajax, $location, $modal) {

    $scope.data = {
        member: {
            increasePercent: 0,
            isErpMemberCount: 0,
            isErpMemberPercent: 0,
            isNotErpMemberCount: 0,
            isNotErpMemberPercent: 0,
            totalCount: 0,
            sumCount: 0
        },
        follower: {
            cancelCount: 0,
            netNewCount: 0,
            newCount: 0,
            totalCount: 0
        },
        customerStoreRank: {
            list: []
        },
        messageCount: 0
    };

    //分页信息
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 7,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        hideGoto: true,
        onChange: function () {
        }
    };
    $scope.storeRankPage = 1;
    $scope.yunyingPage = 1;
    $scope.faqPage = 1;

    $scope.faqList = [{
        id: 1,
        name: '素材库与群发消息常见问题'
    }, {
        id: 2,
        name: '门店管理常见问题'
    }, {
        id: 3,
        name: '自动回复常见问题'
    }, {
        id: 4,
        name: '会员卡常见问题'
    }, {
        id: 5,
        name: '粉丝管理常见问题'
    }, {
        id: 6,
        name: '数据中心常见问题'
    }
    ];

    $scope.yunyingList = [{
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

    $scope.newsList = [{
        id: 5,
        name: '微信优惠券功能正式上线',
        time: '2016-12-14',
        isNew: true
    },{
        id: 4,
        name: '高级图文功能正式上线',
        time: '2016-12-14',
        isNew: true
    },{
        id: 3,
        name: '秀米编辑器正式上线',
        time: '2016-12-14',
        isNew: true
    },{
        id: 0,
        name: '心康云的数据中心正式开放',
        time: '2016-11-08'
    },{
        id: 1,
        name: '心康云的会员能区分门店了',
        time: '2016-10-24'
    },{
        id: 2,
        name: '心康云的互联网药店会员体系上线了！',
        time: '2016-09-28'
    }];

    $scope.load = function () {
        $ajax.get('/cms/home', {}, function (result) {
            $scope.data = result;
        });
    };

    $scope.load();

    $scope.changeEmail = function () {
        $modal.open({
            windowClass: '',
            templateUrl: 'changeEmailModalContent.html',
            controller: 'changeEmailController',
            size: 0,
            backdrop: 'static',
            resolve: {
                data: function () {
                    return {
                        currentEmail: $('#currentEmail').val(),
                        emailAuthFlag: $('#emailAuthFlag').val()
                    };
                }
            }
        });
    };
}]);

app.controller('changeEmailController', '$scope', '$ajax', '$modalInstance', '$interval', 'data', [function ($scope, $ajax, $modalInstance, $interval, data) {
    $scope.data = {
        currentEmail: data.currentEmail,
        emailAuthFlag: data.emailAuthFlag,
        email: (data.emailAuthFlag == 2 && data.currentEmail) ? data.currentEmail : '',
        password: '',
        captcha: ''
    };

    $scope.getVerifyCodeBtnText = '获取验证码';
    function countDown() {
        $scope.sending = true;
        var total = 90;
        $scope.getVerifyCodeBtnText = total + '秒';
        var t = $interval(function () {
            if (total > 0) {
                total--;
                $scope.getVerifyCodeBtnText = total + '秒';
            } else {
                $interval.cancel(t);
                t = undefined;
                $scope.sending = false;
                $scope.getVerifyCodeBtnText = '获取验证码';
            }
        }, 1000);
    }

    $scope.sendVerifyCode = function () {
        if ($scope.sending) {
            return false;
        }
        countDown();
        $.ajax({
            url: '/cms/email/send',
            dataType: 'json',
            data: {
                'email': $scope.data.email
            },
            type: 'post',
            success: function (data) {
                if (data.code == 200) {
                    Notify.success("验证码已发送至您的邮箱")
                } else {
                    Notify.error(data.msg)
                }

            }
        });
    };

    $scope.ok = function () {
        if ($scope.changeEmailForm.$valid) {
            $.ajax({
                url: '/cms/email/update',
                dataType: 'json',
                data: $scope.data,
                type: 'post',
                success: function (data) {
                    if (data.code == 200) {
                        Notify.success("邮箱绑定成功");
                        $('#currentEmail').val($scope.data.email);
                        $('#emailAuthFlag').val(1);
                        $('#emailIcon').removeClass('gray').addClass('azure');
                        $modalInstance.close();
                    } else {
                        Notify.error(data.msg)
                    }

                }
            });
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);