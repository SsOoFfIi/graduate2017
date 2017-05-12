app.controller('imagesController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    'Upload',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal, Upload) {
        // var $uploadImageBtn = $('.uploadImageBtn', '#imageMaterial');
        // $uploadImageBtn.upload({
        //     action: "/cms/wechat/material/add", //上传地址
        //     location: "#imageMaterial",
        //     fileName: "file",                        //文件名称。用于后台接收
        //     params: {
        //         appid: $rootScope.mpAppid,
        //         type: 'image'
        //     },                               //参数
        //     accept: ".jpeg,.bmp,.jpg,.png",                    //文件类型
        //     complete: function (result) {
        //         if (result.code == 200) {
        //             $scope.load();
        //         } else {
        //             Notify.error(result.msg);
        //         }
        //         $(this).val('');
        //     },
        //     submit: function ($form) {   //提交之前
        //         var filename = $form.find(':file').val().toLowerCase();
        //         if (!/(\.jpg|\.jpeg|\.bmp|\.png)$/i.test(filename)) {
        //             alert('只能是jpg或png或jpeg或bmp格式的图片文件！');
        //             return false;
        //         } else {
        //             return true;
        //         }
        //     }
        // });
        $scope.imageList = [];

        $scope.upload = function (file, errFiles) {
            if (!/(\.jpg|\.jpeg|\.bmp|\.png)$/i.test(file.name)) {
                Notify.error('只能是jpg(jpeg)或png格式的图片文件！');
                return false;
            }
            Upload.upload({
                url: '/cms/wechat/material/add',
                data: {file: file, type: 'image'}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                if (resp.data.code == 200) {
                    $scope.load();
                } else {
                    Notify.error(resp.data.msg);
                }
            }, function (resp) {
                Notify.error('上传图片失败！');
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };


        //分页信息
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 8,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.load();
            }
        };

        $scope.load = function () {
            $ajax.get('/cms/wechat/material', {
                mpAppid: $rootScope.mpAppid,
                type: 'image',
                offset: ($scope.paginationConf.currentPage - 1) * $scope.paginationConf.itemsPerPage,
                count: $scope.paginationConf.itemsPerPage
            }, function (data) {
                $scope.imageList = data.items;
                $scope.paginationConf.totalItems = data.totalCount;
            });
        };

        $scope.load();

        $scope.deleteImage = function(image) {
            layer.confirm('确定要删除图片吗？', {
                btn: ['删除', '取消'] //按钮
            }, function (index) {
                $ajax.post('/cms/wechat/material/delete', {
                    mpAppid: $rootScope.mpAppid,
                    mediaId: image.mediaId
                }, function() {
                    $scope.load();
                    Notify.success('图片已删除');
                    layer.close(index);
                });
            }, function () {
            });
        };
    }]);