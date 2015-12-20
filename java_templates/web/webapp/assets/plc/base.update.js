String.prototype.trim = function() {
    return this.replace(/^\s+|\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
    return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
    return this.replace(/\s+$/,"");
}

/**
 * 新增提交，检查数据
 */
$(function(){
    $("input[name='submit']").bind("click",function(){

        if(!setPublishOrScanValue()){
            return;
        }
        um.execCommand( "clearlocaldata" );
        var $form = $("form#submit-form");
        $form.attr("action", "/titan/productBase/save");
        $form.submit();

    });
});



//预览
$("#submit-preview").click(function(){
    if(!setPublishOrScanValue()){
        return;
    }

    $.ajax({
        type : "post",
        url  : "/titan/productBase/preview",
        data : {name:$("input[name='name']").val(),
            subCateIds : $("input[name='subCateIds']").val(),
            descAttrJson:$("input[name='descAttrJson']").val(),
            imgJson : $("input[name='imgJson']").val(),
            tempType:$("input[name='tempType']").val(),
            tempIds : $("input[name='tempIds']").val(),
            desc:$("input[name='desc']").val(),
            pid : $("input[name='pid']").val()
        },
        dataType : "json",
        success : function(data){

            if(data.success == true){
                //XUI.window.alert("预览请求成功");
                $("input[name='json']").val(data.msg);
                console.info(data.msg);
                var $form = $("form#previewForm");
                $form.submit();
                return false;
            }else{
                console.info(data.msg);
                XUI.window.alert("预览失败，"+data.msg);
                return false;
            }
        },
        error : function(){
            XUI.window.alert("网络错误，请稍后重试");
        }
    });
});

function setPublishOrScanValue(){
    var name = $("input[name='title']").val();
    if(name.ltrim().length<10){
        alert("请输入商品标题(10-50之间的字符串)");
        return false;
    }
    var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》\-.【】\+=\]\[ ]+$/g;
    var message="请输入合法的商品标题（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，-，.，【】，[]，=，+”）";
    var attrAlert=$("div.alert");
    if (!regex.test(name)||name=="") {
        alert(message);
        return false;
    }
    $("input[name='name']").val(name);

    //子分类
    var subCids = $("input[name='subCid']");
    var arrSubCids  = new Array()
    for (var i=0;i<subCids.length;i++){arrSubCids[i] = subCids[i].value;}
    $("input[name='subCateIds']").val(arrSubCids);


    var attrFlag = true;
    //获取选择的描述属性
    var li = $("#descAttr").find("li");
    if(li == undefined || li.length == 0){
        //alert("没有描述属性");
    }else{
        var array = new Array();
        var k=0;//数组标签
        li.each(function(){
            var attrInfo = new Object();
            var inputHtml = $(this).find("input");
            var required = $(this).find(".spw").attr("alt");
            var  attrId= $(this).find(".spw").attr("val");
            //var attrId = $(inputHtml).eq(0).val();
            attrInfo.attrId=attrId;
            var inputType = $(inputHtml).eq(0).attr("type");
            if(inputType=="radio"){
                var radioChecked=$(inputHtml).filter(':checked');
                if(radioChecked.length==0){
                    if(required==1){
                        alert("请选择必填描述属性");
                        attrFlag = false;
                        return false;
                    }
                }else{
                    var radioValue = radioChecked[0].value;

                    var values= new Object();
                    values.id=radioValue;
                    values.value = "";
                    var vs = [];
                    vs.push(values);
                    attrInfo.attrValues=vs;
                }

            }else if(inputType=="checkbox"){
                var checkboxChecked=$(inputHtml).filter(':checked');
                if(checkboxChecked.length==0){
                    if(required==1){
                        alert("请选择必填的描述属性");
                        attrFlag = false;
                        return false;
                    }
                }else{
                    var vs = [];
                    for(var j=0;j<checkboxChecked.length;j++ ){

                        var values= new Object();
                        values.id=checkboxChecked[j].value;
                        values.value = "";
                        vs.push(values);

                    }

                    attrInfo.attrValues=vs;
                }
            }else if(inputType == "text"){
                if(inputHtml[0].value=="" && required==1){
                    alert("请填写必填的描述属性信息");
                    attrFlag = false;
                    return false;
                }
                if(inputHtml[0].value!=""){
                    var vs = [];
                    var values= new Object();
                    values.id=-1;
                    values.value =inputHtml[0].value;

                    vs.push(values);
                    attrInfo.attrValues=vs;
                }
            }else{
                var select = $(this).find("select option:selected");
                if(select.length>0){
                    if(select[0].value=="" && required==1){
                        alert("请选择必填的描述属性信息");
                        attrFlag = false;
                        return false;
                    }
                    if(select[0].value!=""){
                        var vs = [];
                        var values= new Object();
                        values.id=select[0].value;
                        values.value ="";
                        vs.push(values);
                        attrInfo.attrValues=vs;
                    }
                }

                var textarea = $(this).find("textarea");
                if(textarea.length>0){
                    if(textarea[0].value=="" && required==1){
                        alert("请填写必填的描述属性信息");
                        attrFlag = false;
                        return false;
                    }
                    if(textarea[0].value!=""){
                        var vs = [];
                        var values= new Object();
                        values.id=-1;
                        values.value =textarea[0].value;
                        vs.push(values);
                        attrInfo.attrValues=vs;
                    }

                }
            }

            if(attrInfo.attrValues!=undefined && attrInfo.attrValues.length>0){
                array.push(attrInfo);
            }

        });
        if(array.length>0){
            var json = JSON.stringify(array);
            $("input[name='descAttrJson']").val(json);
        }
    }

    if(!attrFlag){
        return false;
    }

    var imgsContainer = $("ul#list-images li");
    var imgs = new Array();
    $.each(imgsContainer, function(i, n){
        var temp = $(n);
        var img = new Object();
        img.imgUrl = temp.find("img").attr("src");
        img.order = temp.attr("val");
        //console.log($(n).find("img"));
        if(img.imgUrl){
            imgs.push(img);
        }
    });

    if(imgs.length==0){
        alert("请上传图片");
        return false;
    }
    $("input[name='imgJson']").val(JSON.stringify(imgs));
    //$("input[name='imgJson']").val("[{'imgUrl':'http://img5.dlimg.com/images/i0/10/05/1A48C47FC21A29E43F0129397F32A0A2.jpg','order':1},{'imgUrl':'http://img5.dlimg.com/images/i0/10/05/1A48C47FC21A29E43F0129397F32A0A2.jpg','order':2}]");
    //return false;
    var tempType = $('input:radio[name="pdesc"]:checked').val();

    $("input[name='tempType']").val(tempType);

    if(tempType==2){
        //自定义模板
        var arrCustTemp  = new Array()
        $(".del").each(function(){
            arrCustTemp.push($(this).attr("val"))
            $("input[name='tempIds']").val(arrCustTemp);
        });
    }
    if(um.getContent().trim().length==0){
        alert("请填写商品描述.");
        return false;
    }
    $("input[name='desc']").val(um.getContent());

    return true;
}
function setAlreadyValue(){
    var title = $("#title").val();
    if(title.ltrim().length<10){
        alert("请输入商品标题(10-50之间的字符串)");
        return false;
    }
    var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》\-.【】\+=\]\[ ]+$/g;
    var message="请输入合法的商品标题（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，-，.，【】，[]，=，+”）";
    var attrAlert=$("div.alert");
    if (!regex.test(title)||title=="") {
        alert(message);
        return false;
    }
    $("input[name='title']").val(title);
   
    var producing_area= $("select[name='obj.enterprise.countycity2']").val();
    if(producing_area==""||producing_area==undefined){
    	 alert("产地还需选择下一级");
         return;
    }
    var  producingValue=$("input[name='obj.enterprise.countycity']").val();
    $("input[name='producingId']").val(producingValue);
    
    var locality_area= $("select[name='obj.enterprise.county.locality1']").val();
    if(locality_area==""||locality_area==undefined){
        alert("所在地还需选择下一级");
        return false;
    }
   var localityValue= $("input[name='obj.enterprise.county.locality']").val();
    $("input[name='localityId']").val(localityValue);
    
    var deliveryAddr="";
    $("input[name='di']:checked").each(function(){
        deliveryAddr += $(this).val()+",";
    });
    deliveryAddr = deliveryAddr.length>1?deliveryAddr.substring(0,deliveryAddr.length-1):deliveryAddr;
    if(deliveryAddr==""){
        alert("请选择提货点");
        return false;
    }
    $("input[name='deliId']").val(deliveryAddr);
    if(um.getContent().trim().length==0){
        alert("请填写商品描述");
        return false;
    }
    $("input[name='desc']").val(um.getContent());
    return true;
}
function setImgValues(){
    $("input[name='imgJson']").val("");

    var imgsContainer = $("ul#list-images li");

    var imgs = new Array();

    //console.log(imgsContainer);

    $.each(imgsContainer, function(i, n){
        var temp = $(n);
        var img = new Object();
        img.imgUrl = temp.find("img").attr("src");
        img.order = temp.attr("val");
        //console.log($(n).find("img"));
        if(img.imgUrl){
            imgs.push(img);
        }

    });

    if(imgs.length==0){
        alert("请上传图片");
        return false;
    }
    $("input[name='imgJson']").val(JSON.stringify(imgs));

    return true;
}

