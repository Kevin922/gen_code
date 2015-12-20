jQuery.ProductBase = {
    init : function (){
        $("input[name='pidInput']").blur(function(){
            if(this.value=="")
                return;
            if(/^[8]\d{9}$/.test(this.value)){}else{
                alert("编号输入有误，请重新输入");
                $(this).val("");
            }
        });



        this.clear();
    },
    query:function(){
        var pid = $("input[name='pidInput']").val();
        var name = $("input[name='nameInput']").val();
        var queryCateId = $("input[name='selectCateId']").val();
        $("input[name='pid']").val(pid);
        $("input[name='name']").val(name);
        $("input[name='queryCateId']").val(queryCateId);

        $("form#productBaseListForm").submit();
    },
    //获取查询条件
    getQueryProductBase:function(){
    	var obj=new Object();
    	  obj.pid=$("input[name='pid']").val();
    	  obj.name=$("input[name='name']").val();
    	  obj.queryCateId=$("input[name='queryCateId']").val();
    	  return obj;
    },
    //编辑商品
    editProductBase:function(pid){
      window.location.href="/titan/productBase/edit?id="+pid+"&pid="+$.ProductBase.getQueryProductBase().pid+"&name="+$.ProductBase.getQueryProductBase().name+"&queryCateId="+$.ProductBase.getQueryProductBase().queryCateId;
    },
    deleteProduct : function(pid){
        XUI.window.confirm("确定删除该商品吗？", "删除确认窗口", function(){
            $.ajax({
                type : "delete",
                dataType : "json",
                url      : "/titan/productBase/" + pid,
                success  : function(data){
                    if(data){
                        if(data.success){
//                            XUI.form.requery();
                        	window.location.href="/titan/productBase?pid="+$.ProductBase.getQueryProductBase().pid+"&name="+$.ProductBase.getQueryProductBase().name+"&queryCateId="+$.ProductBase.getQueryProductBase().queryCateId;
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
    putInStorage:function(pid){

        var showHtml="";
        var ok =true;
        $.ajax({
            type : "post",
            url  : "/titan/productBase/market",
            dataType : "json",
            data : {pid:pid},
            timeout: 3500,
            async:false,
            success : function(data){
                console.log(data);
                console.log("length:"+data.length);
                console.log("msg:"+data.msg);
                console.log("key:"+data.key);
                if(data.length>0){
                    for(var i in data){
                        console.log(data[i].id+":"+ data[i].name);
                        showHtml+="&nbsp;&nbsp;<input type='checkbox' value='"+ data[i].id+"'>"+ data[i].name
                    }
                }else if(data.length==undefined){
                    if(data.msg == undefined){
                        if(data.key == "success"){
                            XUI.window.alert("入库操作成功");
                            ok=false;
//                            XUI.form.requery();
                            window.location.href="/titan/productBase?pid="+$.ProductBase.getQueryProductBase().pid+"&name="+$.ProductBase.getQueryProductBase().name+"&queryCateId="+$.ProductBase.getQueryProductBase().queryCateId;
                            return false;
                        }else{
                            XUI.window.alert("入库操作没成功，"+data.key);
                            ok=false;
                            return false;
                        }
                    }else{
                        XUI.window.alert("操作没成功，"+data.msg);
                        ok=false;
                        return false;
                    }


                }else{
                    XUI.window.alert("没有市场");
                    ok=false;
                    return false;
                }
            },
            error : function(){
                XUI.window.alert("网络错误，请稍后重试");
                ok=false;
                return false;
            }
        });
        if(!ok){
            return false;
        }
        var tmplDiv="<div id='submitFlag' submitFlag=false>"+showHtml+"</div>";
        var closed = function(){
            var submitFlag=$("#submitFlag").attr("submitFlag");
            console.info("submitFlag:"+submitFlag);
            if(submitFlag=="true"){
                XUI.window.alert("请不要重复提交，系统正在处理");
                return false;
            }else{
                $("#submitFlag").attr("submitFlag",true);
            }
            var marketIds="";
            $("input[type='checkbox']").each(function(){
                if(this.checked){
                    marketIds+=this.value+",";
                }
            });
            marketIds = marketIds.substring(0,marketIds.lastIndexOf(","));
            //console.log(marketIds);
            var ok =true;
            $.ajax({
                type : "post",
                url  : "/titan/productBase/putIn",
                data : {marketIds : marketIds,pid:pid},
                dataType : "json",
                timeout: 3500,
                async:false,
                success : function(data){
                    //console.log(data.key);
                    if(data.key == "success"){
                        XUI.window.alert("操作成功");
                        return true;
                    }else{
                        XUI.window.alert("操作没成功，"+data.key);
                        ok=false;
                        return false;
                    }
                },
                error : function(){
                    XUI.window.alert("网络错误，请稍后重试");
                    ok=false;
                    return false;
                }
            });

            if(ok){
//                XUI.form.requery();
            	window.location.href="/titan/productBase?pid="+$.ProductBase.getQueryProductBase().pid+"&name="+$.ProductBase.getQueryProductBase().name+"&queryCateId="+$.ProductBase.getQueryProductBase().queryCateId;
            }else{
                return false;
            }

        };
        XUI.window.confirm(tmplDiv,"还有以下几个分站可选择入库",closed);

    },
    clear:function(){
        $(".btn-clear").click(function(){

            $("input[name='name']").val("");
            $("input[name='pid']").val("");
            $("input[name='nameInput']").val("");
            $("input[name='pidInput']").val("");

            $("input[name='queryCateId']").val("");

            $("#productCategory select:first option:first").prop("selected", 'selected');
            $("#productCategory select:first option:first").change();

        });
    }

};