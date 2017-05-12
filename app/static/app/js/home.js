/**
 * Created by SJia on 2016/8/5.
 */
$(function () {
    if(!(supportCss3('animation') && supportCss3('transition'))) {
        $('.animated').css('opacity', 1);
    }

    $('#erp').select2({
        minimumResultsForSearch: Infinity,
        placeholder: '请选择您正在使用的ERP'
    });

    $('#channel').select2({
        minimumResultsForSearch: Infinity,
        placeholder: '请选择如何得知心康云'
    });

    var height = document.documentElement.clientHeight;

    $('.applicant .applicant-wrapper').css('max-height', '70vh');
    $('.login, .bind, .applicant, .applicant-success').css('top', '-150vh').css('height', '100vh');
    if (location.href.indexOf('to=login') >= 0) {
        $('.login').show().css('top', 0);
        $('html, body').css('overflowY', 'hidden');
    }
    $('.menu').click(function () {
        $('.captcha').click();
        $('.login').show().animate({top: 0});
        $('html, body').css('overflowY', 'hidden');
    });
    $('.join-btn, .join-btn2').click(function () {
        $('.applicantCaptcha').click();
        $('.applicant').show().animate({top: 0});
        $('html, body').css('overflowY', 'hidden');
    });
    $('.close-btn, .applicant-success-btn').click(function () {
        $(this).parents('.wrapper').animate({top: '-150vh'}, 200, function() {
            $(this).parents('.wrapper').hide();
        });
        $('html, body').css('overflowY', 'auto');
    });

    $('.form-control').focus(function () {
        $(this).removeClass('has-error');
    });

    $('#loginForm').html5Validate(function () {
        $.post('signin', {
            loginName: $('#loginName').val(),
            password: $('#password').val(),
            captcha: $('#captcha').val()
        }, function (result) {
            console.log(result);
            if (result.code != 200) {
                if (result.code == 1) {
                    $('#loginName, #password').addClass('has-error');
                } else if (result.code == 2) {
                    $('#captcha').addClass('has-error');
                }
                $('.err-msg').html(result.msg).fadeIn(200);
                setTimeout(function () {
                    $('.err-msg').html(result.msg).fadeOut(200);
                }, 5000);
            } else {
                if (result.data.isAuthorizationed == 1) {
                    Cookies.set('mpAppid', result.data.appId);
                    location.replace('/cms');
                } else {
                    $('#loginName, #password, #captcha').val('');
                    $('.bind').show().animate({top: 0}, 200, function () {
                        $('.login').hide().css('top', '-150vh');
                    });
                }
            }
        }, 'json');
        return false;
    });

    var change = function(index) {
        var $parent = $('.customer-list');
        var $this = $parent.find('.indicator .item' + index);
        $parent.find('.item').removeClass('current').removeClass('left').removeClass('right').end()
            .find('.item' + $this.data('item')).addClass('current');
        var $current = $('.customer-item').find('.current');
        $this.next('li').length ? $current.next('li').addClass('right') : $('.customer-item').find('li:first').addClass('right');
        $this.prev('li').length ? $current.prev('li').addClass('left') : $('.customer-item').find('li:last').addClass('left');
    };
    $('.customer-list').on('click', '.left, .right', function() {
        change($(this).data('item'));
    });

    var $navbar = $('.navbar');
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    $navbar.css('background-color', 'rgba(255,255,255,' +(scrollTop/300)+ ')');
    $navbar.css('border-color', 'rgba(235,235,235,' +(scrollTop/300)+ ')');

    $(window).scroll(function() {
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if(scrollTop < 1000) {
            $navbar.css('background-color', 'rgba(255,255,255,' +(scrollTop/300)+ ')');
            $navbar.css('border-color', 'rgba(235,235,235,' +(scrollTop/300)+ ')');
        }

        $('section:not(.visited)').each(function() {
            var $this = $(this);
            if($this.offset().top - scrollTop < 300 ) {
                $this.addClass('visited');
                if($this.hasClass('customers')) {
                    $this.find('.item1').addClass('left');
                    $this.find('.item2').addClass('current');
                    $this.find('.item3').addClass('right');
                } else {
                    $this.find('.animated').each(function() {
                        $(this).addClass($(this).attr('animation'));
                    });
                }
            }
        });
    });

    var $applicantBtn = $('.applicant-btn');
    $('.applicantForm').validator({
        rules: {
            digits: [/^[1-9]\d*$/, '请输入数字']
        },
        stopOnError: false,
        timely: true,
        msgMaker: false,
        fields: {
            name: 'required;',
            address: 'required;',
            size: 'required;digits;',
            directProportion: 'required;digits;',
            erp: 'required;',
            applicantName: 'required;',
            applicantPosition: 'required;',
            phone: 'required;',
            email: 'required;email;',
            captcha: 'required;'
        },
        valid: function(form) {
            $applicantBtn.prop('disabled', true);
            $.ajax({
                url: "/submitAlphaStoreApplicant",
                data: $(form).serialize(),
                type: "POST",
                dataType: "json",
                success: function(result){
                    $applicantBtn.prop('disabled', false);
                    console.log(result);
                    if(result.code == 200) {
                        $('.applicant-success').show().animate({top: 0}, 200, function () {
                            $('.applicant').hide().css('top', '-150vh');
                            form.reset();
                        });
                    } else {
                        alert(result.msg);
                    }
                }, error: function() {
                    $applicantBtn.prop('disabled', false);
                }
            });
        }
    });
});

/**
 * 判断浏览器是否支持某一个CSS3属性
 * @param  {String} 属性名称
 * @return {Boolean} true/false
 * @version 1.0
 */

function supportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
        i,
        humpString = [],
        htmlStyle = document.documentElement.style,
        _toHumb = function (string) {
            return string.replace(/-(\w)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        };

    for (i in prefix)
        humpString.push(_toHumb(prefix[i] + '-' + style));

    humpString.push(_toHumb(style));

    for (i in humpString)
        if (humpString[i] in htmlStyle) return true;

    return false;
}