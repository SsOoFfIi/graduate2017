app.controller('courseEditController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    'Upload',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal, Upload) {
        $scope.saved = false;
        $scope.digitsRegex = /^[1-9]\d{0,4}$/;
        $scope.numberRegex = /^(([1-9]\d{0,5})|0)(\.\d{1,2})?$/;
        $scope.progressPercentage = 0;
        $scope.uploadComplete = true;
        $scope.file = {};
        $scope.convertString = function(s) {
            return s.replace(/\n/g, '<br>');
        };

        $scope.defaultCoverImgs = [
            'http://public.cdn.sinoxk.com/cms/customer/train/files/20170111172046CQAAJL.png',
            'http://public.cdn.sinoxk.com/cms/customer/train/files/201701111835580miR7x.png',
            'http://public.cdn.sinoxk.com/cms/customer/train/files/20170111183656sGAP42.png',
            'http://public.cdn.sinoxk.com/cms/customer/train/files/DQToEfPrmi9R.png',
            'http://public.cdn.sinoxk.com/cms/customer/train/files/5H95c9HRHis9.png'
        ];

        //初始化数据
        $scope.data = {
            name: '',
            coverUrl: $scope.defaultCoverImgs[0],
            fileUrl: '',
            fileExt: '',
            point: '',
            status: 0
        };

        if($stateParams.id) {
            $ajax.get('/cms/train/selectOneCourse', {trainId: $stateParams.id}, function(data) {
                $scope.data = data;
                $scope.file = {
                    name: data.fileName,
                    size: data.fileSize
                }
            });
        }

        $scope.saveCourse = function() {
            if($scope.data.id) {
                    $ajax.post('/cms/train/updateCourse', $scope.data, function() {
                    $scope.saved = true;
                }, function(result) {
                    Notify.error(result.msg);
                });
            } else {
                $ajax.post('/cms/train/insertCourse', $scope.data, function(result) {
                    $scope.saved = true;
                    $scope.data.id = result;
                }, function(result) {
                    Notify.error(result.msg);
                });
            }
        };

        $scope.uploadCover = function (file, errFiles) {
            if(!file) return;
            if (!/(\.jpg|\.jpeg|\.png)$/i.test(file.name)) {
                Notify.error('只能是jpg(jpeg)或png格式的图片！');
                return false;
            }
            Upload.upload({
                url: '/cms/train/upload/file',
                data: {file: file}
            }).then(function (resp) {
                var result = resp.data;
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                if (result.code == 200) {
                    $scope.data.coverUrl = result.data.url;
                } else {
                    Notify.error(result.msg);
                }
            }, function (resp) {
                Notify.error('上传图片失败！');
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

        $scope.uploadFile = function (file, errFiles) {
            if(!file && !errFiles.length) return;
            if(errFiles[0]) {
                if(errFiles[0].$error == 'maxSize') {
                    Notify.error('文件最大不超过150MB');
                }
                return;
            }
            if (!/(\.pdf|\.mp4)$/i.test(file.name)) {
                Notify.error('只能是pdf文件或MP4视频文件！');
                return false;
            }

            $scope.file = file;
            $scope.data.fileUrl = '';
            $scope.uploadComplete = false;
            Upload.upload({
                url: '/cms/train/upload/file',
                data: {file: file}
            }).then(function (resp) {
                $scope.uploadComplete = true;
                var result = resp.data;
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                if (result.code == 200) {
                    $scope.data.fileUrl = result.data.url;
                    $scope.data.fileMeta = result.data.fileMeta;
                    $scope.data.fileName = $scope.file.name;
                    $scope.data.fileSize = $scope.file.size;
                    $scope.progressPercentage = 0;
                } else {
                    Notify.error(result.msg);
                }
            }, function (resp) {
                Notify.error('上传文件失败！');
            }, function (evt) {
                $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        };
    }]);