app.controller('versionController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        /**
         * 平台
         * @type {[*]}
         */
        $scope.platform = [
            {
                type: 'ANDROID',
                name: 'Android'
            }, {
                type: 'IOS',
                name: 'iOS'
            }

        ]
        $scope.versions = [];//版本列表
        $scope.data = {
            os: $stateParams.os || 'ANDROID',//当前选择的平台
        }

        //分页信息
        $scope.paginationConf = {
            currentPage: $stateParams.pageNum || 1,
            totalItems: 0,
            itemsPerPage: $stateParams.pageSize || 10,
            onChange: function () {
                $scope.changePath();
            }
        };
        /**
         * 重新加载
         */
        $scope.changePath = function () {
            $state.go('app.xkapp.version', {
                pageNum: $scope.paginationConf.currentPage,
                pageSize: $scope.paginationConf.itemsPerPage,
                os: $scope.data.os
            });
        };

        //加载数据请求
        $scope.load = function () {
            $ajax.get('/support/app-versions', {
                pageSize: $scope.paginationConf.itemsPerPage,
                pageNum: $scope.paginationConf.currentPage,
                os: $scope.data.os
            }, function (data) {
                $scope.versions = data.list;
                $scope.paginationConf.totalItems = data.total;
            });
        };
        $scope.load();
        /**
         * 发布新app
         * @param app
         */
        $scope.newApp = function (app) {
            var modalInstance = $modal.open({
                windowClass: '',
                templateUrl: 'newAppModalContent.html',
                controller: 'newAppController',
                backdrop: 'static',
                size: 'lg',

                resolve: {
                    data: function () {
                        return {
                            app: angular.copy(app),
                            callback: function () {
                                $scope.load();
                            }
                        }
                            ;
                    }
                }
            });

            // modalInstance.result.then(function (selectedItem) {
            //     $scope.selected = selectedItem;
            // }, function () {
            //     //$log.info('Modal dismissed at: ' + new Date());
            // });
        };


    }]);

app.controller('newAppController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', 'Upload', function ($scope, $rootScope, $ajax, $modalInstance, data, Upload) {
    //是否新增
    $scope.isCreate = !data.app;
    console.log($scope.isCreate)
    $scope.data = {
        title: '发布新版本',
        progressPercentage: 0,//文件上传的进度
        uploadComplete: true,//上传是否完成
        app: {},
        file: {}
    }


    //对话框标题
    $scope.title = $scope.isCreate ? '发布新版本' : ('编辑' + (data.app.os == 'ANDROID' ? 'Android' : 'iOS') + '版本');
    data.app = data.app || {
            appType: 'ASST',
            versionName: '',//版本名
            versionCode: '',//版本号
            os: 'ANDROID',//当前平台
            isForceUpgrade: '0',//是否强制更新
            url: '',//文件地址
        };
    $scope.data.app = data.app;

    $scope.ok = function () {
        if ($scope.data.app.os == "IOS") {
            $scope.data.app.url = '';
        }
        //处理获取数据
        if ($scope.isCreate) {
            //处理获取数据
            $ajax.post('/support/app-versions', $scope.data.app, function () {
                Notify.success("发布成功");
                $modalInstance.close();
                data.callback();
            });
        } else {
            //处理获取数据
            $ajax.put('/support/app-versions', $scope.data.app, function () {
                Notify.success("修改成功");
                $modalInstance.close();
                data.callback();
            });
        }
    };
    $scope.cancel = function () {
        $modalInstance.close();
    }
    /**
     * 上传安装包
     * @param file
     * @param errFiles
     * @returns {boolean}
     */
    $scope.uploadFile = function (file, errFiles) {
        if (!file && !errFiles.length) return;
        if (errFiles[0]) {
            if (errFiles[0].$error == 'maxSize') {
                Notify.error('文件最大不超过150MB');
            }
            return;
        }
        if (!/(\.apk|\.ipa)$/i.test(file.name)) {
            Notify.error('只能是安装包文件！');
            return false;
        }

        $scope.data.file = file;
        $scope.data.uploadComplete = false;
        Upload.upload({
            url: '/support/app-versions/upload',
            data: {file: file}
        }).then(function (resp) {
            $scope.data.uploadComplete = true;
            var result = resp.data;
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            if (result.code == 200) {
                //后台解析apk回传数据
                $scope.data.app.url = result.data.url;
                $scope.data.app.versionName = result.data.versionName;
                $scope.data.app.versionCode = result.data.versionCode;

                $scope.data.progressPercentage = 0;
            } else {
                Notify.error(result.msg);
            }
        }, function (resp) {
            Notify.error('上传文件失败！');
        }, function (evt) {
            $scope.data.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    };
}]);