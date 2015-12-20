/**
 * Created by chenzw on 2014/6/12.
 */
/** 单选 */
var INPUT_TYPE_RADIO = 1;
/** 复选框 */
var INPUT_TYPE_CHECK_BOX = 2;
/** 多行输入 */
var INPUT_TYPE_TEXT_AREA = 3;
var descAttr = $("#descAttr");
var saleAttr = $("#saleAttr");
jQuery.AttrAndTemp = {
    attrAndTemp:function(param) {
        this.clearAttr();
        var url="/categoryAttr/searchAttrbute.do?cateId={cid}";
        url = riot.render(url, param);
        $.getJSON(url,/*{timeout: 1000},*/ function (e) {
            var descList=[];
            if(e==null || e.length==0){
                var ul = $("<ul class='.sales-view'></ul>");
                ul.append("<li class='clear u-heightauto' id='other'><span class='spw'><span></span></span><input type='button' value='添加其它属性项' class='u-but-sc' onclick='addOtherAttr();'></li>");
                descAttr.append(ul);
                return false;
            }else{
                descList = e.descAttrList;
            }
            descAttrShow(descList);

        });
        var url="/titan/categoryTemplete/searchTemplete.do?cateId={cid}";
        url = riot.render(url, param);
        $.getJSON(url,/*{timeout: 1000},*/ function (e) {
            if(e==null || e.length==0){
                $("#productTemp").append("<span class='categoryTemp'>该分类下没有设置默认模版，您可以自定义模版</span>");
                return false;
            }else{
                for(var i in e){
                    var t = e[i];
                    $("#productTemp").append("<span class='categoryTemp' >"+e[i].name+"；</span>");
                }
            }


        });

    },
    clearAttr : function(){
        descAttr.empty();
        saleAttr.empty();
        $("#productTemp").find(".categoryTemp").remove();
    }

};


$(function(){
    $(".desc_attr").live("blur",function(){
        if(this.value==0){
            return;
        }
        if(/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》{}【】\+=\]\[ ,，；;:：‘’“”.。]+$/.test(this.value)){
            return
        }else{
            alert("请输入合法的商品描述（中英文、数字、常用符号）");
            jQuery(this).val("");
        }
    });

    $(".desc_textarea").live("blur",function(){
        if(this.value==0){
            return;
        }
        if(this.value.length>200){
            alert("申请描述输入超过限制了，超过的不能输入.");
            this.value = this.value.substring(0,200);
            jQuery(this).val(this.value);
        }

        if(/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》{}【】\+=\]\[\n\t  ,，；;:：‘’“”.。]+$/.test(this.value)){
            return
        }else{
            alert("请输入合法的商品描述（中英文、数字、常用符号）");
            jQuery(this).val("");
        }
    });
});

