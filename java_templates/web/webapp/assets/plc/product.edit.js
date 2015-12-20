String.prototype.trim = function() {
    return this.replace(/^\s+|\s+|\s+$/g,"");
};
String.prototype.ltrim = function() {
    return this.replace(/^\s+/,"");
};
String.prototype.rtrim = function() {
    return this.replace(/\s+$/,"");
};




/**
 * 修改提交，检查数据
 */
$(function(){
    $("#submit-edit").click(function(){

        if(!setPublishOrScanValue()){
            return;
        }

        var $form = $("form#edit-submit-form");
        $form.attr("action", "/titan/product/save");
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
        url  : "/titan/product/preview",
        data : {producingArea:$("input[name='producingArea']").val(),
            saleAttrJson : $("input[name='saleAttrJson']").val(),
            skuJson:$("input[name='skuJson']").val(),
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
    var producing_area= $("select[name='obj.enterprise.countycity2']").val();
    var  producingFirst=$("input[name='obj.enterprise.countycity']").attr("data-cate-txt");
    if(producingFirst=="中国"){
        if(producing_area==""||producing_area==undefined){
            alert("产地还需选择下一级");
            return false;
        }
    }
    var  producingValue=$("input[name='obj.enterprise.countycity']").val();
    if(producingValue==0){
        alert("请选择产地");
        return false;
    }
    $("input[name='producingArea']").val(producingValue);

    //设置描述属性和销售属性json格式
    if(!setAttrValues()){
        return false;
    }
    //修改设置sku串
    if(!setAlreadySku()){
        return false;
    }

    return true;
  }

//设置已有的可变的sku串
function setAlreadySku(){
    var flag = true;
    var skuInfoList = new Array();

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
            alert("请输入销售价(需要大于0元)");
            flag=false;
            return false;
        }
        var numPrice = new Number(price);
        skuInfo.price=Math.round(numPrice*100);
        skuInfo.store=$(this).find(".stockNum").val();

        var supplyPrice = $(this).find(".supplyPrice").val();
        if(supplyPrice==""||supplyPrice==0){
            alert("请输入供应价(需要大于0元)");
            flag=false;
            return false;
        }
        var numSupplyPrice = new Number(supplyPrice);
        skuInfo.supplyPrice=Math.round(numSupplyPrice*100);

        if(skuInfo.price<=skuInfo.supplyPrice){
            alert("请输入销售价需要大于供应价");
            flag=false;
            return false;
        }
        if(skuInfo.store=="" || skuInfo.store <0){
            alert("请输入可售量");
            flag=false;
        }

        skuInfo.hasSaleAttr=true;
        skuInfo.sku= sku;
//        var json = JSON.stringify(skuInfo);
        skuInfoList.push(skuInfo);
    });


    if(skuInfoList.length==0 && flag){

        var skuInfo = new Object();
        var price = $("#skuPrice").val();
        if(price==""||price==0){
            alert("请输入销售价(需要大于0元)");
            flag=false;
            return false;
        }
        var numPrice = new Number(price);
        skuInfo.price=Math.round(numPrice*100);

        skuInfo.store=$("#skuStockNum").val();

        var supplyPrice=$("#skuSupplyPrice").val();
        if(supplyPrice==""||supplyPrice==0){
            alert("请输入供应价(需要大于0元)");
            flag=false;
            return false;
        }
       
        var numSupplyPrice = new Number(supplyPrice);
        skuInfo.supplyPrice=Math.round(numSupplyPrice*100);
        if(skuInfo.price<=skuInfo.supplyPrice){
            alert("请输入销售价需要大于供应价");
            flag=false;
            return false;
        }
        skuInfo.hasSaleAttr=false;
        var sku = $("#noAttrSku").attr("sku");
        skuInfo.sku=sku;

        if(skuInfo.store=="" || skuInfo.store <0){
            alert("请输入可售量");
            flag=false;
        }

        skuInfoList.push(skuInfo);
    }


    var jsonSku = JSON.stringify(skuInfoList);
    $("input[name='skuJson']").val(jsonSku);
    return flag;
}
function setAttrValues(){
    //获取选择的描述属性
    var attrFlag=true;
    //销售属性
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
            alert("请重新选择销售属性，内容与表格中信息不相等。");
        }
    }
    return attrFlag;
}