//设置已有的可变的sku串
function setAlreadySku(){
    var flag = true;
    var skuInfoList = new Array();

    var quotationType=$("input[name='quotationType']").val();
    if(quotationType==2){
        //价格区间
        $("#price-describe tbody tr:visible").each(function(){
            var skuInfo = new Object();
            var singleSku = new Array();
            var sku = $(this).attr("sku");
            $(this).find(".attId").each(function(){
                var skuAttrId = new Object();
                var sku=$(this).attr("val").split("-pp");
                skuAttrId.attrId=sku[1];
                var vs = [];
                var skuAttrIdValue = new Object();
                skuAttrIdValue.id =sku[0];
                vs.push(skuAttrIdValue);
                skuAttrId.attrValues=vs;
                singleSku.push(skuAttrId);
            });

            /*sku = sku.length>0?sku.substring(0, sku.length-1):sku;
             skus+="{'sku':'"+sku+"','price':'"+$(this).find(".price").val()+"','stockNum':'"+$(this).find(".stockNum").val()+"','minNum':'"+$(this).find(".minNum").val()+"'},";*/
            skuInfo.saleAttrList=singleSku;
            var price = $(this).find(".priceText").text();
            if(price==""){
                price=0
            }
            var numPrice = new Number(price);
            skuInfo.price=Math.round(numPrice*100);
            skuInfo.store=$(this).find(".stockAble").val();
            var miniPur= $(this).find(".miniPur").val();
            if(miniPur=="" ||miniPur ==undefined){
                miniPur=0
            }
            skuInfo.sales=miniPur;

            if(skuInfo.store=="" || skuInfo.store <0){
                alert("请输入可供量");
                flag=false;
                return false;
            }

            var sales = new Number(skuInfo.sales);
            var store = new Number(skuInfo.store);
            /*if(sales>store){
                alert("起供量不能大于可供量");
                flag=false;
                return false;
            }*/

            skuInfo.hasSaleAttr=true;
            skuInfo.sku= sku;
            var json = JSON.stringify(skuInfo);
            //alert(json);
            skuInfoList.push(skuInfo);
        });

        if(skuInfoList.length==0 && flag){

            var skuInfo = new Object();

            var numPrice = new Number($(".price-range-json tr:visible").find(".price").eq(0).val());
            skuInfo.price=Math.round(numPrice*100);
            skuInfo.store=$(".stockNumInput").val();
            skuInfo.sales=$(".one").val();
            skuInfo.hasSaleAttr=false;
            var sku = $(".areadySku").val();
            skuInfo.sku=sku;

            var sales = new Number(skuInfo.sales);
            var store = new Number(skuInfo.store);

            skuInfoList.push(skuInfo);
        }
    }else{
        $("#describe tbody tr:visible").each(function(){
            var skuInfo = new Object();
            var singleSku = new Array();
            var sku = $(this).attr("sku");
            $(this).find(".attId").each(function(){
                var skuAttrId = new Object();
                var sku=$(this).attr("val").split("-kk");
                skuAttrId.attrId=sku[1];
                var vs = [];
                var skuAttrIdValue = new Object();
                skuAttrIdValue.id =sku[0];
                vs.push(skuAttrIdValue);
                skuAttrId.attrValues=vs;
                singleSku.push(skuAttrId);
            });

            /*sku = sku.length>0?sku.substring(0, sku.length-1):sku;
             skus+="{'sku':'"+sku+"','price':'"+$(this).find(".price").val()+"','stockNum':'"+$(this).find(".stockNum").val()+"','minNum':'"+$(this).find(".minNum").val()+"'},";*/
            skuInfo.saleAttrList=singleSku;
            var price = $(this).find(".price").val();
            if(price==""||price==0){
                alert("请输入供应价(需要大于0元)");
                flag=false;
                return false;
            }
            var numPrice = new Number(price);
            skuInfo.price=Math.round(numPrice*100);
            skuInfo.store=$(this).find(".stockNum").val();
            skuInfo.sales=$(this).find(".minNum").val();

            if(skuInfo.store=="" || skuInfo.store <0){
                alert("请输入可供量");
                flag=false;
            }
            if(skuInfo.sales=="" || skuInfo.sales <=0){
                alert("请输入起供量(需要大于0)");
                flag=false;
            }
            var sales = new Number(skuInfo.sales);
            var store = new Number(skuInfo.store);
            /*if(sales>store){
                alert("起供量不能大于可供量");
                flag=false;
            }*/

            skuInfo.hasSaleAttr=true;
            skuInfo.sku= sku;
            var json = JSON.stringify(skuInfo);
            //alert(json);
            skuInfoList.push(skuInfo);
        });


        if(skuInfoList.length==0 && flag){

            var skuInfo = new Object();
            var price = $("#skuPrice").val();
            if(price==""||price==0){
                alert("请输入供应价(需要大于0元)");
                flag=false;
                return false;
            }
            var numPrice = new Number(price);
            skuInfo.price=Math.round(numPrice*100);
            skuInfo.store=$("#skuStockNum").val();
            skuInfo.sales=$("#skuMinNum").val();
            skuInfo.hasSaleAttr=false;
            var sku = $("#noAttrSku").attr("sku");
            skuInfo.sku=sku;

            if(skuInfo.store=="" || skuInfo.store <0){
                alert("请输入可供量");
                flag=false;
            }
            if(skuInfo.sales=="" || skuInfo.sales <=0){
                alert("请输入起供量(需要大于0)");
                flag=false;
            }

            var sales = new Number(skuInfo.sales);
            var store = new Number(skuInfo.store);
            /*if(sales>store){
                alert("起供量不能大于可供量");
                flag=false;
            }*/
            skuInfoList.push(skuInfo);
        }
    }



    var jsonSku = JSON.stringify(skuInfoList);
    $("input[name='skuJson']").val(jsonSku);
    return flag;
}
function setAttrValues(){
    //获取选择的描述属性
    var attrFlag=true;
    var li = $("#descAttr").find("li");
    if(li == undefined || li.length == 0){
       // alert("没有描述属性");
    }else{
        var array = new Array();
        var k=0;//数组标签
        li.each(function(){
            var attrInfo = new Object();
            var inputHtml = $(this).find("input");
            var required = $(this).find(".spw").attr("alt");
            var  attrId= $(this).find(".spw").attr("val");
            //var attrId = $(inputHtml).eq(0).val();
            attrInfo.attrId=attrId;
            var inputType = $(inputHtml).eq(0).attr("type");
            if(inputType=="radio"){
                var radioChecked=$(inputHtml).filter(':checked');
                if(radioChecked.length==0 && required==1){
                    alert("请选择必填描述属性");
                    attrFlag=false;
                    return false;
                }
                if(radioChecked.length>0){

                    var radioValue = radioChecked[0].value;

                    var values= new Object();
                    values.id=radioValue;
                    values.value = "";
                    var vs = [];
                    vs.push(values);
                    attrInfo.attrValues=vs;
                }

            }else if(inputType=="checkbox"){
                var checkboxChecked=$(inputHtml).filter(':checked');
                if(checkboxChecked.length==0 && required==1){
                    alert("请选择必填的描述属性");
                    attrFlag=false;
                    return false;
                }
                if(checkboxChecked.length>0){

                    var vs = [];
                    for(var j=0;j<checkboxChecked.length;j++ ){

                        var values= new Object();
                        values.id=checkboxChecked[j].value;
                        values.value = "";
                        vs.push(values);

                    }

                    attrInfo.attrValues=vs;
                }
                //alert(checkboxChecked.length);

            }else if(inputType == "text"){
                if(inputHtml[0].value=="" && required==1){
                    alert("请填写必填的描述属性信息");
                    attrFlag=false;
                    return false;
                }
                if(inputHtml[0].value!=""){
                    var vs = [];
                    var values= new Object();
                    values.id=-1;
                    values.value =inputHtml[0].value;

                    vs.push(values);
                    attrInfo.attrValues=vs;
                }


            }else{
                var select = $(this).find("select option:selected");
                if(select.length>0){
                    if(select[0].value=="" && required==1){
                        alert("请选择必填的描述属性信息");
                        attrFlag=false;
                        return false;
                    }
                    if(select[0].value!=""){

                        var vs = [];
                        var values= new Object();
                        values.id=select[0].value;
                        values.value ="";
                        vs.push(values);
                        attrInfo.attrValues=vs;
                    }

                }

                var textarea = $(this).find("textarea");
                if(textarea.length>0){
                    if(textarea[0].value=="" && required==1){
                        alert("请填写必填的描述属性信息");
                        attrFlag=false;
                        return false;
                    }
                    if(textarea[0].value!=""){
                        var vs = [];
                        var values= new Object();
                        values.id=-1;
                        values.value =textarea[0].value;
                        vs.push(values);
                        attrInfo.attrValues=vs;
                    }

                }
            }

            if(attrInfo.attrValues!=undefined && attrInfo.attrValues.length>0){
                array.push(attrInfo);
            }

        });
        if(array.length>0){
            var json = JSON.stringify(array);
            $("input[name='descAttrJson']").val(json);
        }
    }
    if(!attrFlag){
       return attrFlag;
    }
    //销售属性
    var quotationType=$("input[name='quotationType']").val();
    if(quotationType==2){
        //区间报价
        var li = $(".price-view").find("li");
        if(li == undefined || li.length == 0){

        }
        else{
            var array = new Array();
            var skuNum = new Number(1);//初始成1，方便乘法，没有时，再设成0
            li.each(function(){
                var attrInfo = new Object();
                var inputHtml = $(this).find("input");
                var required = $(this).find(".spw").attr("alt");
                var  attrId= $(this).find(".spw").attr("val");
                attrInfo.attrId=attrId;

                var checkboxChecked=$(inputHtml).filter(':checked');
                if(checkboxChecked.length==0 && required==1){
                    alert("请选择必填的销售属性");
                    attrFlag=false;
                    return false;
                }
                var length = new Number(checkboxChecked.length);
                skuNum = skuNum * length;
                var vs = [];
                for(var j=0;j<checkboxChecked.length;j++ ){

                    var values= new Object();
                    values.id=checkboxChecked[j].value;
                    values.value = "";
                    vs.push(values);

                }

                attrInfo.attrValues=vs;

                if(attrInfo.attrValues!=undefined && attrInfo.attrValues.length>0){
                    array.push(attrInfo);
                }

            });
            if(array.length>0){
                var json = JSON.stringify(array);
                $("input[name='saleAttrJson']").val(json);
            }else{
                skuNum = new Number(0);
            }
            var skuTr = $("#price-describe tbody tr:visible").length;
            var skuTrNum = new Number(skuTr);
            if(skuNum!=skuTrNum){
                attrFlag=false;
                alert("请重新选择销售属性，内容与表格中信息不相等。")
            }
        }
    }else{
        var li = $("#saleAttr").find("li");
        if(li == undefined || li.length == 0){
            /*var array = new Array();
             $("input[name='saleAttrJson']").val(JSON.stringify(array));*/
        }
        else{
            var array = new Array();
            var skuNum = new Number(1);//初始成1，方便乘法，没有时，再设成0
            li.each(function(){
                var attrInfo = new Object();
                var inputHtml = $(this).find("input");
                var required = $(this).find(".spw").attr("alt");
                var  attrId= $(this).find(".spw").attr("val");
                //var attrId = $(inputHtml).eq(0).val();
                attrInfo.attrId=attrId;
                var inputType = $(inputHtml).eq(0).attr("type");
                if(inputType=="checkbox"){
                    var checkboxChecked=$(inputHtml).filter(':checked');
                    if(checkboxChecked.length==0 && required==1){
                        alert("请选择必填的销售属性");
                        attrFlag=false;
                        return false;
                    }
                    var length = new Number(checkboxChecked.length);
                    skuNum = skuNum * length;
                    var vs = [];
                    for(var j=0;j<checkboxChecked.length;j++ ){

                        var values= new Object();
                        values.id=checkboxChecked[j].value;
                        values.value = "";
                        vs.push(values);

                    }

                    attrInfo.attrValues=vs;


                }

                if(attrInfo.attrValues!=undefined && attrInfo.attrValues.length>0){
                    array.push(attrInfo);
                }

            });
            if(array.length>0){
                var json = JSON.stringify(array);
                $("input[name='saleAttrJson']").val(json);
            }else{
                skuNum = new Number(0);
            }
            var skuTr = $("#describe tbody tr:visible").length;
            var skuTrNum = new Number(skuTr);
            if(skuNum!=skuTrNum){
                attrFlag=false;
                alert("请重新选择销售属性，内容与表格中信息不相等。")
            }
        }
    }

    return attrFlag;
}

