app.controller('addLinkArticleController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    '$timeout',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal, $timeout) {
        $scope.isEdit = !!$stateParams.mediaId;
        $scope.linkArticleData = {
            type: 'news'
        };
        $scope.articles = [{}];
        $scope.selectedArticle = $scope.articles[0];

        if ($scope.isEdit) {
            $ajax.get('/cms/wechatMpMsgPicLink/selectByMediaId', {
                mediaId: $stateParams.mediaId
            }, function (result) {
                $scope.linkArticleData = result;
                $scope.articles = JSON.parse(result.content);
                $scope.selectedArticle = $scope.articles[0];
            });
        }


        $scope.selectedArticleIndex = 0;
        $scope.selectArticle = function (article, index) {
            $scope.selectedArticle = article;
            $scope.selectedArticleIndex = index;
        };
        $scope.deleteArticle = function (index) {
            $scope.articles.splice(index, 1);
            $scope.selectedArticle = $scope.articles[0];
            $scope.selectedArticleIndex = 0;
        };
        $scope.addArticle = function () {
            $scope.selectedArticle = {};
            $scope.articles.push($scope.selectedArticle);
            $scope.selectedArticleIndex = $scope.articles.length-1;
        };

        $scope.selectImage = function () {
            $scope.$parent.addImageMessage(function (imageMaterial) {
                console.log(imageMaterial);
                $scope.selectedArticle.picurl = imageMaterial.url;
                $scope.selectedArticle.localurl = '/cms/wechat/material/image/' + $scope.mpAppid + '/' + imageMaterial.mediaId;
            });
        };

        $scope.deleteArticleThumb = function () {
            delete $scope.selectedArticle.picurl;
            delete $scope.selectedArticle.localurl;
        };

        $scope.saved = false;
        $scope.$on('$stateChangeStart', function (event){
            if(!$scope.saved) {
                if (!confirm('内容未保存，是否确定离开？')){
                    event.preventDefault();
                    $timeout(function() {
                        $('.loading-container').removeClass('app-loading');
                    }, 300);
                }
            }
        });

        window.onbeforeunload = function (event) {
            return '内容未保存，是否确定离开？';
        };
        $scope.$on("$destroy", function(event){
            window.onbeforeunload = null;
        });

        $scope.addNews = function () {
            for (var i = 0; i < $scope.articles.length; i++) {
                var article = $scope.articles[i];
                if (!article.title) {
                    Notify.warn('请填写标题！');
                    $scope.selectedArticle = article;
                    $scope.selectedArticleIndex = i;
                    return false;
                }
                if (!article.picurl) {
                    Notify.warn('请添加封面图片！');
                    $scope.selectedArticle = article;
                    $scope.selectedArticleIndex = i;
                    return false;
                }
                if (!article.url) {
                    Notify.warn('请正确填写链接！');
                    $scope.selectedArticle = article;
                    $scope.selectedArticleIndex = i;
                    return false;
                }
            }
            $scope.linkArticleData.content = angular.toJson($scope.articles);
            if ($scope.isEdit) {
                $ajax.post('/cms/wechatMpMsgPicLink/updateByMediaId', $scope.linkArticleData, function (data) {
                    Notify.success('高级图文素材已更新!');
                    $scope.saved = true;
                    $state.go('app.base.material.news');
                });
            } else {
                $ajax.post('/cms/wechatMpMsgPicLink/insert', $scope.linkArticleData, function (data) {
                    Notify.success('高级图文素材已保存!');
                    $scope.saved = true;
                    $state.go('app.base.material.news');
                });
            }
        };



        //上传图片
        var $uploadImageBtn = $('.uploadImageBtn', '.addLinkArticlePage');
        $uploadImageBtn.upload({
            action: "/cms/upload", //上传地址
            location: ".addLinkArticlePage",
            fileName: "file",                        //文件名称。用于后台接收
            params: {
                appid: $rootScope.mpAppid,
                type: 'image'
            },                               //参数
            accept: ".jpeg,.jpg,.png",                    //文件类型
            complete: function (result) {
                if (result.code == 200) {
                    $scope.$apply(function() {
                        $scope.selectedArticle.localurl = result.data.cos_path;
                        $scope.selectedArticle.picurl = result.data.wx_path;
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