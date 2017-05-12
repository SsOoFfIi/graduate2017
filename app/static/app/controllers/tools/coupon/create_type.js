app.controller('couponCreateTypeController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.defaultData = {
            isImport: false,
            status: 8
        };

        $scope.data = {
            isImport: false,
            status: 8
        };

        $scope.nextStep = function() {
            if($scope.data.isImport && !$scope.data.totalCount) {
                Notify.warn('请先导入ERP优惠券!');
                return false;
            }
            $scope.$parent.couponData = angular.copy($scope.data);
            $state.go("app.tools.coupon.edit");
        };

        //上传背景图片
        var uploadBtn= $('.uploadBtn', '.createTypePage');
        uploadBtn.upload({
            action: "/cms/coupon/upload", //上传地址
            location: ".createTypePage",
            fileName: "file",                        //文件名称。用于后台接收
            params: {
                appid: $rootScope.mpAppid,
                type: 'image'
            },                                       //参数
            accept: ".xls,.xlsx",                    //文件类型
            complete: function (result) {
                if (result.code == 200) {
                    if(result.data.successCount == 0) {
                        layer.alert('表格中共有优惠券'+result.data.totalCount+'条，成功导入'+result.data.successCount+'条，请检查后重新导入');
                        return false;
                    }
                    layer.confirm('表格中共有优惠券'+result.data.totalCount+'条，成功导入'+result.data.successCount+'条，是否使用该批次数据？', {
                        btn: ['确定', '取消'] //按钮
                    }, function (index) {
                        $scope.$apply(function () {
                            $scope.data.batchSequence = result.data.batchSequence;
                            $scope.data.totalCount = result.data.successCount;
                            $scope.$parent.couponData = angular.copy($scope.data);
                            $state.go("app.tools.coupon.edit");
                        });
                        layer.close(index);
                    }, function () {
                    });
                } else {
                    Notify.error(result.msg);
                }
                $(this).val('');
            },
            submit: function ($form) {   //提交之前
                var filename = $form.find(':file').val().toLowerCase();
                if (!/(\.xls|\.xlsx)$/i.test(filename)) {
                    Notify.error('只能是.xls或.xlsx格式的Excel文件！');
                    return false;
                } else {
                    return true;
                }
            }
        });
    }]);