//添加子分类
$(function(){
    $("#addSubClass").click(function(){
        var scId = $(".subCategoryItemVal").val();
        if(scId=="" || scId==undefined){
            alert("请选择最后一级分类");
            return;
        }
        var mcId = $(".categoryItemVal").val();
        if(mcId=="" || mcId==undefined){
            alert("请选择主分类");
            return;
        }
        if(scId==mcId){
            alert("该分类已存在主分类上了");
            return;
        }
        var areadyScId = $("#scId"+scId).val();
        if(scId==areadyScId){
            alert("已经添加了");
            return;
        }
        var textSubClase = $("#subCategory .categoryItem").find('option:selected').text();
        var html='<span class="subSpan">'+textSubClase+";<input type='button' value='删除' class='u-but-sc' ><input type='hidden' name='subCid' id='scId"+scId+"' value="+scId+" ></span>";
        $("#subClass").append(html);
        $("#subCategory .categoryItem").each(function(){
            if($(this).attr("data-pid")==0){
                $(this).val("");
            }else{
                $(this).remove();
            }
        });
        $(".subSpan input").each(function(){
            $(this).click(function(){
                $(this).parent().remove();
            })
        });
    })
});
//绑定加载完成的修改页面
$(".subSpan input").each(function(){
    $(this).click(function(){
        $(this).parent().remove();
    })
});



