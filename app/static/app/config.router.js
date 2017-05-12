'use strict';
var app = angular.module('app');
app.run(
    [
        '$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)
    .config(
        [
            '$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {

                $urlRouterProvider
                    .otherwise('/home');
                $stateProvider
                    .state('app', {
                        'abstract': true,
                        url: '',
                        controller: 'rootController',
                        templateUrl: '/static/views/common/rootLayout.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        '/static/app/controllers/root.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    //==========================================start==========================================
                    .state('app.manager', {
                        url: '',
                        controller: 'managerController',
                        templateUrl: '/static/views/manager/managerLayout.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        '/static/app/controllers/manager/manager.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.main', {//首页
                        url: '',
                        controller: 'mainController',
                        templateUrl: '/static/views/main/mainLayout.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        '/static/app/controllers/main/main.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.main.overview', {
                        url: '/overview?&serialNum&page',
                        controller: 'overviewController',
                        templateUrl: '/static/views/main/overview.html',
                        ncyBreadcrumb: {
                            label: '概览',
                            description: '',
                            hideBreadcrumb: true
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        '/static/app/controllers/main/overview.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.main.statistics',{
                        url:'/statistics?&serialNum&tablePwd&page',
                        controller:'statisticsController',
                        templateUrl:'/static/views/main/statistics.html',
                        ncyBreadcrumb:{
                            label:'数据统计',
                            description:'',
                            hideBreadcrumb:true
                        },
                        resolve:{
                            deps:[
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache:false,
                                                    serie:true,
                                                    files:[
                                                        '/static/app/controllers/main/statistics.js'
                                                    ]
                                                }
                                            );
                                        }
                                    );
                                }
                            ]
                        }
                    })

                    .state('app.main.dataEntry',{
                        url:'/dataEntry?&serialNum&tablePwd&userName',//URL基于用户浏览该应用所在的状态
                        controller:'dataController',
                        templateUrl:'/static/views/main/dataEntry.html',
                        ncyBreadcrumb:{
                          label:'数据录入与删除',
                          description:'',
                          hideBreadcrumb:true
                        },
                        resolve:{
                            deps:[
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache:false,
                                                    serie:true,
                                                    files:[
                                                        '/static/app/controllers/main/dataEntry.js'
                                                    ]
                                                }
                                            )
                                        }
                                    )
                                }
                            ]
                        }
                    })

                    .state('app.main.form',{
                        url:'/form',
                        controller:'formController',
                        templateUrl:'/static/views/main/form.html',
                        ncyBreadcrumb:{
                            label:'创建表格',
                            description:'',
                            hideBreadcrumb:true
                        },
                        resolve:{
                            deps:[
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return ($ocLazyLoad).load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie:true,
                                                    cache:false,
                                                    files:[
                                                        '/static/app/controllers/main/form.js'
                                                    ]
                                                }
                                            )
                                        }
                                    )
                                }
                            ]
                        }
                    })


                    .state('app.manager.custom', {//首页
                        url: '/home',
                        controller: 'customController',
                        templateUrl: '/static/views/manager/custom/customManager.html',
                        ncyBreadcrumb: {
                            label: '首页',
                            description: '',
                            hideBreadcrumb: true
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        '/static/app/controllers/manager/custom/custom.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })

                    //==========================================end============================================
                    .state('app.base', {
                        url: '',
                        controller: 'baseController',
                        templateUrl: '/views/base/baseLayout',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/base.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.home', {
                        url: '/overview&serialNum',
                        controller: 'overviewController',
                        templateUrl: '/views/base/overview',
                        ncyBreadcrumb: {
                            label: '概况',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(
                                        {
                                            cache: false,
                                            serie: true,
                                            files: [
                                                'lib/flot/jquery.flot.min.js',
                                                'lib/flot/jquery.flot.resize.min.js',
                                                'lib/flot/jquery.flot.tooltip.min.js',
                                                'lib/flot/jquery.flot.orderBars.js',
                                                // 'app/controllers/base/support.js'
                                            ]
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.base.store', {
                        url: '/store?pageNum&pageSize&name',
                        controller: 'storeController',
                        templateUrl: '/view?view=/base/store',
                        ncyBreadcrumb: {
                            label: '门店管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/store.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })

                    .state('app.base.assistant', {//空页面
                        url: '/assistant',
                        controller: 'assistantLayoutController',
                        templateUrl: '/view?view=/base/assistant/layout',
                        ncyBreadcrumb: {
                            label: '店员管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/assistant/assistant.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.assistant.assistantList', {//店员管理
                        url: '/assistant?pageNum&pageSize&name&customerStoreId',
                        controller: 'assistantController',
                        templateUrl: '/view?view=/base/assistant/assistantList',
                        ncyBreadcrumb: {
                            label: '店员管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/assistant/assistantList.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.assistant.assistant4Member', {//店员下属会员列表
                        url: '/assistant4Member/:name/:assistantId?pageNum&pageSize&keyWord',
                        controller: 'assistant4MemberController',
                        templateUrl: '/view?view=/base/assistant/assistant4Member',
                        ncyBreadcrumb: {
                            label: '店员管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/assistant/assistant4Member.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.message', {
                        url: '/message',
                        controller: 'messageController',
                        templateUrl: '/view?view=/base/message',
                        ncyBreadcrumb: {
                            label: '群发消息',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/message.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })

                    .state('app.base.reply', {
                        url: '/reply',
                        controller: 'replyController',
                        templateUrl: '/view?view=/base/reply/layout',
                        ncyBreadcrumb: {
                            label: '自动回复',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/reply/reply.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.reply.subscribe', {
                        url: '/subscribe',
                        controller: 'subscribeController',
                        templateUrl: '/view?view=/base/reply/subscribe',
                        ncyBreadcrumb: {
                            label: '自动回复',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/reply/subscribe.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.reply.keywords', {
                        url: '/keywords',
                        controller: 'keywordsController',
                        templateUrl: '/view?view=/base/reply/keywords',
                        ncyBreadcrumb: {
                            label: '自动回复',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/reply/keywords.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.reply.addReply', {
                        url: '/addReply',
                        controller: 'addReplyController',
                        templateUrl: '/view?view=/base/reply/add_reply',
                        ncyBreadcrumb: {
                            label: '添加自动回复',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'ngTagsInput']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/reply/add_reply.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.reply.editReply', {
                        url: '/editReply/:id',
                        controller: 'addReplyController',
                        templateUrl: '/view?view=/base/reply/add_reply',
                        ncyBreadcrumb: {
                            label: '添加自动回复',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'ngTagsInput']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/reply/add_reply.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.menu', {
                        url: '/menu?from',
                        controller: 'menuController',
                        templateUrl: '/view?view=/base/menu',
                        ncyBreadcrumb: {
                            label: '自定义菜单',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/menu.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.follower', {
                        url: '/follower',
                        controller: 'followerController',
                        templateUrl: '/view?view=/base/follower',
                        ncyBreadcrumb: {
                            label: '粉丝管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/follower.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.member', {
                        url: '/member',
                        controller: 'memberController',
                        templateUrl: '/view?view=/base/member/layout',
                        ncyBreadcrumb: {
                            label: '会员管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/member/member.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.member.list', {
                        url: '/list',
                        controller: 'memberListController',
                        templateUrl: '/view?view=/base/member/list',
                        ncyBreadcrumb: {
                            label: '会员管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/member/list.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.member.personas', {
                        url: '/personas',
                        controller: 'personasController',
                        templateUrl: '/view?view=/base/member/personas',
                        ncyBreadcrumb: {
                            label: '用户画像',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/member/personas.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.member.personasDetail', {
                        url: '/personasDetail/:type/:total/:important',//携带三个参数
                        controller: 'personasDetailController',
                        templateUrl: '/view?view=/base/member/personasDetail',
                        ncyBreadcrumb: {
                            label: '用户画像',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/member/personasDetail.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.material', {
                        url: '/material',
                        controller: 'materialController',
                        templateUrl: '/view?view=/base/material/layout',
                        ncyBreadcrumb: {
                            label: '素材管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/material/material.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.material.mpnews', {
                        url: '/mpnews',
                        controller: 'mpnewsController',
                        templateUrl: '/view?view=/base/material/mpnews',
                        ncyBreadcrumb: {
                            label: '素材管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/material/mpnews.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.material.news', {
                        url: '/news',
                        controller: 'newsController',
                        templateUrl: '/view?view=/base/material/news',
                        ncyBreadcrumb: {
                            label: '素材管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/material/news.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.material.images', {
                        url: '/images',
                        controller: 'imagesController',
                        templateUrl: '/view?view=/base/material/images',
                        ncyBreadcrumb: {
                            label: '素材管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/material/images.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.material.addArticle', {
                        url: '/addArticle',
                        controller: 'addArticleController',
                        templateUrl: '/view?view=/base/material/add_article',
                        ncyBreadcrumb: {
                            label: '新建微信图文',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/material/add_article.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.material.editArticle', {
                        url: '/editArticle/:mediaId',
                        controller: 'addArticleController',
                        templateUrl: '/view?view=/base/material/add_article',
                        ncyBreadcrumb: {
                            label: '编辑微信图文',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/material/add_article.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.material.addLinkArticle', {
                        url: '/addLinkArticle',
                        controller: 'addLinkArticleController',
                        templateUrl: '/view?view=/base/material/add_link_article',
                        ncyBreadcrumb: {
                            label: '新建高级图文',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/material/add_link_article.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.material.editLinkArticle', {
                        url: '/editLinkArticle/:mediaId',
                        controller: 'addLinkArticleController',
                        templateUrl: '/view?view=/base/material/add_link_article',
                        ncyBreadcrumb: {
                            label: '编辑微信图文',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/material/add_link_article.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.base.comment', {
                        url: '/comment',
                        controller: 'commentController',
                        templateUrl: '/view?view=/base/comment',
                        ncyBreadcrumb: {
                            label: '消息管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/base/comment.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.tools', {
                        url: '',
                        controller: 'toolsController',
                        templateUrl: '/view?view=/tools/toolsLayout',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/tools/tools.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.tools.coupon', {
                        url: '/coupon',
                        controller: 'couponController',
                        templateUrl: '/view?view=/tools/coupon/layout',
                        ncyBreadcrumb: {
                            label: '优惠券管理',
                            description: '',
                            hideBreadcrumb: true
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/tools/coupon/coupon.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.tools.coupon.create', {
                        url: '/create',
                        controller: 'couponCreateController',
                        templateUrl: '/view?view=/tools/coupon/create',
                        ncyBreadcrumb: {
                            label: '优惠券管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/tools/coupon/create.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.tools.coupon.createType', {
                        url: '/createType',
                        controller: 'couponCreateTypeController',
                        templateUrl: '/view?view=/tools/coupon/create_type',
                        ncyBreadcrumb: {
                            label: '优惠券管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/tools/coupon/create_type.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.tools.coupon.edit', {
                        url: '/edit?batchSequence',
                        controller: 'couponEditController',
                        templateUrl: '/view?view=/tools/coupon/edit',
                        ncyBreadcrumb: {
                            label: '优惠券管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/tools/coupon/edit.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.tools.coupon.published', {
                        url: '/published',
                        controller: 'couponPublishedController',
                        templateUrl: '/view?view=/tools/coupon/published',
                        ncyBreadcrumb: {
                            label: '优惠券管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/tools/coupon/published.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.tools.coupon.list', {
                        url: '/list',
                        controller: 'couponListController',
                        templateUrl: '/view?view=/tools/coupon/list',
                        ncyBreadcrumb: {
                            label: '优惠券管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/tools/coupon/list.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.tools.record', {
                        url: '/record?tab',
                        controller: 'recordController',
                        templateUrl: '/view?view=/tools/record/record',
                        ncyBreadcrumb: {
                            label: '购药记录',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select']).then(
                                        function () {
                                            return $ocLazyLoad.load(
                                                {
                                                    cache: false,
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/tools/record/record.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })

                    .state('app.help.faq.detail', {
                        url: '/:id',
                        controller: 'faqController',
                        templateUrl: '/view?view=/help/faqDetail',
                        ncyBreadcrumb: {
                            label: '常见问题',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(
                                        {
                                            cache: false,
                                            serie: true,
                                            files: [
                                                'app/controllers/help/faq.js'
                                            ]
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.help.news', {
                        url: '/news',
                        controller: 'newsController',
                        templateUrl: '/view?view=/help/news',
                        ncyBreadcrumb: {
                            label: '系统公告',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(
                                        {
                                            cache: false,
                                            serie: true,
                                            files: [
                                                'app/controllers/help/news.js'
                                            ]
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.help.news.list', {
                        url: '/',
                        controller: 'newsController',
                        templateUrl: '/view?view=/help/newsList',
                        ncyBreadcrumb: {
                            label: '系统公告',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(
                                        {
                                            cache: false,
                                            serie: true,
                                            files: [
                                                'app/controllers/help/news.js'
                                            ]
                                        });
                                }
                            ]
                        }
                    })
                    .state('app.help.news.detail', {
                        url: '/:id',
                        controller: 'newsController',
                        templateUrl: '/view?view=/help/newsDetail',
                        ncyBreadcrumb: {
                            label: '系统公告',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load(
                                        {
                                            cache: false,
                                            serie: true,
                                            files: [
                                                'app/controllers/help/news.js'
                                            ]
                                        });
                                }
                            ]
                        }
                    })
                    .state('error404', {
                        url: '/error404',
                        templateUrl: 'views/error-404.html',
                        ncyBreadcrumb: {
                            label: 'Error 404 - The page not found'
                        }
                    })
                    .state('error500', {
                        url: '/error500',
                        templateUrl: 'views/error-500.html',
                        ncyBreadcrumb: {
                            label: 'Error 500 - something went wrong'
                        }
                    });
            }
        ]
    );