app.controller('messageController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.sendTypeArray = {
            mpnews: {
                key: 'mpnews',
                value: '微信图文'
            }, image: {
                key: 'image',
                value: '图片'
            }, text: {
                key: 'text',
                value: '文字消息'
            }
        };
        $scope.selectedType = {
            key: 'mpnews',
            value: '微信图文'
        };

        var $uploadImageBtn;
        $scope.changeType = function (key) {
            $scope.selectedType = $scope.sendTypeArray[key];

            if(key == 'image' && !$uploadImageBtn) {
                //上传图片
                $uploadImageBtn = $('.uploadImageBtn', '.message-page');
                $uploadImageBtn.upload({
                    action: "/cms/wechat/material/add", //上传地址
                    location: ".message-page",
                    fileName: "file",                        //文件名称。用于后台接收
                    params: {
                        appid: $rootScope.mpAppid,
                        type: 'image'
                    },                               //参数
                    accept: ".jpeg,.bmp,.jpg,.png",                    //文件类型
                    complete: function (result) {
                        if (result.code == 200) {
                            console.log(result);
                            $scope.$apply(function() {
                                $scope.data.selectedImage = result.data;
                            });
                        } else {
                            Notify.error(result.msg);
                        }
                        $(this).val('');
                    },
                    submit: function ($form) {   //提交之前
                        var filename = $form.find(':file').val().toLowerCase();
                        if (!/(\.jpg|\.jpeg|\.bmp|\.png)$/i.test(filename)) {
                            Notify.error('只能是jpg或png或jpeg或bmp格式的图片文件！');
                            return false;
                        } else {
                            return true;
                        }
                    }
                });
            }
        };

        $scope.followerList = [];

        $scope.filterParams = {};

        $scope.data = {
            text: ''
        };
        $scope.selectImage = function () {
            $scope.$parent.addImageMessage(function (image) {
                $scope.data.selectedImage = image;
            });
        };
        $scope.selectNews = function () {
            $scope.$parent.addNewsMessage(function (news) {
                $scope.data.selectedNews = news;
            });
        };

        $scope.onEmotionSelect = function(id, title) {
            $scope.data.text = $scope.data.text + '/' + title;
        };

        $scope.sendMessage = function() {
            if($scope.selectedFollowersCount < 2) {
                Notify.warn('群发消息必须至少向两位用户发送！');
                return false;
            }
            var mediaId;
            var title;
            if($scope.selectedType.key == 'mpnews') {
                if(!$scope.data.selectedNews) {
                    Notify.warn('请选择一条微信图文!');
                    return;
                }
                mediaId = $scope.data.selectedNews.mediaId;
                title = angular.toJson($scope.data.selectedNews.content.articles.map(function(article) {
                    return {
                        thumbMediaId: article.thumbMediaId,
                        title: article.title,
                        url: article.url
                    }
                }));
            } else if($scope.selectedType.key == 'text') {
                if(!$scope.data.text) {
                    Notify.warn('请输入文本消息内容!');
                    return;
                }
            } else if($scope.selectedType.key == 'image') {
                if(!$scope.data.selectedImage) {
                    Notify.warn('请选择图片素材!');
                    return;
                }
                mediaId = $scope.data.selectedImage.mediaId;
                title = $scope.data.selectedImage.name;
            }
            layer.confirm('确定要发送消息吗？', {
                btn: ['发送', '取消'] //按钮
            }, function (index) {
                $scope.filterParams.mpAppid = $scope.mpAppid;
                $scope.filterParams.title = title;
                $scope.filterParams.content = $scope.data.text;
                $scope.filterParams.mediaId = mediaId;
                $scope.filterParams.msgType = $scope.selectedType.key;
                $ajax.post('/cms/wechat/message/send', $scope.filterParams, function (data) {
                    Notify.success('消息已发送!');
                    $scope.loadHistory();
                });
                layer.close(index);
            }, function () {
            });
        };

        $scope.selectedFollowersCount = 0;
        $scope.getSelectedFollowersCount = function() {
            $ajax.get('/cms/wechat/userlist/1/0', $scope.filterParams, function (data) {
                $scope.selectedFollowersCount = data.total;
            });
        };

        $scope.onFilter = function(filterParams) {
            $scope.filterParams = filterParams;
            $scope.getSelectedFollowersCount();
        };



        //----------以下为发送记录------------//

        //分页信息
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.changePath();
            }
        };

        $scope.thisYear = new Date().getFullYear();
        //列表数据
        $scope.tableData = [];
        //加载数据请求
        $scope.currentTab = 1;
        $scope.loadHistory = function () {
            $scope.currentTab = 2;
            $ajax.get('/cms/wechatMassMsgHistory/selectForPage', {
                pageSize: $scope.paginationConf.itemsPerPage,
                pageNum: $scope.paginationConf.currentPage
            }, function (data) {
                console.log(data);
                for(var i = data.list.length; i-- ;) {
                    if(data.list[i].type == 'mpnews') {
                        data.list[i].articles = JSON.parse(data.list[i].titles);
                        data.list[i].canDelete = (new Date()/1000 - data.list[i].ctime) < 1800;
                    }
                    data.list[i].tags = JSON.parse(data.list[i].tagJson);
                    console.log(data.list[i]);
                    data.list[i].successRate = parseInt(data.list[i].successCount*100/data.list[i].totalCount);
                }
                $scope.tableData = data.list;
                $scope.paginationConf.totalItems = data.total;
            });
        };

        $scope.deleteMessage = function(id, msgId) {
            layer.confirm('确定要删除该群发消息吗？', {
                btn: ['删除', '取消'] //按钮
            }, function (index) {
                $ajax.get('/cms/wechatMassMsgHistory/deleteByMsgId', {
                    id: id,
                    msgId: msgId
                }, function () {
                    layer.close(index);
                    $scope.loadHistory();
                    Notify.success('消息已删除！');
                }, function(result) {
                    layer.close(index);
                    Notify.error(result.msg);
                });
            }, function () {
            });
        };
    }]);