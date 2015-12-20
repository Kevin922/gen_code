Namespace.register("XUI.Attribute");
(function() {
	/** 添加属性项页面对象 */
	XUI.Attribute.AttrItem = function(){
		return {
			check  : function(){
				var self=this;
				var name=$("input[name='name']").val().replace(/(^\s*)|(\s*$)/g, "");
				$("input[name='name']").val(name);
				var alias=$("input[name='alias']").val().replace(/(^\s*)|(\s*$)/g, "");
				$("input[name='alias']").val(alias);
				var regex=/^[0-9a-zA-Z\u4e00-\u9fa5\/（）()&《》【】\+=\]\[]+$/g;
				var alertDiv=$("div.alert");

                if (!regex.test(name)||name=="") {
                    self.alertErrorMesg(alertDiv,"请输入合法的属性名称（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）");
                    return false;
                }

                if(alias==""){
                    $("input[name='alias']").val(name);
                }else{
                    var regex=/^[0-9a-zA-Z\u4e00-\u9fa5\/（）()&《》【】\+=\]\[]+$/g;
                    if (!regex.test(alias)) {
                        self.alertErrorMesg(alertDiv,"请输入合法的属性名称（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）");
                        return false;
                    }
                }

				var salesRangeVal = 0;
				var salesRange = $("input[attrType='attr_sales_range']");
				$.each(salesRange, function(i, n) {
					var temp = $(n);
					if (temp.is(":checked")) {
						salesRangeVal += Number(temp.val());
					}
				});
//				if (salesRangeVal==0) {
//					self.alertErrorMesg(alertDiv,"运营范围不能为空，请选择运营范围");
//					return false;
//				}
				var type=-1;
				var types = $("input[attrType='attr_desc']");
				$.each(types, function(i, n) {
					var temp = $(n);
					if (temp.is(":checked")) {
						type = Number(temp.val());
						return;
					}
				});
				if (type==-1) {
					self.alertErrorMesg(alertDiv,"请选择属性类型");
					return false;
				}
				return true;
			},
			alertErrorMesg:function(attrAlert,message){
				attrAlert.empty();
				attrAlert.append("<strong><i class='ace-icon fa fa-times'></i>错误!</strong>"+message+"<br>"); 
				attrAlert.show(); 
				setTimeout("$('div.alert').fadeOut()",3000);
			},
			//获取查询条件封装
			 getSearcherObje:function(){
				 var obj=new Object();
				 var inputTypeVal = $("select[name='inputtype']").val();
				 var type= $("select[name='type']").val();
				 var seacherName= $("input[name='name']").val();
                 var alias= $("input[name='alias']").val();
                 obj.inputTypeVal=inputTypeVal;
                 obj.type=type;
                 obj.seacherName=seacherName;
                 obj.alias=alias;
                 return obj;
			},
			//编辑：
			editAttrItem:function(id){
				var self = this;
				window.location.href = "/titan/attribute/editAttrItem/"+id+"?id="+id+"&condtioninputType="+self.getSearcherObje().inputTypeVal+"&condtionType="+self.getSearcherObje().type+"&condtionName="+self.getSearcherObje().seacherName+"&condtionAlias="+self.getSearcherObje().alias;
			},
			//属性值
			showAttrVal : function(id){
				var self = this;
				window.location.href = "/titan/attribute/showAttrVal/" + id+"?condtioninputType="+self.getSearcherObje().inputTypeVal+"&condtionType="+self.getSearcherObje().type+"&condtionName="+self.getSearcherObje().seacherName+"&condtionAlias="+self.getSearcherObje().alias;
			},
			deleteAttr : function(id){
				XUI.window.confirm("确定删除该属性吗？", "删除确认窗口", function(){
					$.ajax({
						type : "delete",
						dataType : "json",
						url      : "/titan/attribute/delete/" + id,
						success  : function(data){
							if(data){
								if(data.success){
									 window.location.href = "/titan/attribute?inputtype="+XUI.Attribute.AttrItem.getSearcherObje().inputTypeVal+"&type="+XUI.Attribute.AttrItem.getSearcherObje().type+"&name="+XUI.Attribute.AttrItem.getSearcherObje().seacherName+"&alias="+XUI.Attribute.AttrItem.getSearcherObje().alias;
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
			restoreAttr : function(id){
				XUI.window.confirm("确定还原该属性吗？", "还原确认窗口", function(){
					$.ajax({
						type : "get",
						dataType : "json",
						url      : "/titan/attribute/restore/" + id,
						success  : function(data){
							if(data){
								if(data.success){
									window.location.href =  "/titan/attribute/restoreAttrItem";
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
			selectInputType : function(form){
				var a = document.getElementById('form-field-select-1').value;
				if(a == 3) {
					document.getElementById('save-attr').value = "提交";
				} else {
					document.getElementById('save-attr').value = "提交并下一步";
				}
			},
			lockinputtype : function(){
				document.getElementById("form-field-select-2").value = document.getElementById("form-field-select-1").value;
			  	document.getElementById("form-field-select-1").value=2;
			  	document.getElementById("form-field-select-1").disabled=true;
			  	document.getElementById("form-field-checkbox").checked=true;
			  	document.getElementById("form-field-checkbox").disabled=true;
				document.getElementById('save-attr').value = "提交并下一步";
			},

			unlockinputtype : function(){
				if(document.getElementById("form-field-select-2").value != 0)
				{
					document.getElementById("form-field-select-1").value=document.getElementById("form-field-select-2").value;
				  	document.getElementById("form-field-select-1").disabled=false;
				}
			  	document.getElementById("form-field-checkbox").disabled=false;
				var a = document.getElementById('form-field-select-1').value;
				if(a == 3) {
					document.getElementById('save-attr').value = "提交";
				} else {
					document.getElementById('save-attr').value = "提交并下一步";
				}
			},
            lockAttrScope : function(obj){
                if(obj.checked){
                    document.getElementById("self_support_check").checked=true;
                    document.getElementById("consignment_sale_check").checked=true;
                }else{
                    document.getElementById("self_support_check").checked=false;
                    document.getElementById("consignment_sale_check").checked=false;

                }
            },
			lockAttr : function(id){
				XUI.window.confirm("锁定后所有分类将不能添加该属性，确认锁定吗？", "锁定确认", function(){
					$.ajax({
						type : "GET",
						dataType : "json",
						url      : "/titan/attribute/lock/" + id,
						success  : function(data){
							if(data){
								if(data.success){
//									 XUI.form.requery();
									window.location.href = "/titan/attribute?inputtype="+XUI.Attribute.AttrItem.getSearcherObje().inputTypeVal+"&type="+XUI.Attribute.AttrItem.getSearcherObje().type+"&name="+XUI.Attribute.AttrItem.getSearcherObje().seacherName+"&alias="+XUI.Attribute.AttrItem.getSearcherObje().alias;
								}else{
									XUI.window.alert(data.msg, "警告", null);
								}
							}
						},
						error    : function(){
							XUI.window.alert("网络错误，请稍后重试");
						}
					});
				});
			},
			unlockAttr : function(id){
				XUI.window.confirm("解除锁定后所有分类将可以添加该属性，确认解除锁定吗？", "解锁确认", function(){
					$.ajax({
						type : "GET",
						dataType : "json",
						url      : "/titan/attribute/unlock/" + id,
						success  : function(data){
							if(data){
								if(data.success){
//									  XUI.form.requery();
									window.location.href = "/titan/attribute?inputtype="+XUI.Attribute.AttrItem.getSearcherObje().inputTypeVal+"&type="+XUI.Attribute.AttrItem.getSearcherObje().type+"&name="+XUI.Attribute.AttrItem.getSearcherObje().seacherName+"&alias="+XUI.Attribute.AttrItem.getSearcherObje().alias;
								}else{
									XUI.window.alert(data.msg, "警告", null);
								}
							}
						},
						error    : function(){
							XUI.window.alert("网络错误，请稍后重试");
						}
					});
				});
			},
			submit : function(){
				var self = this;
				if (!self.check()) {
					return false;
				}
				var required = 0;
				var salesRangeVal = 0;
				var type = 0;
				var inputTypeVal = $("select[name='inputtype']")[0];
				if(inputTypeVal == null)
				{
					inputType = $("input[id='form-field-input-2']")[0].value;
				} else {
					inputType = inputTypeVal.value;
				}
				if ($("input[name='requiredVal']").is(":checked")) {
					required = 1;
				}
				var salesRange = $("input[attrType='attr_sales_range']");
				$.each(salesRange, function(i, n) {
					var temp = $(n);
					if (temp.is(":checked")) {
						salesRangeVal += Number(temp.val());
					}
				});
				var types = $("input[attrType='attr_desc']");
				$.each(types, function(i, n) {
					var temp = $(n);
					if (temp.is(":checked")) {
						type = Number(temp.val());
						return;
					}
				});

				$("form input[name='salesRange']").val(salesRangeVal);
				$("form input[name='required']").val(required);
				$("form input[name='type']").val(type);
				$("form input[name='inputtype']").val(inputType);
				$("form[name=attributeUpdateForm]").submit();
			},
			bindSaveAttrEvent : function(){
				var self = this;
				$("#save-attr").unbind("click").bind("click", function() {
					self.submit();
				});
			},
			init : function() {
				var self = this;
				self.bindSaveAttrEvent();
			},
		};
	}();
	
	XUI.Attribute.List = function() {
        return{
            init:function(){
                this.clear();
            },
            clear:function(){
                $(".btn-clear").click(function(){
                    $("select[name='type']").val("");
                    $("select[name='inputtype']").val("");
                    $("input[name='name']").val("");
                    $("input[name='alias']").val("");
                });
            }
        };
	}();

    XUI.Attribute.RestoreList = function() {
        return{
            init:function(){
                this.clear();
            },
            clear:function(){
                $(".btn-clear").click(function(){
                    $("input[name='name']").val("");
                    $("input[name='startTime']").val("");
                    $("input[name='endTime']").val("");
                });
            }
        };
    }();
    
	/** 添加属性值页面对象 */	
	XUI.Attribute.AttrVal = function(){
		return {
			toggleStatus   : function(item){
				var self=this;
				var showText = $(item).parent().find("span#show-label");
				var input = $(item).parent().parent().parent().find("input");
				var attrId=$("#attr-item-id").val();
				if(item.id){
					var temp=new Object();
					temp.id=item.id;
					temp.attrId=attrId;
					if(input.attr("status") == "show"){
						temp.show = 0;
					}else{
						temp.show = 1;
					};
					$.ajax({
						type : "post",
						url : "/titan/attribute/updateAttrShow",
						dataType : "json",
						contentType: "application/json",
						data : JSON.stringify(temp),
						success : function(data){
							if (data.success) {
								self.toggleButtonStatus(item,input,showText);
							}else{
								var alert=$("div.alert");
								self.alertErrorMesg(alert,"设置隐藏状态失败");
							}
						}
					});
				}else{
					this.toggleButtonStatus(item,input,showText);
				}
			},
			toggleButtonStatus:function(item,input,showText){
				if(input.attr("status") == "show"){
					input.attr("status", "hide");
					$(item).html("[显示]");
					showText.html("已隐藏");
				}else{
					input.attr("status", "show");
					$(item).html("[隐藏]");
					showText.html("已显示");
					}
			},
			modify:function(item,id,type){
				if(1 == type){
					if (this.checkEdit()) {
						var editSpan=$("tr#"+id+" span#attr-value-edit-hide.input-icon");
						$("tr#"+id+" label").hide();
						editSpan.show();
						editSpan.attr("id","attr-value-edit-show");
						editSpan.find("input").focus();
					}
				}				
			},
			checkEdit:function(){
				var edits=$("span#attr-value-edit-show");
				if (edits.size()>0) {
					XUI.window.alert("请先保存正在编辑的内容","警告",function(){});
					return false;
				}
				return true;
			},
			saveItem:function(item,id,attrId){
				var self=this;
				var input=$("tr#"+id+" input#attr-value-edit.col-xs-10");
				var value=input.val().replace(/(^\s*)|(\s*$)/g, "");
				input.val(value);
				if(this.checkVal(value)){
					var editSpan=$("tr#"+id+" span#attr-value-edit-show");
					var temp=new Object();
					temp.id=id;
					temp.attrId=attrId;
					temp.value=value;
					$.ajax({
						type : "post",
						url : "/titan/attribute/updateAttrVal",
						dataType : "json",
						contentType: "application/json",
						data : JSON.stringify(temp),
						success : function(data){
							if (data.success) {
								 editSpan.hide();
								 editSpan.attr("id","attr-value-edit-hide");
								 var label=$("tr#"+id+" label");
								 label.html(value);
								 label.show();
							}else{
								var alert=$("div.alert");
								self.alertErrorMesg(alert,data.msg);
							}
						}
					});
				}else{
					var alertDiv=$("div.alert");
					self.alertErrorMesg(alertDiv,"请输入合法的属性值名称（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）");
				}
			},
			alertErrorMesg:function(attrAlert,message){
				attrAlert.empty();
				attrAlert.append("<strong><i class='ace-icon fa fa-times'></i>错误!</strong>"+message+"<br>"); 
				attrAlert.show();
				setTimeout("$('div.alert').fadeOut()",3000);
			},
			checkVal :function(content){
				var regex=/^[0-9a-zA-Z\u4e00-\u9fa5\/（）()&《》【】\+=\]\[]+$/g;
				if (!regex.test(content)) {
					return false;
				}
				return true;
			},
			check  : function(){
				var self = this;
			},
			submit : function(){
				if (!this.checkEdit()) {
					return false;
				}
				
				var self = this;
				
				var list = new Array();
				var attrId = $("#attr-item-id").val();
				var datas = $("table#attr-val-tb input");
				var alertDiv=$("div.alert");
				var str = "";
				
				$.each(datas, function(i, n){
					var data = $(n);
					if(data.val()){
						var temp = new Object();
						temp.id = data.attr("attrValId");
						temp.value = data.val();
						str += temp.value;
						temp.attrId=attrId;
						if(data.attr("status") == "show"){
							temp.show = 1;
						}else{
							temp.show = 0;
						};
						temp.status = 1;
						temp.order = i + 1;
						list.push(JSON.stringify(temp));
					};
				});
				if(!this.checkVal(str)){
					self.alertErrorMesg(alertDiv,"请输入合法的属性值名称（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）");
					return false;
				}
				//搜索条件
				 var condtionType= $("input[name='condtionType']").val();
                 var condtioninputType= $("input[name='condtioninputType']").val();
                 var condtionName= $("input[name='condtionName']").val();
                 var condtionAlias= $("input[name='condtionAlias']").val();
				$.ajax({
					type : "post",
					url  : "/titan/attribute/doSaveAttrVal",
					dataType : "json",
					data : {"list" : JSON.stringify(list), "id" : attrId},
					success : function(data){
						if(data.success){
							XUI.window.alert("属性值保存成功","成功",function(){
								window.location.href="/titan/attribute/?type="+condtionType+"&inputtype="+condtioninputType
								+"&name="+condtionName+"&alias"+condtionAlias;
							});	
						}else{
							if (data.msg) {
								XUI.window.alert(data.msg,"失败","");	
							}else{
								XUI.window.alert("操作失败请联系系统管理员","失败",function(){});
							}
						}
					},
					error  : function(){
						XUI.window.alert("网络错误，请稍后重试");
					}
				});
			},
			init   : function(){
				var self = this;
				self.bindEvent();
			},
			deleteVal : function(item,id){
				XUI.window.confirm("是否删除此属性值", "确认删除", function(){
					var attrId=$("#attr-item-id").val();
				    if(id == null || id ==""){
				        $(item).parent().parent().parent().remove();
				        return ;
				    } else {
				        $.ajax({
					        type : "post",
					        url  : "/titan/attribute/deleteAttrValue",
					        dataType : "text",
					        data : {"valueId" : id,"attrId" : attrId},
					        success : function(data){
						        $(item).parent().parent().parent().remove();
					        }, 
					        error : function(){
						        XUI.window.alert("网络错误，请稍后重试");
					        }
				        });
				    }
				});
			},
			bindEvent : function(){
				var self = this;
				$("#add-attr-value").unbind("click").bind("click",function(){
					var temp = $("#attr_val_row_tmpl");
					var result = $.tmpl(temp).appendTo("table#attr-val-tb");
					var order = $("table#attr-val-tb tbody tr").length;
					console.log(order);
					$("table#attr-val-tb tbody tr").last().find("input").attr("order", order);
				});
				
				$("#save-attr").unbind("click").bind("click", function(){
					console.log("submit attr val");
					self.submit();
					return false;
				});
				
			},
			order : function(oper,item){
			    if(oper == 'up'){
			        var objParentTR = $(item).parent().parent();
                    var prevTR = objParentTR.prev();
                    if (prevTR.length > 0) {
                        prevTR.insertAfter(objParentTR);
                    } else {
                        return;
                    }			        
			    } else {
			        var objParentTR = $(item).parent().parent();
                    var nextTR = objParentTR.next();
                    if (nextTR.length > 0) {
                        nextTR.insertBefore(objParentTR);
                    } else {
                        return;
                    }			    
			    }
			},
			disableBatchInsert : function(){
				document.getElementById("batch-add-attr-value").disabled="disabled";
			},
			showBatchInsert : function(){
				document.getElementById("attr-value").style.display="none";
				document.getElementById("batch-attr-value").style.display="block";
				document.getElementById("add-attr-value").disabled="disabled";
				document.getElementById("batch-add-attr-value").disabled="disabled";
			},
			saveBatchEvent : function(id){
				var alertDiv=$("div.alert");
				var a = document.getElementById('batch-value').value;
				var str = a.split("\n");
				var text = "";
				for(var i=0; i<str.length; i++){
					if(str[i].length > 20){
						alertDiv.empty();
						alertDiv.append("<strong><i class='ace-icon fa fa-times'></i>错误!</strong>请确认每行输入字符不超过20个！<br>");
						alertDiv.show(); 
						setTimeout("$('div.alert').fadeOut()",3000);
						return false;
					} else {
						text += str[i].replace(/(^\s*)|(\s*$)/g, "");
					}
				}
				if(!this.checkVal(text)){
					var message="请输入合法的属性值名称（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）";
					alertDiv.empty();
					alertDiv.append("<strong><i class='ace-icon fa fa-times'></i>错误!</strong>"+message+"<br>"); 
					alertDiv.show();
					setTimeout("$('div.alert').fadeOut()",3000);
					return false;
				}
				$.ajax({
					type : "post",
					url  : "/titan/attribute/doBatchSaveAttrVal",
					dataType : "json",
					data : {"text" : a, "id" : id},
                    async:false,
					success : function(data){
						if(data.success){
							XUI.window.alert("属性值保存成功","成功");
						}else{
							if (data.msg) {
								XUI.window.alert(data.msg,"失败","");	
							}else{
								XUI.window.alert("操作失败请联系系统管理员","失败",function(){});
							}
						}
						return false;
					},
					error    : function(){
						XUI.window.alert("网络错误，请稍后重试");
					}
				});
			},
		};
	}();
})();
