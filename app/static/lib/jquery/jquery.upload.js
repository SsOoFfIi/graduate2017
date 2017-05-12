/**
 * 上传
 * Created by Qinj on 2016/1/11.
 */
$.fn.upload = function (options) {
    options = options || {};
    options.dom = this;
    return $.upload(options);
};

$.upload = function (options) {
    var settings = {
        location: "body", //iframe等元素渲染的位置
        'class': '',
        dom: "",
        action: "",
        fileName: "file",
        params: {},
        accept: ".jpg,.png",
        ieSubmitBtnText: "上传",
        dataType: "text",
        complete: function (text) {
            alert(text);
        },
        submit: function ($form) {
            return true;
        }
    };
    settings = $.extend(settings, options);
    var ele = settings.dom;

    var iframeName = "leunpha_iframe_v" + Math.random() * 100;
    var iframe = $("<iframe name='" + iframeName + "' style='display:none;' id='" + iframeName + "'></iframe>");
    var form = $("<form></form>");
    form.attr({
        target: iframeName,
        action: settings.action,
        method: "post",
        "class": "ajax_form",
        enctype: "multipart/form-data"
    }).css({
        width: 0,
        height: 0,
        position: "absolute",
        top: 0,
        left: 0,
        visibility: 'hidden'
    });
    if (settings['class']) {
        form.addClass(settings['class']);
    }
    var input = $("<input type='file'/>");
    input.attr({
            accept: settings.accept,
            name: settings.fileName
        })
        .css({
            width: 0,
            height: 0
        });
    input.change(function () {
        if (settings.submit.call(this, form)) {
            $(this).parent("form").submit();
        }
    });
    form.append(input);
    $(settings.location).append(iframe);
    iframe.after(form);
    ele.on('click', function(){input.click()});

    for (var param in settings.params) {
        var div = $("<input type='hidden'/>").attr({name: param, value: settings.params[param]});
        input.after(div);
        div = null;
        delete div;
    }

    iframe.load(function () {
        var im = document.getElementById(iframeName);
        var text = $(im.contentWindow.document.body).text();
        settings.complete.call(input[0], JSON.parse(text));
        input.val('');
    });

    return form;
};