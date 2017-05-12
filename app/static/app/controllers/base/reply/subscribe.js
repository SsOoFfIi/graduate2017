app.controller('subscribeController', [
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
            },
            news: {
                key: 'news',
                value: '高级图文'
            },
            image: {
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
                $uploadImageBtn = $('.uploadImageBtn', '.reply-page');
                $uploadImageBtn.upload({
                    action: "/cms/wechat/material/add", //上传地址
                    location: ".reply-page",
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
        $scope.selectLinkArticle = function () {
            $scope.$parent.addLinkArticle(function (news) {
                $scope.data.selectedLinkArticle = news;
            });
        };

        $scope.onEmotionSelect = function(id, title) {
            $scope.data.text = $scope.data.text + '/' + title;
        };

        $scope.replyRemoved = false;
        $scope.load = function() {
            $ajax.get('/cms/wechat/reply/subscribe', {
                mpAppid: $rootScope.mpAppid
            }, function (data) {
                console.log(data);
                if(data) {
                    $scope.replyRemoved = !data.content && !data.mpAppid;
                    $scope.changeType(data.type);
                    if($scope.selectedType.key == 'mpnews') {
                        $ajax.get('/cms/wechat/material/news/info', {
                            mediaId: data.content
                        }, function (result) {
                            $scope.data.selectedNews = {content: result};
                            console.log(result);
                        }, function(result) {
                            $scope.data.selectedNews = {isDeleted: true};
                        });
                    }
                    if($scope.selectedType.key == 'news') {
                        $ajax.get('/cms/wechatMpMsgPicLink/selectByMediaId', {
                            mediaId: data.content
                        }, function (result) {
                            result.content = JSON.parse(result.content);
                            $scope.data.selectedLinkArticle = result;
                            console.log(result);
                        }, function(result) {
                            $scope.data.selectedLinkArticle = {isDeleted: true};
                        });
                    } else if($scope.selectedType.key == 'text') {
                        $scope.data.text = data.content;
                    } else if($scope.selectedType.key == 'image') {
                        $scope.data.selectedImage = {
                            mediaId: data.content
                        };
                    }
                }
            });
        };

        $scope.load();

        $scope.save = function() {
            var content;
            if($scope.selectedType.key == 'mpnews') {
                if(!$scope.data.selectedNews || $scope.data.selectedNews.isDeleted) {
                    Notify.warn('请选择一条微信图文!');
                    return;
                }
                content = $scope.data.selectedNews.mediaId;
            } else if($scope.selectedType.key == 'news') {
                if(!$scope.data.selectedLinkArticle || $scope.data.selectedLinkArticle.isDeleted) {
                    Notify.warn('请选择一条高级图文!');
                    return;
                }
                content = $scope.data.selectedLinkArticle.mediaId;
            } else if($scope.selectedType.key == 'text') {
                if(!$scope.data.text) {
                    Notify.warn('请输入文字内容！');
                    return;
                }
                content = $scope.data.text;
            } else if($scope.selectedType.key == 'image') {
                if(!$scope.data.selectedImage) {
                    Notify.warn('请选择图片素材!');
                    return;
                }
                content = $scope.data.selectedImage.mediaId;
            }
            $ajax.post('/cms/wechat/reply/subscribe/update', {
                mpAppid: $scope.mpAppid,
                content: content,
                type: $scope.selectedType.key
            }, function (data) {
                Notify.success('保存成功!');
                if($scope.selectedType.key == 'mpnews') {
                    $scope.data.selectedImage = undefined;
                    $scope.data.selectedLinkArticle = undefined;
                    $scope.data.text = ''
                }
                if($scope.selectedType.key == 'news') {
                    $scope.data.selectedNews = undefined;
                    $scope.data.selectedImage = undefined;
                    $scope.data.text = ''
                }
                if($scope.selectedType.key == 'text') {
                    $scope.data.selectedImage = undefined;
                    $scope.data.selectedNews = undefined;
                    $scope.data.selectedLinkArticle = undefined;
                }
                if($scope.selectedType.key == 'image') {
                    $scope.data.selectedNews = undefined;
                    $scope.data.selectedLinkArticle = undefined;
                    $scope.data.text = '';
                }
                $scope.replyRemoved = false;
            });
        };

        $scope.remove = function() {
            layer.confirm('删除后，关注该公众号的用户将不再接收该回复，确定删除？', {
                btn: ['删除', '取消'] //按钮
            }, function(index) {
                $ajax.post('/cms/wechat/reply/subscribe/update', {
                    mpAppid: $scope.mpAppid,
                    content: '',
                    type: 'text'
                }, function () {
                    $scope.replyRemoved = true;
                    layer.close(index);
                    $scope.data.text = '';
                    $scope.data.selectedImage = undefined;
                    $scope.data.selectedNews = undefined;
                    $scope.data.selectedLinkArticle = undefined;
                });
            });
        };
    }]);