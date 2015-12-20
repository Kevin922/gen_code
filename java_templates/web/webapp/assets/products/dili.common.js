jQuery.Common = function () {
    return {
        price: function () {
            $(".dili-price").live("blur",function(){
                $(this).val(this.value.ltrim());
                if(this.value==""){
                    return;
                }

                if(/^[1-9][0-9]*(\.\d{1,2})?$|^[0](\.\d{1,2})?$/.test(this.value)){
                    if(this.value.length>6){
                        var price = new Number(this.value);
                        var one = new Number(1000000);
                        if(price<one){
                            return;
                        }else{
                            alert("输入的价格："+this.value+"不能大于等于100万");
                            jQuery(this).val("");
                        }
                    }
                    return;
                }else{
                    alert("输入的价格不正确："+this.value);
                    jQuery(this).val("");
                }
            });
        },
        num:function(){
            jQuery(".dili-num").live("blur",function(){
                jQuery(this).val(this.value.ltrim());
                if(this.value==""){
                    return;
                }
                if(/^\d+$/.test(this.value)){
                    return
                }else{
                    alert("数量输入有误："+this.value);
                    jQuery(this).val("");
                }
            });
        }
    };
}();

