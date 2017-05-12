app.controller('addArticleController', [
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
        $scope.ueditorConfig = {
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
            toolbars: [['Bold', 'italic', 'underline', 'strikethrough', 'forecolor', 'backcolor', '|',
                'fontsize', 'insertorderedlist', 'insertunorderedlist', '|',
                'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify']],
            //focus时自动清空初始化时的内容
            autoClearinitialContent: true,
            //关闭字数统计
            wordCount: false,
            //关闭elementPath
            elementPathEnabled: false,
            height: 500,
            selectImageCallback: function(editor) {
                $scope.$parent.addImageMessage(function (imageMaterial) {
                    editor.focus();
                    editor.execCommand('inserthtml','<img style="max-width: 100%;height: auto;" src="'+imageMaterial.url+'"/>');
                });
            }
        };
        $scope.articles = [{}];
        $scope.selectedArticle = $scope.articles[0];

        if ($scope.isEdit) {
            $ajax.get('/cms/wechat/material/news/info', {
                mpAppid: $rootScope.mpAppid,
                mediaId: $stateParams.mediaId
            }, function (result) {
                console.log(result);
                $scope.articles = result.articles;
                $scope.selectedArticle = $scope.articles[0];
            });
        }


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
                $scope.selectedArticle.thumbMediaId = imageMaterial.mediaId;
            });
        };

        $scope.deleteArticleThumb = function () {
            delete $scope.selectedArticle.thumbMediaId;
        };

        $scope.addNews = function () {
            for (var i = 0; i < $scope.articles.length; i++) {
                var article = $scope.articles[i];
                if (!article.title) {
                    Notify.warn('请填写标题！');
                    $scope.selectedArticle = article;
                    $scope.selectedArticleIndex = i;
                    return false;
                }
                if (!article.thumbMediaId) {
                    Notify.warn('请添加封面图片！');
                    $scope.selectedArticle = article;
                    $scope.selectedArticleIndex = i;
                    return false;
                }
                if (!article.content) {
                    Notify.warn('请填写文章内容！');
                    $scope.selectedArticle = article;
                    $scope.selectedArticleIndex = i;
                    return false;
                }
            }
            if (!$scope.isEdit) {
                $ajax.post('/cms/wechat/material/news/add', {
                    mpAppid: $rootScope.mpAppid,
                    news: {
                        articles: $scope.articles
                    }
                }, function (data) {
                    Notify.success('图文素材已保存!');
                    $scope.saved = true;
                    $state.go('app.base.material.mpnews');
                });
            } else {
                $ajax.post('/cms/wechat/material/news/update', {
                    mpAppid: $rootScope.mpAppid,
                    mediaId: $stateParams.mediaId,
                    news: {
                        articles: $scope.articles
                    }
                }, function (data) {
                    Notify.success('图文素材已更新!');
                    $scope.saved = true;
                    $state.go('app.base.material.mpnews');
                });
            }
        };



        //上传图片
        var $uploadImageBtn = $('.uploadImageBtn', '.addArticlePage');
        $uploadImageBtn.upload({
            action: "/cms/wechat/material/add", //上传地址
            location: ".addArticlePage",
            fileName: "file",                        //文件名称。用于后台接收
            params: {
                appid: $rootScope.mpAppid,
                type: 'image'
            },                               //参数
            accept: ".jpeg,.bmp,.jpg,.png",                    //文件类型
            complete: function (result) {
                if (result.code == 200) {
                    $scope.$apply(function() {
                        $scope.selectedArticle.thumbMediaId = result.data.mediaId;
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
    }]);