function descAttrShow(descList){

    descAttr.tmplUl ="<ul></ul>";
    descAttr.tmplLi ="<li class='cleard u-heightauto'></li>";
    descAttr.tmplSpan="<span class=\"spw\" val={attrId} alt={required} style='line-height: 43px;'><span>{star}</span >{attrName}：</span>";
    descAttr.tmplRadio = "<span class=\"m-r20\"><input type=\"radio\" name=\"{attrId}\" value=\"{radioVal}\">{radioName}</span>";
    descAttr.tmplCheckbox ="<span class='m-r20'><input type='checkbox' name='{checkboxVal}' value='{checkboxVal}'>{checkboxName}</span>";
    descAttr.tmplHidden = "<input type='hidden' class = 'categoryItemVal' value='' name='{name}'>";
    descAttr.tmplTextarea="<textarea class='u-textarea desc_textarea' rows='4' cols='60' alt='{textareaId}'></textarea>";
    var ul = $(descAttr.tmplUl);
    if(descList.length>0){
        for(var i in descList){
            var li = $(descAttr.tmplLi);

            var descInfo = descList[i];
            var typeValueList = descInfo.attrValue;
            var attrName = descInfo.name;
            var inputType = descInfo.inputtype;
            var required = descInfo.required;
            var requiredStar="";
            if(required==1){
                requiredStar="*";
            }
            var spanName = riot.render(descAttr.tmplSpan, {"required":required,"star":requiredStar,"attrName": descInfo.name,"attrId":descInfo.id});
            li.append(spanName);

            if(inputType==INPUT_TYPE_RADIO){
                for(var j in typeValueList){
                    var info = typeValueList[j];
                    var radio = riot.render(descAttr.tmplRadio, {"radioName": info.value, "radioVal": info.id,"attrId":descInfo.id});
                    li.append(radio);
                }
            }else if(inputType==INPUT_TYPE_CHECK_BOX){
                for(var j in typeValueList){
                    var info = typeValueList[j];
                    var check = riot.render(descAttr.tmplCheckbox, {"checkboxName": info.value, "checkboxVal": info.id});
                    li.append(check);
                }

            }else if(inputType == INPUT_TYPE_TEXT_AREA){
                var textareaId = riot.render(descAttr.tmplTextarea, {"textareaId": descInfo.id});
                li.append(textareaId);
            }
            ul.append(li);
        }
    }
    ul.append("<li class='clear u-heightauto' id='other'><span class='spw'><span></span></span><input type='button' value='添加其它属性项' class='u-but-sc' onclick='addOtherAttr();'></li>");
    descAttr.append(ul);


}


    /**
     *  商品销售属性设置
     */
    var SalesData = function(_obj){
        var _adata = [];//选中，未选中判断
        var _aobj = {};//添加的属性集合，方法体
        var _self = this;
        var _sRootView = null;
        var _titles = [];
        /*
         * 初始化数值
         */
        this.start = function(){
            _sRootView = $(_obj.rootView+' li');
            _sRootView.each(function(){
                if(! $(this).hasClass('clear')){
                    var key = $(this).find('span').find('input').attr('class');//初始，kkid
                    var aAdd = new AddSclass(key);
                    _aobj[key] = aAdd
                    _adata.push(aAdd.eDtata);
                    //_titles.push($(this).find('.spw').html().split('：')[0]);
                    _titles.push($(this).find('.spw').text().split('*')[1].split('：')[0]);
                };
            });
            var _h_v = '<tr>';
            for (var i=0; i < _titles.length; i++) {//这里初始也
                _h_v += '<th>'+_titles[i]+'</th>';
            };
            var select = $("."+_obj.radioNmae).find("option:selected");
            var h=select.text();
            _h_v += '<th id="priceUnit">供应价(元/'+h+')</th><th id="ableUnit">可供量('+h+')</th><th id="beginUnit">起供量('+h+')</th></tr>';
            $(_obj.showView+' thead').html(_h_v);
        };

        /**
         * 更新数据
         */
        this.updata = function(){
            _adata = [];//所有已判断，是否选中的数据
            var _sArray = [];//所有已选中的值
            for(i in _aobj){//初始，没有数据
                _adata.push(_aobj[i].eDtata);
            };
            for (var i=0; i < _adata.length; i++) {//属性数
                var list = [];//每一组，选中的 txt 和 val
                for (var k=0; k < _adata[i].length; k++) {//每一个属性的长度
                    if(_adata[i][k].bl){//第i属性的k值，是否选择
                        list.push({txt:_adata[i][k].name, val:_adata[i][k].val});
                        //list.push(_adata[i][k].name);
                    };
                };
                _sArray.push(list);
            };

            var array = _sArray;//所有已选中的值
            var len = array.length;//所有选中的属性数
            var results = [];//选中值重新排序（组合）？
            var indexs = {};
            function specialSort(start) {
                start++;
                if (start > len - 1) {//未有选中组合的？
                    return;
                }
                if (!indexs[start]) {
                    indexs[start] = 0;
                }
                if (!(array[start] instanceof Array)) {
                    array[start] = [array[start]];
                }
                for (indexs[start] = 0; indexs[start] < array[start].length; indexs[start]++) {
                    specialSort(start);
                    if (start == len - 1) {
                        var temp = [];
                        for (var i = len - 1; i >= 0; i--) {
                            if (!(array[start - i] instanceof Array)) {
                                array[start - i] = [array[start - i]];
                            }
                            temp.push({txt:array[start - i][indexs[start - i]].txt, val: array[start - i][indexs[start - i]].val});
                        }
                        results.push(temp);
                    }
                }
            };

            specialSort(-1);
            //保存重构前的内容
            function HistoryValue(){
                var trId;
                var price;
                var store;
                var min;
            }
            var hvs =[];
            $(_obj.showView+' tbody tr').each(function(){
                var hv = new HistoryValue();
                hv.trId= $(this).attr("id");
                hv.price=$(this).find(".price").val();
                hv.store=$(this).find(".stockNum").val();
                hv.min=$(this).find(".minNum").val();
                hvs.push(hv);
            });

            $(_obj.showView+' tbody').html('');
            //单选没选，或者没有选中值
            if($("."+_obj.radioNmae).val() == "" || results.length <= 0){
                return false;
            };
            var h = $("."+_obj.radioNmae).val();
            for (var i=0; i < results.length; i++) {
                var trId="";
                var trView = "<tr id='";
                var trOver ="'>"
                var tdView="";
                for (var k=0; k < _titles.length; k++) {
                    tdView += '<td class="attId" val="'+results[i][k].val+'">'+results[i][k].txt+'</td>';
                    trId+=results[i][k].val;
                };

                var history="";
                if(hvs.length>0){
                    for( var j=0;j< hvs.length;j++){
                       if(hvs[j].trId==trId){
                           history=hvs[j];
                           break;
                       }
                    }
                }
                var Aview = trView+trId+trOver+tdView;
                if(history==""){
                     Aview += '<td><input type="text" class="price dili-price" maxlength="12" style="width:90px;"/></td></td><td><input type="text" class="stockNum" maxlength="9" style="width:90px;"/></td>'
                        +'<td><input type="text" class="minNum" maxlength="9" style="width:90px;"/></td></tr>';

                }else{
                    var tm= '<td><input type="text" class="price dili-price" maxlength="12" style="width:90px;" value='+history.price+' ></td></td><td><input type="text" class="stockNum" maxlength="9" style="width:90px;" value='+history.store+'></td>'
                        +'<td><input type="text" class="minNum" maxlength="9" style="width:90px;" value= '+history.min+' ></td></tr>';
                    Aview+=tm;
                }
                $(_obj.showView +' tbody').append(Aview);
            };
        };


        /*$("."+_obj.radioNmae).change(function(){
            _self.updata();
        });*/

        /**
         * 绑定对象
         */
        function AddSclass(_view){//属性名，属性值，是否选中
            this.eDtata = [];
            this.key = _view;
            var _sAself = this;

            $('.'+_view).change(function(){
                _sAself.eDtata = [];
                $('.'+_view).each(function(){
                    var key = $(this).attr('alt');//属性名
                    if($(this).attr('checked') == "checked"){
                        _sAself.eDtata.push({ bl : true, name:key, val:$(this).attr('value')+"-"+_view});
                    }else{
                        _sAself.eDtata.push({ bl : false, name:key, val:''});
                    };
                });
                _self.updata();
            });

            return this;
        };


        _self.start();

        return this;
    };

