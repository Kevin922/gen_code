function Controller(conf) {
    var model = new Category(conf.url);
    var view = new View($(conf.root),"");


    /**
     * 注册事件
     * */
    view.on("view.select", function (obj) {
        if (obj.hasChild) {
            model.load({pid:obj.pid});
        }
        view.clear(obj);
        view.refreshVal(obj);
    });
    view.on("view.selectNull", function (obj) {
        //console.log("selectNull");
        view.clear(obj);
        view.refreshVal(obj);
    });
    model.on("model.load", function (obj, list) {
        view.clear(obj);
        view.show(obj, list);
        var cateIds =$("#categoryIds").val();
        if(cateIds!="" ){
            initCate();
        }
    });
    model.load({pid: "0"});
}

function Category(url) {
    var self = this;
    var url = url;

    //选择一个数据, 如果有子数据, 则把子数据展示出来
    self.load = function (param) {
        var path = riot.render(url, param);
        $.getJSON(path, function (e) {
            if(e.length==0){
                return;
            }
            var list = e;
            self.trigger("model.load", param, list);
        });
    };

    riot.observable(self);
}

/**
 * 视图类
 * @param root
 * @param valName
 * @constructor
 */
function View(root, valName) {
    var self = this;
    self.root = $(root);
    self.tmplSel = "<select class='categoryItem' data-pid='{pid}'>" +
        "<option value=''>请选择分类</option>" +
        "</select>";
    self.tmplOpt = "<option value='{val}' data-has_child='{hasChild}'>{name}</option>";
    self.tmplHidden = "<input type='hidden' class = 'categoryItemVal' value=''  val='' name='selectCateId'>";

    /**
     * 显示新的列表
     * @param list
     */
    self.show = function (obj, list) {
        var sel = $(riot.render(self.tmplSel, obj));
        for (var i in list) {
            var item = list[i];
            var option = riot.render(self.tmplOpt, {"name": item.name, "val": item.id, "hasChild": item.hasChild});
            sel.append(option);
        }
        self.root.append(sel);
    }

    /**
     * 清除选中项后面的数据
     * @param obj
     */
    self.clear = function (obj) {
        $(obj.sel).nextAll().remove();
    }

    /**
     * 刷新组件的值
     * @param obj
     */
    self.refreshVal = function (obj) {
        var val = self.root.find(".categoryItemVal");
        if (val == undefined || val == null || val.size() <= 0) {
            val = $(riot.render(self.tmplHidden, {name: valName}));
            self.root.prepend(val);
        }
        val.val(obj.pid);
        val.attr("val",obj.text);
    };

    /**
     * 监听改变事件
     */
    $(".categoryItem").live("change", function () {
        var sel = $(this);
        var item = sel.find("option:selected");
        if(item.val()=="" && sel.attr("data-pid")!="0"){
            item = sel.prevUntil().find("option[value='"+sel.attr("data-pid")+"']");
            item.prop("selected", 'selected');
            item.change();
            return;
        }
        var obj = {};
        obj.sel = sel;
        obj.hasChild = item.data("has_child");
        obj.val = sel.val();
        obj.text = item.text();
        obj.pid = obj.val;

        if (obj.val == undefined || obj.val == null || obj.val == "") {
            self.trigger("view.selectNull", obj)
            return;
        }

        self.trigger("view.select", obj);
    });

    riot.observable(self);
}

function initCate(){
    var ids = $("#categoryIds").val().split("-");
    var selectLength = $("#productCategory select").length;
    if(selectLength==ids.length){
        $("#categoryIds").val("");
    }
    if(selectLength>ids.length) return;
    $("#productCategory select:last option").each(function (i) {
        if($(this).attr("value")==ids[selectLength-1]) {
            $(this).prop("selected", 'selected');
            $(this).change();
            return false;
        }
    });
}

/**
 * 创建插件
 */
(function ($) {
    var conf = {
        url: "/titan/category/nextSearchSubCategroy?parentId={pid}",
        root: "#productCategory",
        name: ""
    };

    $.fn.productCategory = function (cfg) {
        conf.root = $(this);
        var c = $.extend({}, conf, cfg);
        var cate = new Controller(c);
        return cate;
    }
})(jQuery);
