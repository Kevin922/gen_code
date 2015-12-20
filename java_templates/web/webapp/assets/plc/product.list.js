jQuery.Product = {
    init : function (){
        $("input[name='basePidInput']").blur(function(){
            if(this.value=="") return;
            if(/^[8]\d{9}$/.test(this.value)){}else{
                alert("编号输入有误，请重新输入");
                $(this).val("");
            }
        });
        $("#allCheck").click(function(){
            var datas = $("table#productTable tbody tr");

            if(this.checked==true){
                $('input[type="checkbox"]').each(function(){
                    this.checked=true;
                })
            }else{
                $('input[type="checkbox"]').each(function(){
                    this.checked=false;
                })
            }

        });

        $("input.saleMax").blur(function(){  //keyup事件处理

            if(this.value==""){
                $("input[name='maxPrice']").val("");
                return;
            }
            var saleMin = $("input.saleMin").val();
            var saleMaxNum = new Number(this.value);
            if(saleMin!=""){
                var saleMinNum = new Number(saleMin);
                if(saleMaxNum<saleMinNum){
                    alert("不能小于最低查询销售价,请重新输入");
                    $(this).val("");
                }else{
                    $("input[name='maxPrice']").val(Math.round(saleMaxNum*100));
                }
            }else{
                $("input[name='maxPrice']").val(Math.round(saleMaxNum*100));
            }
        });
        $("input.saleMin").blur(function(){  //keyup事件处理
            jQuery(this).val(this.value.ltrim());
            if(this.value==""){
                $("input[name='minPrice']").val("");
                return;
            }
            var saleMax = $("input.saleMax").val();
            var saleMinNum = new Number(this.value.trim());
            if(saleMax!=""){
                var saleMaxNum = new Number(saleMax);
                if(saleMaxNum<saleMinNum){
                    alert("不能大于最高查询销售价,请重新输入");
                    $(this).val("");
                }else{
                    $("input[name='minPrice']").val(Math.round(saleMinNum*100));
                }
            }else{
                $("input[name='minPrice']").val(Math.round(saleMinNum*100));
            }
        });

        this.clear();
    },
    query:function(){
        var basePid = $("input[name='basePidInput']").val();
        var name = $("input[name='nameInput']").val();
        var queryCateId = $("input[name='selectCateId']").val();
        var statusSelect = $("select[name='statusSelect']").val();
        var marketIdSelect = $("select[name='marketIdSelect']").val();

        $("input[name='basePid']").val(basePid);
        $("input[name='name']").val(name);
        $("input[name='queryCateId']").val(queryCateId);
        $("input[name='status']").val(statusSelect);
        $("input[name='marketId']").val(marketIdSelect);

        $("form#productListForm").submit();
    },
    //获取查询条件
    getProductQuery:function(){
     var obj=new Object();
     var basePid= $("input[name='basePid']").val();//商品id
     var name= $("input[name='name']").val();//名称
     var queryCateId=  $("input[name='queryCateId']").val();//分类id
     var status=  $("input[name='status']").val();//状态
     var marketId=  $("input[name='marketId']").val();//市场id
     var saleMin=$("input.saleMin").val();//最小价格
         saleMin=Math.round(saleMin*100);
     var saleMax=$("input.saleMax").val();//最大价格
         saleMax=Math.round(saleMax*100);
//     var minTime=$("#minTime").val();//开始时间
//     var maxTime= $("#maxTime").val();//结束时间
     obj.basePid=basePid;
     obj.name=name;
     obj.queryCateId=queryCateId;
     obj.status=status;
     obj.marketId=marketId;
     obj.saleMin=saleMin;
     obj.saleMax=saleMax;
//     obj.minTime=minTime;
//     obj.maxTime=maxTime;
     return obj;
    },
    //编辑商品
    editProduct:function(pid){
    	window.location.href = "/titan/product/edit?id="+pid+"&basePid="+$.Product.getProductQuery().basePid+"&name="+$.Product.getProductQuery().name+"&queryCateId="+$.Product.getProductQuery().queryCateId+"&status="+$.Product.getProductQuery().status
    	+"&marketId="+$.Product.getProductQuery().marketId+"&minPrice="+$.Product.getProductQuery().saleMin+"&maxPrice="+$.Product.getProductQuery().saleMax;
    },
    deleteProduct : function(pid){
        XUI.window.confirm("确定删除该商品吗？", "删除确认窗口", function(){
            $.ajax({
                type : "delete",
                dataType : "json",
                url      : "/titan/product/" + pid,
                success  : function(data){
                    if(data){
                        if(data.success){
//                            XUI.form.requery();
                        	 window.location.href = "/titan/product?basePid="+$.Product.getProductQuery().basePid+"&name="+$.Product.getProductQuery().name+"&queryCateId="+$.Product.getProductQuery().queryCateId+"&status="+$.Product.getProductQuery().status
                         	+"&marketId="+$.Product.getProductQuery().marketId+"&minPrice="+$.Product.getProductQuery().saleMin+"&maxPrice="+$.Product.getProductQuery().saleMax;
                        }else{
                            XUI.window.alert(data.msg);
                        }
                    }
                },
                error    : function(){
                    XUI.window.alert("网络错误，请稍后重试");
                }
            });
        });
    },
    onSell:function(pid){

        var pids = "";
        if(pid==0){
            var datas = $("table#productTable tbody tr");
            $.each(datas, function(i, n){
                var data = $(n);
                var checkbox = data.find("#isCheck");
                if(checkbox.is(":checked")){
                    pids=pids + data.attr("productid")+",";
                };
            });
            if(pids!=""){
                pids = pids.substring(0,pids.length-1);
            }
        }else{
            pids = pid;
        }
        if(pids!="" && pids.length>0){
            XUI.window.confirm("确认上架选择的商品吗？", "上架确认", function(){
                $.ajax({
                    type	 : "POST",
                    dataType : "json",
                    url      : "/titan/product/onSell",
                    data : {"pids" : pids},
                    success  : function(data){
                        if(data){
                            if(data.success){
//                                XUI.form.requery();
                                window.location.href = "/titan/product?basePid="+$.Product.getProductQuery().basePid+"&name="+$.Product.getProductQuery().name+"&queryCateId="+$.Product.getProductQuery().queryCateId+"&status="+$.Product.getProductQuery().status
                            	+"&marketId="+$.Product.getProductQuery().marketId+"&minPrice="+$.Product.getProductQuery().saleMin+"&maxPrice="+$.Product.getProductQuery().saleMax;
                            }else{
                                XUI.window.alert(data.msg, "警告", function(){
//                                    window.location.href = "/titan/product";
                                	 window.location.href = "/titan/product?basePid="+$.Product.getProductQuery().basePid+"&name="+$.Product.getProductQuery().name+"&queryCateId="+$.Product.getProductQuery().queryCateId+"&status="+$.Product.getProductQuery().status
                                 	+"&marketId="+$.Product.getProductQuery().marketId+"&minPrice="+$.Product.getProductQuery().saleMin+"&maxPrice="+$.Product.getProductQuery().saleMax;
                                });
                            }
                        }
                    },
                    error    : function(){
                        XUI.window.alert("网络错误，请稍后重试");
                    }
                });
            });
        }else{
            alert("请选择商品编号。");
        }
    },
    offSell:function(pid){
        var pids = "";
        if(pid==0){
            var datas = $("table#productTable tbody tr");
            $.each(datas, function(i, n){
                var data = $(n);
                var checkbox = data.find("#isCheck");
                if(checkbox.is(":checked")){
                    pids=pids + data.attr("productid")+",";
                };
            });
            if(pids!=""){
                pids = pids.substring(0,pids.length-1);
            }
        }else{
            pids = pid;
        }
        if(pids!="" && pids.length>0){
            XUI.window.confirm("确认下架选择的商品吗？", "下架确认", function(){
                $.ajax({
                    type	 : "POST",
                    dataType : "json",
                    url      : "/titan/product/offSell",
                    data : {"pids" : pids},
                    success  : function(data){
                        if(data){
                            if(data.success){
//                                XUI.form.requery();
                            	 window.location.href = "/titan/product?basePid="+$.Product.getProductQuery().basePid+"&name="+$.Product.getProductQuery().name+"&queryCateId="+$.Product.getProductQuery().queryCateId+"&status="+$.Product.getProductQuery().status
                             	+"&marketId="+$.Product.getProductQuery().marketId+"&minPrice="+$.Product.getProductQuery().saleMin+"&maxPrice="+$.Product.getProductQuery().saleMax;
                            }else{
                                XUI.window.alert(data.msg, "警告", function(){
//                                    window.location.href = "/titan/product";
                                	 window.location.href = "/titan/product?basePid="+$.Product.getProductQuery().basePid+"&name="+$.Product.getProductQuery().name+"&queryCateId="+$.Product.getProductQuery().queryCateId+"&status="+$.Product.getProductQuery().status
                                 	+"&marketId="+$.Product.getProductQuery().marketId+"&minPrice="+$.Product.getProductQuery().saleMin+"&maxPrice="+$.Product.getProductQuery().saleMax;
                                });
                            }
                        }
                    },
                    error    : function(){
                        XUI.window.alert("网络错误，请稍后重试");
                    }
                });
            });
        }else{
            alert("请选择商品编号。");
        }
    },
    clear:function(){
        $(".btn-clear").click(function(){
            $("#statusSelect").val(0);
            $("input[name='status']").val(0);
            $("#marketIdSelect").val(0);
            $("input[name='marketId']").val(0);
            $("input[name='name']").val("");
            $("input[name='basePid']").val("");

            $("input[name='nameInput']").val("");
            $("input[name='basePidInput']").val("");
            $("input[name='queryCateId']").val("");

            $("input[name='minPrice']").val("");
            $("input[name='maxPrice']").val("");
            $("input.saleMin").val("");
            $("input.saleMax").val("");

//            $("#minTime").val("");
//            $("#maxTime").val("");

            $("#productCategory select:first option:first").prop("selected", 'selected');
            $("#productCategory select:first option:first").change();

        });
    }

};