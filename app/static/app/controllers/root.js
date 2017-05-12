app.controller('rootController', ['$scope', '$rootScope', '$ajax', '$modal', '$state', '$http', '$cookies', '$location', function ($scope, $rootScope, $ajax, $modal, $state, $http, $cookies, $location) {
    $rootScope.userData = {};//保存全局用户信息
    // $rootScope.storeMap = {}; //保存门店列表
    $rootScope.version = '2.2';

    $rootScope.table = {};//保存全局表格信息

    $rootScope.showLoading = false;

    $(window).resize(function () {
        var width = $(window).width();
        console.log(width);
        if (width < 1000) {
            $('.page-sidebar:not(".menu-compact") .sidebar-collapse').click();
        }
    });

    if (!$cookies.mpAppid) {
        $location.replace('/');
    }
    $rootScope.mpAppid = $cookies.mpAppid;
    $http.defaults.headers.common.appid = $cookies.mpAppid;

    $rootScope.copyUrl = function (id) {
        try {
            document.querySelector(id).select();
            document.execCommand('copy');
            Notify.success('链接已复制！');
            return true;
        } catch (e) {
            Notify.error('您的浏览器不支持复制链接，请手动选择链接后从右键菜单复制！');
            return false;
        }
    };

    $rootScope.copyUrlAndGo = function (id, routerName) {
        var urlCopied = $rootScope.copyUrl(id);
        if (urlCopied) {
            $state.go(routerName);
        }
    };

    $scope.$on('unreadChanged', function (event, message) {
        $scope.$broadcast("unreadChangedFromParent", message);
    });
    $scope.addTextMessage = function (callback, defaultContent) {
        var modalInstance = $modal.open({
            windowClass: '',
            templateUrl: 'addTextMessageModal.html',
            controller: 'addTextMessageModalController',
            backdrop: 'static',
            size: 0,
            resolve: {
                data: function () {
                    return {
                        callback: callback,
                        defaultContent: defaultContent
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    $scope.addImageMessage = function (callback) {
        var modalInstance = $modal.open({
            windowClass: '',
            templateUrl: 'addImageMessageModal.html',
            controller: 'addImageMessageModalController',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                data: function () {
                    return {
                        callback: callback
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    $scope.addNewsMessage = function (callback) {
        var modalInstance = $modal.open({
            windowClass: '',
            templateUrl: 'addNewsMessageModal.html',
            controller: 'addNewsMessageModalController',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                data: function () {
                    return {
                        callback: callback
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    $scope.addLinkArticle = function (callback) {
        var modalInstance = $modal.open({
            windowClass: '',
            templateUrl: 'addLinkArticleModal.html',
            controller: 'addLinkArticleModalController',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                data: function () {
                    return {
                        callback: callback
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
        });
    };
    /**
     * 获取用户信息及权限列表
     */
    $rootScope.getUserInfo = function () {
        $ajax.get('/index/userdata/', {}, function (data) {
            $rootScope.userData = data;
            console.log($rootScope.userData)
        });
    };
    $rootScope.getUserInfo();
    /**
     * 1权限判断
     * @param id
     * @returns {boolean}
     */
    $rootScope.permission = function (id) {
        if (!$rootScope.userData.powers || $rootScope.userData.powers.length < 1)return false;//后台接口异常,默认授权
        return $rootScope.userData.powers.map(function (power) {
                return power.menuCode
            }).indexOf(id + '') < 0;
    }

}]);


app.controller('newFeatureModalController', ['$scope', '$ajax', '$state', '$modalInstance', function ($scope, $ajax, $state, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.gotoMember = function () {
        $modalInstance.dismiss('cancel');
        $state.go('app.base.member', {}, {reload: true});
    };
    $scope.gotoMessage = function () {
        $modalInstance.dismiss('cancel');
        $state.go('app.base.message', {}, {reload: true});
    };
}]);


app.controller('navbarController', ['$scope', '$ajax', '$modal', function ($scope, $ajax, $modal) {

    //$scope.volumeOff = window.localStorage.getItem('volumeOff') == 'true';
    $scope.volumeOff = true;

    $scope.toggleVolume = function (flag) {
        window.localStorage.setItem('volumeOff', flag);
        $scope.volumeOff = flag;
    };




    $scope.changePassword = function () {
        $modal.open({
            windowClass: '',
            templateUrl: 'changePasswordModalContent.html',
            controller: 'changePasswordController',
            size: 0,
            resolve: {
                data: function () {
                    return {};
                }
            }
        });
    };

    $scope.logout = function () {
        // $ajax.post('/index/logout', {}, function (result) {
        //     location.replace('/login');
        // });
                    location.replace('/login');

    }
}]);

/**
 * 修改密码
 */
app.controller('changePasswordController', ['$scope', '$ajax', '$modalInstance', 'data', function ($scope, $ajax, $modalInstance, data) {
    $scope.data = {
        oldPassword: '',
        newPassword: '',
        confirmpwd: '',
    };

    $scope.ok = function () {
        // $scope.finallypwd='';
        // if ($scope.data.newPassword ==$scope.data.confirmpwd){
        //     $scope.fianllypwd=$scope.newPassword;
        // }
        if ($scope.changePasswordForm.$valid) {
            $ajax.post('/account/pwdmodify/', {
                username:$scope.userData.username,
                oldpwd:$scope.data.oldPassword,
                newpwd:$scope.data.newPassword
            }, function () {
                Notify.success("密码已修改成功");
                $modalInstance.close();
            });
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);


app.controller('addTextMessageModalController', ['$scope', '$ajax', '$modalInstance', 'data', function ($scope, $ajax, $modalInstance, data) {
    $scope.data = {
        message: data.defaultContent || ''
    };

    $scope.onEmotionSelect = function (id, title) {
        $scope.data.message = $scope.data.message + '/' + title;
        $('.send-text-message-form textarea').focus();
    };

    $scope.ok = function () {
        if ($scope.changePasswordForm.$valid) {
            data.callback($scope.data.message);
            $modalInstance.dismiss('cancel');
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('addImageMessageModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    $scope.selectedImage = null;
    $scope.imageList = [];
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
            $scope.selectedImage = null;
            $scope.imageList = data.items;
            $scope.paginationConf.totalItems = data.totalCount;
        });
    };

    $scope.load();

    $scope.ok = function () {
        if ($scope.selectedImage) {
            data.callback($scope.selectedImage);
            $modalInstance.dismiss('cancel');
        } else {
            Notify.warn('请选择一张图片！');
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('addNewsMessageModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    $scope.selectedNews = null;
    $scope.newsList = [];
    //分页信息
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 9,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.load();
        }
    };

    $scope.load = function () {
        $ajax.get('/cms/wechat/material/news', {
            mpAppid: $rootScope.mpAppid,
            offset: ($scope.paginationConf.currentPage - 1) * $scope.paginationConf.itemsPerPage,
            count: $scope.paginationConf.itemsPerPage
        }, function (data) {
            $scope.selectedNews = null;
            $scope.newsList = data.items;
            $scope.paginationConf.totalItems = data.totalCount;
        });
    };

    $scope.load();

    $scope.ok = function () {
        if ($scope.selectedNews) {
            data.callback($scope.selectedNews);
            $modalInstance.dismiss('cancel');
        } else {
            Notify.warn('请选择一条微信图文素材！');
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('addLinkArticleModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    $scope.selectedNews = null;
    $scope.newsList = [];
    //分页信息
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 9,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function () {
            $scope.load();
        }
    };

    $scope.load = function () {
        $ajax.get('/cms/wechatMpMsgPicLink/selectForPage', {
            pageNum: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage
        }, function (data) {
            $scope.selectedNews = null;
            $scope.newsList = data.list;
            for (var i = data.size; i--;) {
                data.list[i].content = JSON.parse(data.list[i].content);
            }
            $scope.paginationConf.totalItems = data.total;
        });
    };

    $scope.load();

    $scope.ok = function () {
        if ($scope.selectedNews) {
            data.callback($scope.selectedNews);
            $modalInstance.dismiss('cancel');
        } else {
            Notify.warn('请选择一条高级图文素材！');
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('commonModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);