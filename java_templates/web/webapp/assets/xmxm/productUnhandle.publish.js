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
        // 验证
        if(!checkDataAndSet()){
            return;
        }
        um.execCommand( "clearlocaldata" );
        var $form = $("form#submit-form");
        $form.attr("action", "/productUnhandle/publish");
        $form.submit();

    });
});

function checkDataAndSet(){
    // 1. 显示名称
    if(!checkAndSetPname()) {
        return false;
    }

    // 2. 图片
    if(!checkAndSetImgs()) {
        return false;
    }

    // 3. 是否发布
    if($("input[name='productOnSale']:checked").val() == "true") {
        $("input[name='status']").val(3);
    } else {
        $("input[name='status']").val(5);
    }

    // 4. 在售 - 3； 未上架 - 5
    if($("input[name='status']").val() == "3") {
        $("input[name='dropsTimeStr']").val($("#dropsTime").val());
    }

    // 5. 描述
    var description = $("#showDescription").val();
    if(description.length >= 150) {
        alert("商品简介不能超过 150字");
        return false;
    }
    if(description.length <= 0) {
        alert("请输入 商品简介");
        return false;
    }
    $("input[name='description']").val(description);

    // 6. 价格
    var priceYuan = $("#price").val();
    if(priceYuan == "") {
        alert("请输入销售价格");
        return false;
    }
    // 价格变为  分
    priceFen = parseInt(parseFloat(priceYuan) * 100);
    if(priceFen >= 1000000*100) {
        alert("请输入正确的销售价格（销售价格应小于 100万）");
        return false;
    } else if(priceFen <= 0 ) {
        alert("请输入正确的销售价格（销售价格不能为 负数）");
        return false;
    }
    $("input[name='price']").val(priceFen);

    // 7.详细描述
    $("input[name='detailDescription']").val(um.getContent());
    return true;
}

function checkAndSetPname() {
    var name = $("#showPname").val();
    //if(name.ltrim().length<10){
    //    alert("请输入商品标题(10-50之间的字符串)");
    //    return false;
    //}
    var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》\-.【】\+=\]\[ ]+$/g;
    var message="请输入合法的商品标题（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，-，.，【】，[]，=，+”）";
    if (!regex.test(name)||name=="") {
        alert(message);
        return false;
    }
    if(name.ltrim().length>48){
        alert("超出最大限制：最大48个字符");
        return false;
    }
    $("input[name='pname']").val(name);
    return true;
}

function checkAndSetImgs() {
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
    console.log(JSON.stringify(imgs));
    $("input[name='imgJson']").val(JSON.stringify(imgs));
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