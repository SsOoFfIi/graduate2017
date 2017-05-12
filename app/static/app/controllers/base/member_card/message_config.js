app.controller('memberCardMessageConfigController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.defaultData = {
            title: '点击激活',
            imageUrlLocal: 'http://public.cdn.sinoxk.com/cms/customer/card/images/20161123201653cH4y1p.jpg',
            imageUrlWx: 'http://mmbiz.qpic.cn/mmbiz_jpg/48hp4GOYkqEyvwfx8ciaaV51wFbLoosxHRHTZUTyXKRvicLnVpzz519sbibqw03SOHMg1WLw6VsZt7JTs0mAPThXA/0'
        };

        $scope.data = angular.copy($scope.defaultData);

        if($scope.$parent.memberCardData.stepCurrent == 3) {
            $scope.selected = 'default';
        } else {
            if($scope.defaultData.title == $scope.$parent.memberCardData.pushMsgTitle && $scope.defaultData.imageUrlLocal == $scope.$parent.memberCardData.pushMsgImageLocalUrl) {
                $scope.selected = 'default';
            } else {
                $scope.selected = 'custom';
                $scope.data = {
                    title: $scope.$parent.memberCardData.pushMsgTitle,
                    imageUrlLocal: $scope.$parent.memberCardData.pushMsgImageLocalUrl,
                    imageUrlWx: $scope.$parent.memberCardData.pushMsgImageWxUrl
                }
            }
        }
        $scope.selectDefault = function() {
            angular.copy($scope.defaultData, $scope.data);
            $scope.selected = 'default';
        };
        $scope.selectCustom = function() {
            $scope.selected = 'custom';
        };

        $scope.save = function() {
            if(!$scope.data.imageUrlLocal) {
                Notify.warn('请选择图片!');
                return false;
            }
            if($scope.$parent.memberCardData.stepCurrent == 3) {
                $ajax.post('/cms/cmsCustomerCardPushMsg/four', $scope.data, function () {
                    Notify.success('会员卡已发布成功！');
                    $scope.$parent.getMemberCardData();
                });
            } else {
                $ajax.post('/cms/cmsCustomerCardSetting/update', {
                    pushMsgTitle: $scope.data.title,
                    pushMsgImageLocalUrl: $scope.data.imageUrlLocal,
                    pushMsgImageWxUrl: $scope.data.imageUrlWx
                }, function () {
                    Notify.success('推送消息保存成功！');
                    $scope.$parent.getMemberCardData();
                });
            }
        };

        //上传背景图片
        var uploadBgBtn= $('.uploadBtn', '.messageConfigPage');
        uploadBgBtn.upload({
            action: "/cms/upload", //上传地址
            location: ".messageConfigPage",
            fileName: "file",                        //文件名称。用于后台接收
            params: {
                appid: $rootScope.mpAppid,
                type: 'image'
            },                               //参数
            accept: ".jpeg,.jpg,.png",                    //文件类型
            complete: function (result) {
                if (result.code == 200) {
                    $scope.$apply(function () {
                        $scope.data.imageUrlLocal = result.data.cos_path;
                        $scope.data.imageUrlWx = result.data.wx_path;
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