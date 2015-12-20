

/**
 * 实体类
 * @param url
 * @constructor
 */
/**
 * 创建插件
 */
(function ($) {
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
function View(root, valName,isSubCate) {
    var self = this;
    self.root = $(root);
    self.tmplSel = "<select class='categoryItem' data-pid='{pid}'>" +
        "<option value=''>请选择分类</option>" +
        "</select>";
    self.tmplOpt = "<option value='{val}' data-has_child='{hasChild}'>{name}</option>";
    if(isSubCate){
        self.tmplHidden = "<input type='hidden' class = 'subCategoryItemVal' value=''  val='' name='subCategory'>";
    }else{

        self.tmplHidden = "<input type='hidden' class = 'categoryItemVal' value=''  val='' name='category'>";
    }

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
    self.refreshVal = function (obj,isSubCate) {
        var val ="";
        if(isSubCate){
            val = self.root.find(".subCategoryItemVal");
        }else{
            val = self.root.find(".categoryItemVal");
        }
        if (val == undefined || val == null || val.size() <= 0) {
            val = $(riot.render(self.tmplHidden, {name: valName}));
            self.root.prepend(val);
        }
        if (obj.hasChild) {
            val.val("");
            return;
        }
        val.val(obj.pid);
        val.attr("val",obj.text);
        //新增供应商，定制cateID,子分类选择不需要
        if(!isSubCate){
            $("#imgCateId").val(obj.pid);
        }

    };

    /**
     * 监听改变事件
     */
    self.root.find(".categoryItem").live("change", function () {
        var sel = $(this);
        var item = sel.find("option:selected");
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


/**
 * 控制器类
 * @param conf
 * @constructor
 */
function Controller(conf) {
    var model = new Category(conf.url);
    var isSubCate = conf.isSubCate;
    var view = new View($(conf.root),"",isSubCate);
    /**
     * 注册事件
     * */
    view.on("view.select", function (obj) {
        //重新选择清空分类,图片上传的
        if(!isSubCate){
            $("#imgCateId").val("");
        }

        if (obj.hasChild) {
            model.load({pid:obj.pid});
        }else{
            if(isSubCate){
                //新入库，子分类不需要联动属性
            }else{
                //加载属性项
                $.AttrAndTemp.attrAndTemp({cid: obj.pid});
                //加载图片库
                $.ImgStore.loadStore(obj.pid);
            }
        }
        view.clear(obj);
        view.refreshVal(obj,isSubCate);
    });
    view.on("view.selectNull", function (obj) {
        //重新选择清空分类,图片上传的
        if (!isSubCate) {
            $("#imgCateId").val("");
        }
    	//console.log("selectNull");
        view.clear(obj);
        view.refreshVal(obj,isSubCate);

        //定制cateID,需要清除属性
        if(isSubCate){
            //子分类不需要联动属性
        }else{
            $.AttrAndTemp.clearAttr();
        }
    });
    model.on("model.load", function (obj, list) {
        view.clear(obj);
        view.show(obj, list);
    });


    model.load({pid: "0"});

}


    var conf = {
        url: "/titan/category/nextCategroy?parentId={pid}", root: "#productCategory", name: "",isSubCate:false
    };

    $.fn.productCategory = function (cfg) {
        conf.root = $(this);
        var c = $.extend({}, conf, cfg);
        var cate = new Controller(c);
        return cate;
    }
})(jQuery);