var resultJson="";
function addOtherAttr() {
    var param ="";
    var url="/titan/attribute/getAttr?cateId="+$(".categoryItemVal").val();

    var valueList=[];

    var tmplDiv ="<div><link href='/assets/css/style-attr-search.css' rel='stylesheet' type='text/css'/><div class='search-view' ><div class='form-area test'><input type='text' value='' class='s-input attr-input' placeholder='输入属性名，进行搜索.....' /><div class='selector s1 attr-s'></div></div></div></div>";

    var div = $(tmplDiv);


    $.getJSON(url, function (e) {
        //var json = e;//eval("("+e+")");
        if(e==null || e.length==0){
            alert("没有其他描述属性添加");
            return false;
        }

        var ok=[];
        var jsonList=[];
        $(".otherok").each(function(){
            ok.push($(this).attr("attr"));
        });
        if(ok.length==0){
            jsonList=e;
        }else{
            for(var j in e){
                var info = e[j];
                var exist = false;//默认不存在
                for(var i=0;i<ok.length;i++){
                    if(ok[i]==info.id){
                        exist=true;
                    }
                }
                if(!exist){
                    jsonList.push(info);
                }
            }
        }

        resultJson=jsonList;

        var html =div.html();
        var descInfo={};
        /*$("#attrID").change(function(){
            var jsonSingle = $(this).val();
            descInfo = JSON.parse(jsonSingle);

        });*/

        var closed = function(){

            descAttr.tmplUl ="<ul class='.sales-view'></ul>";
            descAttr.tmplLi ="<li class='cleard u-heightauto'></li>";

            descAttr.tmplSpan="<span class=\"spw\" val={attrId} alt={required} ><span>{star}</span >{attrName}：</span>";
            descAttr.tmplRadio = "<span class=\"m-r20\"><input type=\"radio\" name=\"{attrId}\" value=\"{radioVal}\">{radioName}</span>";
            descAttr.tmplCheckbox ="<span class='m-r20'><input type='checkbox' name='{checkboxVal}' value='{checkboxVal}'>{checkboxName}</span>";
            descAttr.tmplHidden = "<input type='hidden' class = 'categoryItemVal' value='' name='{name}'>";
            descAttr.tmplTextarea="<textarea class='u-textarea' rows='4' cols='60' alt='{textareaId}'></textarea>";
            descAttr.tmplDel ="<a class='red' onclick='javascript:delOtherDesc(this);' style='margin-left: 10px;'><i class='icon-trash'></i>删除</a>";

            descAttr.tmplOtherLi ="<li attr='{attrId}' class='otherok'></li>";

            var resultValue = $(".attr-input").val();
            if(resultValue==""){
                alert("请查询选择所需要添加的属性");
                return false;
            }
            if($(".attr-s:visible").length>0){
                alert("请选择所需要添加的属性");
                return false;
            }
            var jsonSingle =  $(".attr-input").attr("attrinfo");
            descInfo = JSON.parse(jsonSingle);

            var typeValueList = descInfo.attrValue;
            var attrName = descInfo.name;
            var inputType = descInfo.inputtype;
            var required = descInfo.required;
            var requiredStar="";
            if(required==1){
                requiredStar="*";
            }
            var otherLi = riot.render(descAttr.tmplOtherLi, {"attrId":descInfo.id});
            var li = $(otherLi);

            var spanName = riot.render(descAttr.tmplSpan, {"required":required,"star":requiredStar,"attrName": attrName,"attrId":descInfo.id});
            li.append(spanName);

            if(inputType==INPUT_TYPE_RADIO){
                for(var j in typeValueList){
                    var info = typeValueList[j];
                    if(info.status==1 && info.show==1){
                        var radio = riot.render(descAttr.tmplRadio, {"radioName": info.value, "radioVal": info.id,"attrId":descInfo.id});
                        li.append(radio);
                    }
                }
            }else if(inputType==INPUT_TYPE_CHECK_BOX){
                for(var j in typeValueList){
                    var info = typeValueList[j];
                    if(info.status==1 && info.show==1) {
                        var check = riot.render(descAttr.tmplCheckbox, {"checkboxName": info.value, "checkboxVal": info.id});
                        li.append(check);
                    }
                }

            }else if(inputType == INPUT_TYPE_TEXT_AREA){
                var textareaId = riot.render(descAttr.tmplTextarea, {"textareaId": descInfo.id});
                li.append(textareaId);
            }
            li.append($(descAttr.tmplDel))
            jQuery("#other").before(li);
        }


        XUI.window.confirm(tmplDiv,"选择其他属性",closed);
        var attrSearch=selector();
        //console.log(resultJson.length)
    });

}


