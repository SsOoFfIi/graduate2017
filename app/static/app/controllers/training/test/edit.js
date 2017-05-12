app.controller('testEditController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.digitsRegex = /^[1-9]\d{0,4}$/;
        $scope.numberRegex = /^(([1-9]\d{0,5})|0)(\.\d{1,2})?$/;
        $scope.opts = {
            showDropdowns: true,
            locale: {
                applyClass: 'btn-green',
                applyLabel: "确定",
                fromLabel: "从",
                toLabel: "至",
                cancelLabel: '取消',
                customRangeLabel: '自定义范围',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                firstDay: 1,
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月',
                    '十月', '十一月', '十二月'
                ]
            },
            ranges: {
                '一周内': [moment().startOf('day'), moment().add(6, 'days').endOf('day')],
                '30天内': [moment().startOf('day'), moment().add(30, 'days').endOf('day')],
                '下个月': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
            }
        };

        //初始化数据
        $scope.minEndDate = moment().startOf('day').unix();
        $scope.date = {
            startDate: moment().startOf('day'),
            endDate: moment().add(6, 'days').endOf('day')
        };
        $scope.data = {
            status: 0,
            type: '1',
            typeValue: '',
            totalCount: 10000,
            conditionConsume: 0,
            conditionCommodity: "",
            logoUrl: $rootScope.userData.wechatHeadPicture,
            mpName: $rootScope.userData.wechatName
        };

        if($stateParams.batchSequence) {
            $ajax.get('/cms/coupon/selectOne', {batchSequence: $stateParams.batchSequence}, function(data) {
                data.totalCount = data.totalCount + data.sendedCount;
                $scope.data = data;
                $scope.conditionConsumeRadio = $scope.data.conditionConsume != 0 ? 2 : 1;
                $scope.conditionCommodityRadio = (!!$scope.data.conditionCommodity) ? 2 : 1;
                $scope.date = {
                    startDate: moment(new Date(data.startDatetime * 1000)),
                    endDate: moment(new Date(data.endDatetime * 1000))
                };
            });
        } else {
            angular.extend($scope.data, $scope.$parent.couponData);
            $scope.conditionConsumeRadio = $scope.data.conditionConsume ? 2 : 1;
            $scope.conditionCommodityRadio = $scope.data.conditionCommodity ? 2 : 1;
        }


        $scope.disableBtn = false;
        $scope.saveCoupon = function() {
            $scope.disableBtn = true;
            $scope.data.startDatetime = $scope.date.startDate.unix();
            $scope.data.endDatetime = $scope.date.endDate.unix();
            if($scope.data.id) {
                    $ajax.post('/cms/coupon/update', $scope.data, function() {
                    Notify.success('优惠券信息保存成功！');
                    $scope.$parent.getCouponData();
                }, function(result) {
                    Notify.error(result.msg);
                    $scope.disableBtn = false;
                });
            } else {
                $ajax.post('/cms/coupon/save', $scope.data, function() {
                    Notify.success('优惠券信息保存成功！');
                    $scope.$parent.getCouponData();
                }, function(result) {
                    Notify.error(result.msg);
                    $scope.disableBtn = false;
                });
            }
        };

        $scope.publish = function() {
            layer.confirm('优惠券生效后可以发放给粉丝，但不能再次编辑；确定生效，系统会为优惠券创建链接地址和二维码', {
                btn: ['确定', '取消'] //按钮
            }, function (index) {
                layer.close(index);
                $scope.disableBtn = true;
                $scope.data.startDatetime = $scope.date.startDate.unix();
                $scope.data.endDatetime = $scope.date.endDate.unix();
                $ajax.post('/cms/coupon/deploy', $scope.data, function(data) {
                        Notify.success('优惠券已生效！');
                        $scope.$parent.publishedCouponData = data;
                        $state.go('app.tools.coupon.published');
                    }, function(result) {
                    Notify.error(result.msg);
                    $scope.disableBtn = false;
                });
            }, function () {
            });
        };
    }]);