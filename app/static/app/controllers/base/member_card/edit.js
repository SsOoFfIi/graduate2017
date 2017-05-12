app.controller('memberCardEditController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.data = $scope.$parent.memberCardData;

        $scope.digitsRegex = /^[1-9]\d{0,5}$/;
        $scope.numberRegex = /^(([1-9]\d{0,5})|0)(\.\d{1,2})?$/;

        $scope.style = {
            'background-size': '100% 100%',
            'background-position': 'center',
            'background-image': 'url(' +$scope.data.backgroundPicUrlLocal+ ')'
        };

        //默认背景图列表
        $scope.defaultCardBg = [];
        /** 选择默认背景 **/
        $scope.selectCardBg = function(data) {
            $scope.data.backgroundPicUrlLocal = data.cosUrl;
            $scope.data.backgroundPicUrlWx = data.wxUrl;
            $scope.style['background-image'] = 'url(' +data.cosUrl+ ')';
        };
        $ajax.get('/cms/cmsCustomerCardSetting/selectDefalutBackgroundPic', {}, function (result) {
            if(result && result.length) {
                $scope.defaultCardBg = result;
                if(!$scope.data.backgroundPicUrlLocal) {
                    $scope.selectCardBg(result[0]);
                }
            }
        });

        //上传Logo图片
        var uploadLogoBtn = $('.uploadLogoBtn', '.memberCardPage');
        uploadLogoBtn.upload({
            action: "/cms/upload", //上传地址
            location: ".memberCardPage",
            fileName: "file",                        //文件名称。用于后台接收
            params: {
                appid: $rootScope.mpAppid,
                type: 'image'
            },                               //参数
            accept: ".jpeg,.jpg,.png",                    //文件类型
            complete: function (result) {
                if (result.code == 200) {
                    $scope.$apply(function () {
                        $scope.data.logoUrlLocal = result.data.cos_path;
                        $scope.data.logoUrlWx = result.data.wx_path;
                    });
                } else {
                    Notify.error(result.msg);
                }
                $(this).val('');
            },
            submit: function ($form) {   //提交之前
                var filename = $form.find(':file').val().toLowerCase();
                if (!/(\.jpg|\.jpeg|\.png)$/i.test(filename)) {
                    Notify.error('只能是jpg或png或jpeg格式的图片文件！');
                    return false;
                } else {
                    return true;
                }
            }
        });

        $scope.saveMemberCard = function() {
            if(!$scope.data.logoUrlLocal) {
                Notify.warn('请上传Logo图片!');
                return false;
            }
            if(!$scope.data.backgroundPicUrlLocal) {
                Notify.warn('请选择背景图片!');
                return false;
            }
            if($scope.data.stepCurrent == 2) {
                $ajax.post('/cms/cmsCustomerCardSetting/three', $scope.data, function() {
                    Notify.success('会员卡信息保存成功！');
                    $scope.$parent.getMemberCardData();
                });
            } else {
                $ajax.post('/cms/cmsCustomerCardSetting/update', $scope.data, function() {
                    Notify.success('会员卡信息保存成功！');
                    $state.go('app.base.memberCard.messageConfig');
                });
            }
        };

        //上传背景图片
        var uploadBgBtn= $('.uploadBgBtn', '.memberCardPage');
        uploadBgBtn.upload({
            action: "/cms/upload", //上传地址
            location: ".memberCardPage",
            fileName: "file",                        //文件名称。用于后台接收
            params: {
                appid: $rootScope.mpAppid,
                type: 'image'
            },                               //参数
            accept: ".jpeg,.jpg,.png",                    //文件类型
            complete: function (result) {
                if (result.code == 200) {
                    $scope.$apply(function () {
                        $scope.data.backgroundPicUrlLocal = result.data.cos_path;
                        $scope.data.backgroundPicUrlWx = result.data.wx_path;
                        $scope.style['background-image'] = 'url('+result.data.cos_path+')';
                    });
                } else {
                    Notify.error(result.msg);
                }
                $(this).val('');
            },
            submit: function ($form) {   //提交之前
                var filename = $form.find(':file').val().toLowerCase();
                if (!/(\.jpg|\.jpeg|\.png)$/i.test(filename)) {
                    Notify.error('只能是jpg或png或jpeg格式的图片文件！');
                    return false;
                } else {
                    return true;
                }
            }
        });
    }]);