/**
 * 创建插件
 */
(function ($) {

    /**
     * 动态select级联
     * @param conf
     * @constructor
     */

    /**
     * 实体类
     * @param url
     * @constructor
     */
    function Category(conf) {
        var conf = conf;
        var self = this;
        var url = conf.url;

        //选择一个数据, 如果有子数据, 则把子数据展示出来
        self.load = function (param) {
            self.trigger("model.startLoad", param);
            var path = riot.render(url, param);

            try {
                $.ajax({
                    url: path, dataType: conf.urlType, success: function (data) {
//                    handleLoad(param, data);
                        try {
                            if (param.step == 0) {
                                if (data.length == 0) {
                                    throw "没有找到数据!";
                                }
                            }
                            if (data.length > 0) {
                                self.trigger("model.load", param, data);
                            } else {
                                conf.leafHandle();
                                self.trigger("model.loadNull", param, data);
                            }
                        } catch (e) {
                            self.trigger("model.loadError", param);
                        }
                    }, error: function (data) {
                        self.trigger("model.loadError", param);
                    }
                });
            } catch (e) {
                self.trigger("model.loadError", param);
                console.log("model.loadError")
            }
        };


        self.init = function (obj) {
            if (!(conf.val && conf.val != null && conf.val != "" && conf.index == -1)) {
                return;
            }
            var path = riot.render(conf.peggingUrl, {"pid": conf.val});
            if (path == null || path == "") {
                return;
            }
            $.ajax({
                url: path, dataType: conf.urlType, success: function (data) {
                    if (conf.peggingExtract) {
                        conf.vals = conf.peggingExtract(data);
                    } else {
                        conf.vals = data;
                    }
                    conf.index = 0;
                    self.trigger("model.init", obj);
                }, error: function (data) {
                    self.trigger("model.loadError", obj);
                }
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
    function View(conf) {
        var conf = conf;
        var root = $(conf.root), valName = conf.name;
        var self = this;
        self.root = $(root);


        self.tmpl = "<div class='itemsPanel' style='display: inline-block;'></div><div class='msgPanel' style='display: inline-block;'></div>"

        self.tmplSel = "<select class='item' data-pid='{pid}'>" +
            "<option value=''>请选择</option>" +
            "</select>";
        self.tmplOpt = "<option value='{val}' data-has_child='{hasChild}'>{name}</option>";
        self.tmplHidden = "<input type='hidden' class = 'itemVal' value='' name='{name}'>";

        /**
         * 数据初始化
         */
        self.init = function () {
            var view = $(riot.render(self.tmpl, conf.hint));
            self.root.append(view);
            self.itemPanel = self.root.find(".itemsPanel");
            self.msgPanel = self.root.find(".msgPanel");
        };

        /**
         * 显示新的列表
         * @param list
         */
        self.show = function (obj, list) {
            var sel = $(riot.render(self.tmplSel, obj));
            //添加校验
            if (conf.validate) {
                for (var i in conf.validate) {
                    sel.attr(i, conf.validate[i]);
                }
            }
            for (var i in list) {
                var item = list[i];
                var obj = {};
                if (conf.extract) {
                    obj = conf.extract(item);
                }
                var option = riot.render(self.tmplOpt, obj);
                sel.append(option);
            }
            self.itemPanel.append(sel);
            sel.attr("name", conf.name + self.itemPanel.find("select").size());
            var t = {};
            t.sel = sel;
            self.trigger("view.show", t);
        };

        /**
         * 正在加载数据
         */
        self.loading = function () {
            var loadTmpl = "<div class=''>{loading}</div>";
            var item = $(riot.render(loadTmpl, conf.hint));
            self.msgPanel.html(item);
        };

        self.clearMsg = function () {
            self.msgPanel.html("");
        };

        self.loadError = function (obj) {
            var loadTmpl = "<div class='errorMsg'>系统错误，请<a href='javascript:;' class='reload'>重新获取数据</a>！</div>";
            var item = $(riot.render(loadTmpl, conf.hint));
            self.msgPanel.html(item);
            var btn = self.msgPanel.find(".reload");
            btn.data("loadParam", obj);
            btn.click(function () {
                var re = $(this);
                var obj = re.data("loadParam");
                self.trigger("view.reloadRequest", obj);
            });
        };

        /**
         * 重新加载
         * @param obj
         */
        self.reload = function (obj) {
            if (!(conf.vals && conf.vals.length > 0 && conf.vals.length > conf.index)) {
                return;
            }
            var t = obj.sel.find("[value=" + conf.vals[conf.index] + "]");
            if (t.size() == 1) {
                obj.sel.val(conf.vals[conf.index]);
                conf.index++;
                obj.sel.change();
                return;
            }
            conf.index = -1;
        };

        /**
         * 清除选中项后面的数据
         * @param obj
         */
        self.clear = function (obj) {
            var t = $(obj.sel);
            if (t.size() > 0) {
                while (!(t.parent().is(self.itemPanel))) {
                    t = t.parent();
                }
                t.nextAll().remove();
            }
        }

        /**
         * 清除所有的选择
         */
        self.clearAll = function () {
            var first = self.itemPanel.find(".item").get(0);
            first = $(first);
            first.get(0).selectedIndex = 0;
            first.change();
            self.itemPanel.find(".itemVal").remove();
        }

        /**
         * 刷新组件的值
         * @param obj
         */
        self.refreshVal = function (obj) {
            var val = self.itemPanel.find(".itemVal");
            if (val == undefined || val == null || val.size() <= 0) {
                val = $(riot.render(self.tmplHidden, {name: valName}));
                self.itemPanel.prepend(val);
            }

//        if (obj.hasChild == undefined || obj.hasChild == null || obj.hasChild == true) {
//            val.val("");
//            val.attr("data-cate-txt", "");
//            return;
//        }
            val.val(obj.pid);
            var txt = "";
            var first = true;
            self.itemPanel.find("select").each(function () {
                var item = $(this).find("option:selected");
                if (item.val() == "") {
                    return;
                }
                if (first) {
                    first = false;
                } else {
                    txt += conf.txtArrows
                }
                txt += item.text();
                val.attr("data-cate-txt", txt);
                val.val(item.val());
            });
        };

        /**
         * 监听改变事件
         */

        self.bind = function () {
            self.itemPanel.find(".item").unbind("change");
            self.itemPanel.find(".item").bind("change", function () {
                //    $(self.itemPanel.selector + " .item").live("change", function () {
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

                var objs = self.itemPanel.find(".item");
                var size = objs.size();
                var index = objs.index($(this));
                if (conf.layer > 0 && index == (size - 1)) {
                    if (size >= conf.layer) {
                        self.trigger("view.selectNull", obj);
                        return;
                    }
                }
                self.trigger("view.select", obj);
            });
        };

        riot.observable(self);
        self.init();
    }

    /**
     * 控制器类
     * @param conf
     * @constructor
     */
    function Controller(conf) {
        var conf = conf;
        var self = this;
        var model = new Category(conf);
//    var view = new View($(conf.root), conf.name);
        var view = new View(conf);
        /**
         * 监听事件
         */
        view.on("view.select", function (obj) {
            if (obj.hasChild == undefined || obj.hasChild == null || obj.hasChild == true || obj.hasChild == "") {
                model.load(obj);
            }
            view.refreshVal(obj);
        });
        //选择空
        view.on("view.selectNull", function (obj) {
            view.clear(obj);
            view.refreshVal(obj);
        });
        //显示内容
        view.on("view.show", function (obj) {
            view.bind();
            view.reload(obj);
            model.init(obj);
        });
        //重新加载请求
        view.on("view.reloadRequest", function (obj) {
            model.load(obj);
        });
        //开始加载
        model.on("model.startLoad", function (obj) {
            view.loading(obj);
        });
        //加载成功
        model.on("model.load", function (obj, list) {
            view.clearMsg();
            view.clear(obj);
            view.show(obj, list);
            view.refreshVal(obj);
        });
        //加载失败
        model.on("model.loadError", function (obj) {
            view.loadError(obj);
        });
        //没有子结点
        model.on("model.loadNull", function (obj) {
            view.clearMsg();
            view.clear(obj);
            view.refreshVal(obj);
        });
        //
        model.on("model.init", function (obj) {
            view.reload(obj);
        });

        self.clearAll = function () {
            view.clearAll();
        }
        model.load({pid: "0", step: 0});
    }


    //配置
    var config = {
        url: ""   //下一级查询的URL
        , peggingUrl: ""    //反查父级的URL
        , urlType: "jsonp"   //URL类型, 支持json, jsonp
        , root: "#productCategory", name: ""      //选中值
        , validate: {} //validate校验
        , vals: []       //默认值
        , val: ""        //默认值最后一级
        , index: -1    //默认值的所引, 不可配置
        , txtArrows: "" //文本间的间隔符
        //转换, 将各个不同的类型转换成指定结构的JSON
        , extract: function (item) {
            return {"name": item.regionName, "val": item.regionId, "hasChild": item.hasChild}
        }
        //反查转换, 转换成数组
        , peggingExtract: function (data) {
            return data;
        }
        //选择叶子节点时出发
        , leafHandle: function () {
        }
        //提示
        , hint: {
            loading: "<img src='http://static.dili7.com/static/common/images/i/dili_ld.gif' style='width: 15px;vertical-align: middle;'>"
        }
    };

    var cityConf = {
        url: "http://user.dili7.com/api/city/getCityJsonpList.do?parentId={pid}", peggingUrl: "http://user.dili7.com/api/city/getParentCityJsonpList.do?cityId={pid}"
//        url: window.DiliPath.userPath + "/api/city/getCityJsonpList.do?parentId={pid}"
//        , peggingUrl: window.DiliPath.userPath + "/api/city/getParentCityJsonpList.do?cityId={pid}"
        , urlType: "jsonp" //json或者jsonp
        , layer: -1, extract: function (item) {
            return {"name": item.regionName, "val": item.regionId, "hasChild": item.hasChild}
        }
        //反查转换, 转换成数组
        , peggingExtract: function (data) {
            var vals = new Array();
            for (var i in data) {
                var item = data[i];
                vals.unshift(item.regionId);
            }
            return vals;
        }
    };

    var countryConf = {
        url: "http://background.dilisx.com/city/getCountryJsonpList.do?parentId={pid}"
        , peggingUrl: "http://background.dilisx.com/city/getParentCountryJsonpList.do?cityId={pid}"
//        url: window.DiliPath.userPath + "/api/city/getCityJsonpList.do?parentId={pid}"
//        , peggingUrl: window.DiliPath.userPath + "/api/city/getParentCityJsonpList.do?cityId={pid}"
        , urlType: "jsonp" //json或者jsonp
        , layer: -1, extract: function (item) {
            return {"name": item.regionName, "val": item.regionId, "hasChild": item.hasChild}
        }
        //反查转换, 转换成数组
        , peggingExtract: function (data) {
            var vals = new Array();
            for (var i in data) {
                var item = data[i];
                vals.unshift(item.regionId);
            }
            return vals;
        }
    };

    var cateConf = {
        url: "http://user.dili7.com/common/nextcategory.do?pid={pid}", urlType: "jsonp", txtArrows: "--&gt;", extract: function (item) {
            return {"name": item.cname, "val": item.cid, "hasChild": item.hasChild}
        }
    };

    $.fn.diliCity = function (cfg) {
        cfg.root = $(this);
        var c = $.extend(true, {}, config, cityConf, cfg);
        var cate = new Controller(c);
        return cate;
    };
    $.fn.diliCountry = function (cfg) {
        cfg.root = $(this);
        var c = $.extend(true, {}, config, countryConf, cfg);
        var cate = new Controller(c);
        return cate;
    };
    $.fn.diliCategory = function (cfg) {
        cfg.root = $(this);
        var c = $.extend(true, {}, config, cateConf, cfg);
        var cate = new Controller(c);
        return cate;
    };
})(jQuery)