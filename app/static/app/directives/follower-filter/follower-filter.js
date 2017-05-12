/**
 * Created by SJia on 2016/7/12.
 */
//Sidebar Menu Handle
angular.module('app')
    .directive('followerFilter', ['$ajax', function($ajax) {
        return {
            restrict: 'AE',
            templateUrl: 'app/directives/follower-filter/template.html',
            replace: true,
            scope: {
                onFilter: '&',
                memberCount: '='
            },
            link: function (scope, el, attr) {
                scope.storeList = [];
                scope.followerTypeList = {
                    '': '全部',
                    '1': '会员',
                    '0': '非会员'
                };
                scope.memberTypeList = {
                    '': '全部会员',
                    'importantValue':'重要价值会员',
                    'importantMaintenance':'重要保持会员',
                    'importantDevelopment':'重要发展会员',
                    'importantRetention':'重要保留会员'
                };
                scope.sexList = [
                    {key: '男', value: '男'},
                    {key: '女', value: '女'}
                ];
                scope.zodiacSignList = [
                    {name: '水瓶座', startDate: '01.20', endDate: '02.18'},
                    {name: '双鱼座', startDate: '02.19', endDate: '03.20'},
                    {name: '白羊座', startDate: '03.21', endDate: '04.19'},
                    {name: '金牛座', startDate: '04.20', endDate: '05.20'},
                    {name: '双子座', startDate: '05.21', endDate: '06.21'},
                    {name: '巨蟹座', startDate: '06.22', endDate: '07.22'},
                    {name: '狮子座', startDate: '07.23', endDate: '08.22'},
                    {name: '处女座', startDate: '08.23', endDate: '09.22'},
                    {name: '天秤座', startDate: '09.23', endDate: '10.23'},
                    {name: '天蝎座', startDate: '10.24', endDate: '11.22'},
                    {name: '射手座', startDate: '11.23', endDate: '12.21'},
                    {name: '摩羯座', startDate: '12.22', endDate: '01.19'}
                ];
                scope.ageList = [
                    {text:'小于20岁', min: '0', max: '19'},
                    {text:'20-25岁', min: '20', max: '25'},
                    {text:'26-35岁', min: '26', max: '35'},
                    {text:'36-45岁', min: '36', max: '45'},
                    {text:'45岁以上', min: '46', max: '120'}
                ];
                scope.rList = [
                    {text:'7天内', min: '0', max: '7'},
                    {text:'8天-1个月', min: '8', max: '30'},
                    {text:'1-3个月', min: '31', max: '90'},
                    {text:'3-9个月', min: '91', max: '270'},
                    {text:'9个月以上', min: '271', max: '0'}
                ];
                scope.fList = [
                    {text:'1-5次', min: '1', max: '5'},
                    {text:'6-10次', min: '6', max: '10'},
                    {text:'11-15次', min: '11', max: '15'},
                    {text:'16-20次', min: '16', max: '20'},
                    {text:'20次以上', min: '21', max: '0'}
                ];
                scope.mList = [
                    {text:'20元内', min: '0', max: '20'},
                    {text:'21-50元', min: '21', max: '50'},
                    {text:'51-100元', min: '51', max: '100'},
                    {text:'101-300元', min: '101', max: '300'},
                    {text:'300元以上', min: '301', max: '0'}
                ];
                scope.diseaseList = [
                    '高血压',
                    '高血脂',
                    '冠心病',
                    '糖尿病'
                ];

                scope.filterData = {
                    nickName: '',
                    storeName: '',
                    store: [],
                    sex: [],
                    memberFlag: '',
                    area: [],
                    age: [],
                    storeArea: {},
                    tmpSelectArea: {},
                    zodiacSign: [],
                    r: [],
                    f: [],
                    m: [],
                    disease: [],
                    memberType: ''
                };

                //省份数据
                scope.provinceData = areaData.filter(function (region) {
                    return region.level == 0;
                });
                scope.filterAreaData = function (parentId) {
                    return areaData.filter(function (region) {
                        return region.parentId === parentId;
                    });
                };

                $ajax.get('/cms/store/page', {
                    pageSize: 10000,
                    pageNum: 1
                }, function (data) {
                    scope.storeList = data.list;
                });

                scope.removeFilterData = function(list, index) {
                    list.splice(index, 1);
                    scope.load();
                };

                scope.select = function(type) {
                    if(scope.selectCategory == type) {
                        scope.selectCategory = undefined;
                        return;
                    }
                    switch (type) {
                        case 'store':
                            scope.filterData.storeArea = {};
                            break;
                        case 'area':
                            scope.filterData.tmpSelectArea = {};
                            break;
                    }
                    scope.selectCategory = type;
                };

                scope.toggleSelectedSex = function(sex) {
                    if(scope.filterData.sex.indexOf(sex) >= 0) {
                        scope.filterData.sex.splice(scope.filterData.sex.indexOf(sex), 1);
                    } else {
                        scope.filterData.sex.push(sex);
                    }
                    scope.load();
                };

                scope.toggleMemberFlag = function(memberFlag) {
                    if(memberFlag !== scope.filterData.memberFlag) {
                        scope.filterData.memberFlag = memberFlag;
                        scope.toggleMemberType('');
                    }
                };

                scope.toggleMemberType = function(memberType) {
                    if(!memberType || memberType !== scope.filterData.memberType) {
                        scope.selectCategory = '';
                        scope.filterData.r = [];
                        scope.filterData.f = [];
                        scope.filterData.m = [];
                        scope.filterData.disease = [];
                        scope.filterData.memberType = memberType;
                        scope.load();
                    }
                };

                scope.toggleSelectedStore = function(store) {
                    var ids = scope.getStoreIds(scope.filterData.store);
                    if(ids.indexOf(store.id) >= 0) {
                        scope.filterData.store.splice(ids.indexOf(store.id), 1);
                    } else {
                        scope.filterData.store.push(store);
                    }
                    scope.load();
                };

                scope.toggleSelectedZodiacSign = function(zodiacSign) {
                    var index = scope.filterData.zodiacSign.indexOf(zodiacSign);
                    if(index >= 0) {
                        scope.filterData.zodiacSign.splice(index, 1);
                    } else {
                        scope.filterData.zodiacSign.push(zodiacSign);
                    }
                    scope.load();
                };

                scope.customAge = {minAge:'', maxAge: ''};
                scope.addAge = function(age) {
                    console.log(age);
                    if(!age) {
                        if(!/^\d+$/.test(scope.customAge.minAge) || !/^\d+$/.test(scope.customAge.maxAge)) {
                            Notify.warn('年龄不能为空且必须为正整数！');
                            return;
                        }
                        if(+scope.customAge.minAge > +scope.customAge.maxAge) {
                            Notify.warn('最小年龄必须小于等于最大年龄！');
                            return;
                        }
                        age = {
                            min: scope.customAge.minAge,
                            max: scope.customAge.maxAge
                        };
                        scope.customAge.minAge = '';
                        scope.customAge.maxAge = '';
                    }
                    var index = scope.filterData.age.indexOf(age);
                    if(index >= 0) {
                        scope.filterData.age.splice(index, 1);
                    } else {
                        scope.filterData.age.push(age);
                    }
                    scope.load();
                };

                scope.customR = {min:'', max: '', time: '30', timeMap: {'1': '天','7': '周','30': '月'}};
                scope.addR = function(r) {
                    console.log(r);
                    if(!r) {
                        if(!/^\d+$/.test(scope.customR.min) || !/^\d+$/.test(scope.customR.max)) {
                            Notify.warn('时间不能为空且必须为正整数！');
                            return;
                        }
                        if(+scope.customR.min > +scope.customR.max) {
                            Notify.warn('开始时间必须小于等于结束时间！');
                            return;
                        }
                        r = {
                            min: scope.customR.min,
                            max: scope.customR.max,
                            time: scope.customR.time
                        };
                        scope.customR.min = '';
                        scope.customR.max = '';
                        scope.customR.time = '30';

                        var index = scope.filterData.r.map(function(i){return angular.toJson(i);}).indexOf(angular.toJson(r));
                        if(index < 0) {
                            scope.filterData.r.push(r);
                        } else {
                            return;
                        }
                    } else {
                        var index = scope.filterData.r.indexOf(r);
                        if(index >= 0) {
                            scope.filterData.r.splice(index, 1);
                        } else {
                            scope.filterData.r.push(r);
                        }
                    }
                    scope.load();
                };

                scope.customF = {min:'', max: '', time: '365', timeMap: {'30': '最近1个月内', '90': '最近3个月内', '180': '最近半年内', '365': '最近1年内'}};
                scope.addF = function(f) {
                    // if(!f) {
                    //     if(!/^\d+$/.test(scope.customF.min) || !/^\d+$/.test(scope.customF.max)) {
                    //         Notify.warn('必须为正整数！');
                    //         return;
                    //     }
                    //     if(scope.customF.min > scope.customF.max) {
                    //         Notify.warn('最小值必须小于等于最大值！');
                    //         return;
                    //     }
                    //     f = {
                    //         min: scope.customF.min,
                    //         max: scope.customF.max
                    //     };
                    //     scope.customF.min = '';
                    //     scope.customF.max = '';
                    // }
                    var tmpF = angular.copy(f);
                    tmpF.time = scope.customF.time;
                    var index = scope.filterData.f.map(function(i){return angular.toJson(i);}).indexOf(angular.toJson(tmpF));
                    if(index < 0) {
                        scope.filterData.f.push(tmpF);
                        scope.load();
                    }
                };

                scope.customM = {minM:'', maxM: ''};
                scope.addM = function(m) {
                    console.log(m);
                    if(!m) {
                        if(!/^((\d+)|([0-9]\.\d{1,2}))$/.test(scope.customM.minM) || !/^((\d+)|([0-9]\.\d{1,2}))$/.test(scope.customM.maxM)) {
                            Notify.warn('金额不能为空且必须为正整数！');
                            return;
                        }
                        if(+scope.customM.minM > +scope.customM.maxM) {
                            Notify.warn('最小金额必须小于等于最大金额！');
                            return;
                        }
                        m = {
                            min: scope.customM.minM,
                            max: scope.customM.maxM
                        };
                        scope.customM.minM = '';
                        scope.customM.maxM = '';
                    }
                    var index = scope.filterData.m.indexOf(m);
                    if(index >= 0) {
                        scope.filterData.m.splice(index, 1);
                    } else {
                        scope.filterData.m.push(m);
                    }
                    scope.load();
                };

                scope.toggleDisease = function(disease) {
                    var index = scope.filterData.disease.indexOf(disease);
                    if(index >= 0) {
                        scope.filterData.disease.splice(index, 1);
                    } else {
                        scope.filterData.disease.push(disease);
                    }
                    scope.load();
                };

                scope.confirmSelectStore = function() {
                    scope.filterData.store = angular.copy(scope.filterData.store);
                    scope.selectCategory = undefined;
                    scope.filterData.storeArea = {};
                    scope.load();
                };

                scope.getStoreIds = function(arr) {
                    return arr.map(function(s) {
                        return s.id;
                    });
                };

                scope.addSelectedArea = function() {
                    if(!scope.filterData.tmpSelectArea.province || !scope.filterData.tmpSelectArea.province.id) {
                        Notify.warn('请选择要添加的省市!');
                        return false;
                    }
                    var provinceName = scope.filterData.tmpSelectArea.province.name;
                    var cityName = (scope.filterData.tmpSelectArea.city || {name: ''}).name;
                    var tmpArea;
                    if(provinceName == cityName) {
                        tmpArea = {
                            province: provinceName,
                            city: ''
                        };
                    } else {
                        tmpArea = {
                            province: provinceName,
                            city: cityName
                        };
                    }
                    if(!scope.filterData.area.filter(function(a) {
                            return a.province == tmpArea.province && a.city == tmpArea.city;
                        }).length) {
                        scope.filterData.area.push(tmpArea);
                        scope.load();
                    }
                };

                scope.removeArea = function(index) {
                    scope.filterData.area.splice(index, 1);
                    scope.load();
                };

                scope.FilterStore = function(store) {
                    return (!(scope.filterData.storeArea.province || {name: ''}).id || store.provinceName.indexOf((scope.filterData.storeArea.province || {name: ''}).name) >= 0 &&
                        store.cityName.indexOf((scope.filterData.storeArea.city || {name: ''}).name) >= 0 &&
                        store.areaName.indexOf((scope.filterData.storeArea.area || {name: ''}).name) >= 0) &&
                        store.name.indexOf(scope.filterData.storeName) >= 0;
                };

                scope.load = function() {
                    var provinceArr = [];
                    var cityArr = [];
                    for(var i = 0; i < scope.filterData.area.length; i++) {
                        if(scope.filterData.area[i].city) {
                            cityArr.push(scope.filterData.area[i].city);
                        } else {
                            provinceArr.push(scope.filterData.area[i].province);
                        }
                    }
                    var filterParams = {
                        sex: scope.filterData.sex.join(','),
                        nickName: scope.filterData.nickName,
                        storeIds: scope.filterData.store.map(function(s){return s.id}).join(','),
                        province: provinceArr.join(','),
                        city: cityArr.join(','),
                        ages: scope.filterData.age.map(function(a){return a.min+'-'+a.max}).join(','),
                        constellations: scope.filterData.zodiacSign.map(function(z){return z.name}).join(','),
                        memberFlag: scope.filterData.memberFlag,
                        personas: scope.filterData.memberType,
                        r: scope.filterData.r.map(function(r){return r.text ? (r.min+'-'+r.max) : (r.min*r.time + '-' + r.max*r.time)}).join(','),
                        f: scope.filterData.f.map(function(f){return f.time+'|'+f.min+'-'+f.max}).join(','),
                        m: scope.filterData.m.map(function(m){return m.min+'-'+m.max}).join(','),
                        disease: scope.filterData.disease.join(','),
                    };
                    console.log(filterParams);
                    scope.onFilter({filterParams: filterParams});
                };

                scope.load();
            }
        };
    }]);