//商品模板选择
jQuery("input:radio[name='pdesc']").live("change",function(){
    if(this.value==1){
        $(".opt").hide();
        $(".custumerTemp").hide();
        $(".categoryTemp").show();
        $(".scanTemp").hide();
    }else{
        if($(".del").length<3){
            $(".opt").show();
        }else{
            $(".opt").hide();
        }
        $(".custumerTemp").show();
        $(".categoryTemp").hide();
    }
});
//添加其他模板
$(function(){
    $("#addProductDescTemp").click(function(){
        if($(".del").length>=3) {
            alert("已经添加了3个模板");
            return false;
        }
        var tempId = $(".selectTemp").val();
        var already = false;
        $(".del").each(function(){
            if(tempId==$(this).attr("val")){
                alert("已经添加了该模板");
                already=true;
                return false;
            }
        });
        if(already){
            return false;
        }
        if(tempId==0){
            alert("请选择模板");
            return false;
        }
        var tempName = $(".selectTemp").find('option:selected').text();
        var resultTemp ='<span class="custumerTemp">'+tempName+'<input type="button" class="u-but-sc del" value="删除" val="'+tempId+'"></span>';
        $("#productTemp").append(resultTemp);

        //重新绑定
        $(".custumerTemp input").each(function(){
            $(this).click(function(){
                $(this).parent().remove();
                $(".opt").show();
            })
        });
        $(".scanTemp").hide();

        if($(".del").length>=3){
            $(".opt").hide();
        }
    })
});
//修改页面，加载绑定
$(".custumerTemp input").each(function(){
    $(this).click(function(){
        $(this).parent().remove();
        $(".opt").show();
    })
});
$(".selectTemp").change(function(){
   // $(".scanTemp").attr("onclick",window.open("/titan/templete/"+this.value));
    if(this.value==0){
        $(".scanTemp").hide();
    }else{
        if($(".del").length>=3) {
            return false;
        }else{
            $(".scanTemp").attr("onclick",'window.open('+"'/titan/templete/"+this.value+"')");
            $(".scanTemp").show();
            $(".opt").show();
        }
    }
});