function selector(tag){
    var _tag = this;
    var config = {
            form : 'form-area',
            inp : 'attr-input',
            select : 'attr-s',
            action : false
        },
        config = $.extend(config,tag);
    var inp = $('.'+config.inp),
        select = $('.'+config.select);
    old = select.html();
    //控制隐藏所属子类显示区域.
    _tag.hide = function(doc){
        doc.bind('click',function(){
            select.css('display','none');
        });
    };
    //显示子类区域.
    _tag.show = function(obj,n){
        obj.bind('click',function(){
            switch(n){
                case 1:
                    _tag.reset();
                    obj.attr('value','');
                    obj.next().css('display','block');
                    break;
                default:
                    obj.parent().find('.'+config.select).css('display', 'block');
            }
            return false;
        })
    }
    //执行查询显示对应子类列表.
    _tag.query = function(obj){
        obj.bind('keyup',function(){
            var keyword = obj.attr('value');
            if(keyword==""){
                obj.next().css('display','none');
                return;
            }
            obj.next().html(_tag.search(resultJson,keyword));
            if(obj.next().html()!=""){
                obj.next().css('display','block');
            }else{
                obj.next().css('display','none');
            }
        })
    }
    //根据传入参数查找所属子类信息并返回.
    _tag.search = function(j,r){
        var re = new RegExp(r,'i');
        var s = '';
        for (var e in j){
            if (j[e].name.match(re)){
                //console.log('Output---> '+j[e].name)
                s+='<div attr='+JSON.stringify(j[e])+'>'+j[e].name+'</div>';
            }

        }
        return s;
    }
    //根据传入参数查找所属子类信息并返回.
    /*
     _tag.search = function(j,r){
     var re = new RegExp(r,'i');
     var s = '';
     for (var e in j){
     for (var i=0;i<j[e].length;i++){
     if (j[e][i].match(re)){
     console.log('Output---> '+j[e][i])
     s+='<div>'+j[e][i]+'</div>';
     }
     }
     }
     return s;
     }*/
    //初始化子类区域.
    _tag.reset = function(){
        select.html(old);
    };
    /*
     if (!config.action){
     var hidden = $('.hidden');
     _tag.show(inp);
     _tag.hide($(document));
     select.find('div').live('click',function(){
     $(this).parent().parent().find('.'+config.inp).html($(this).html());
     hidden.attr('value',$(this).html());
     });
     return false;
     }
     */

    _tag.query(inp);
    //_tag.show(inp,1);
    //_tag.show(inp);
    select.find('div').live('click',function(){
        $(this).parent().parent().find('.'+config.inp).attr('value',$(this).html());
        var jsonString = $(this).attr('attr');
        //var choiceJson = JSON.parse(jsonString);
        $(this).parent().parent().find('.'+config.inp).attr('attrInfo',jsonString);
    });
    /*
     select.find('div').live('click',function(){
     $(this).parent().parent().find('.'+config.inp).attr('value',$(this).html());
     })*/
    //_tag.reset(inp);
    //_tag.hide($(document));
    _tag.hide(select);

}

function delOtherDesc(obj){
    $(obj).parent().remove();
}
