Namespace.register("XUI.Category");
tree = null;
addCateTree = null;

(function(){
	XUI.Category = function(){
		return {
			init : function(){
				var self = this;
				self.bindEvent();
				self.initTree();
				//XUI.tree.initWithDialog({}, function(data){console.log(data)});
			},
			//初始化树
			initTree : function(){
				var self = this;
				tree = new YAHOO.widget.TreeView("treeDiv1");
				var node = new YAHOO.widget.TextNode("所有分类", tree.getRoot(), true);
//                tree.subscribe('clickEvent',tree.onEventToggleHighlight);
//                tree.subscribe("expand", function(node) {
//                    alert("expand");
//                    console.log("expand");
//				});
//                node.subscribe("click", function(node){
//                    alert("click");
//                    console.log("click");
//				});
//                tree.subscribe("labelClick", function(node) {
//                    alert("labelClick");
//                    console.log("labelClick");
//                });
				node.data = {parent : 0, id : 0, name : "所有分类"};
				tree.setDynamicLoad(self.dynamic,1);
				tree.draw();
				tree.getRoot().expand();
			},
			refreshTree : function(){
				var self = this;
				tree.destroy();
				self.initTree();
			},
			//动态加载树
			dynamic : function(node, callback){
				var showDisabled = 1;
				if($("#show-disabled-category").is(":checked")){
					showDisabled = 0;
				}
				$.ajax({
					type : "post",
					data : {parent : node.data.id, status : 1, activate : showDisabled},
					url  : "/titan/category/findByParent",
					dataType : "json",
					success  : function(data){
						var list = data.list;
						if(list!=null && list.length!=0){
							  var maxOrder = list[list.length-1].order;
							$.each(list, function(i, n){
								var activeT = "已激活";
								var activeF = "未激活";
                                var name = "";
                                /*if(node.data.id==0){
                                    name="<em>" + n.name + "</em>";
                                }else{

                                }*/
                                var statusHtml = "<a onClick='XUI.Category.toggleActivate(\""+ n.id +"\")'>" +(n.activate==0 ? activeF : activeT)+ "</a> </div>";
                                if(!n.isClick){
                                    statusHtml = (n.activate==0 ? activeF : activeT)+"</div>";
                                }
								var node1 =new YAHOO.widget.HTMLNode("<div class='tree-view'><em>" + n.name+"("+n.id+")" + "</em><span>[<a onClick='XUI.Category.treeOperation(\""+n.id+"\", \"add\")' " +
									" class='btn btn-minier'>添加</a>" +
									"<a onClick='XUI.Category.treeOperation(\""+n.id+"\", \"edit\")'   class='btn btn-minier' >编辑</a>" +
									"<a onClick='XUI.Category.treeOperation(\""+n.id+"\", \"seo\")'   class='btn btn-minier' >SEO</a>" +
									"<a onClick='XUI.Category.treeOperation(\""+n.id+"\", \"delete\")'  class='btn btn-minier' >删除</a>" +
	                                "<a onClick='XUI.Category.treeOperation(\""+n.id+"\", \"showTemp\")'  class='btn btn-minier' >展示模板</a>" +
									"<img id='u1_img' class='img' title='向下排序' alt='向下排序' " +
									"onClick='XUI.Category.treeOperation(\"" + n.id + "\", \"down\");' style='cursor: pointer;' src='/assets/image/u61.png'>"+
									"<img id='u1_img' class='img' title='向上排序' alt='向上排序' " +
									"onClick='XUI.Category.treeOperation(\""+ n.id +"\",\"up\");' style='cursor: pointer;' src='/assets/image/u140.png'>]</span>" +
                                    statusHtml, node, false);
								node1.data = {parent : n.parent, name : n.name, id : n.id, order : n.order,maxOrder:maxOrder};
								node1.id = n.id;
							});
						}
						callback();
					}
				});
			},
			toggleActivate : function(id){
				var self = this;
				$.ajax({
					type : "post",
					url  : "/titan/category/toggleActivate",
					data : {id : id},
					dataType : "json",
					success : function(data){
						if(data.success){
							XUI.window.alert(data.msg, function(){
								self.refreshTree();
							});
						}else{
							XUI.window.alert(data.msg);
						}
					},
					error   : function(){
						XUI.window.alert("网络错误，请稍后重试");
					}
				});
			},
			//绑定页面按钮事件
			bindEvent : function(){
				var self = this;
				//点击添加一级分类按钮
				$("#add-first-category").unbind().bind("click", function(){
					self.submit("/titan/category/add", "0");
				});
				
				//点击搜索分类按钮
				$("#search-category-button").unbind().bind("click", function(){
					var showDisabled = 0;
					var keyword = $("#search-keyword").val();
					if($("#show-disabled-category").is(":checked")){
						showDisabled = 1;
					}
					XUI.Category.common.search(keyword, showDisabled);
				});
				
				$("#show-disabled-category").unbind().bind("click", function(){
					self.refreshTree();
				});
			},
			
			submit : function(url, parent, id){
				var form = $("form[name='myform']");
				if(arguments.length == 2){
					form.attr("action", arguments[0]);
					form.find("input[name='parent']").val(arguments[1]);
				}else{
					form.attr("action", "/titan/category/add");
					form.find("input[name='parent']").val(arguments[0]);
				}
				form.attr("method", "post");
				form.submit();
			},
			//树操作
			treeOperation : function(id, operation){
				var self = this;
				var node= tree.getNodeByProperty("id", id);
				if(operation =="add"){
					XUI.Category.common.addCategory(id);
					self.refreshTree();
				}
				if(operation == "edit"){
					XUI.Category.common.editCategory(id);
				}
				if(operation == "seo"){
					XUI.Category.common.seo(id);
				}
				if(operation =="up"){
					if(node.data.order == 0){
						XUI.window.alert("分类已经处于最顶端，无法上移");
						return false;
					}
					self.order({id : id, operation : "up"});
				}
				if(operation == "down"){
					if(node.data.order == (node.data.maxOrder )){
						XUI.window.alert("分类已经处于最末端，无法下移");
						return false;
					}
					self.order({id : id , operation : "down"});
				}
				if(operation == "delete"){
					XUI.Category.common.deleteCategory(id);
				}
                if(operation == "showTemp"){
                    var html ="<div><span style='font-size: 20px'>已有模板信息</span></div>";
                    var jHtml = $(html);
                    $.ajax({
                        type : "post",
                        url  : "/titan/category/searchById",
                        dataType : "json",
                        data     : {id:id},
                        async:false,
                        success  : function(data){
                            console.log(data);
                            if(data){
                                if(data.success){
                                    var list = data.list;
                                    if(list.length<=0){
                                        XUI.window.alert("暂无模板信息");
                                        return false;
                                    }
                                    $.each(list, function(i, n) {
                                        var temp ="<p>" + n.name + "</p>";
                                        jHtml.append(temp);
                                    });
                                    XUI.window.openDialog(jHtml.html(),{title:"模板信息"});

                                }else{
                                    XUI.window.alert(data.msg);
                                }
                            }
                        },
                        error    : function(){
                            XUI.window.alert("网络错误，请稍后重试");
                        }
                    });
                return false;
                }
				
			},
			//排序
			order : function(param){
				var self = this;
				$.ajax({
					type : "post",
					url  : "/titan/category/changeCateOrder",
					dataType : "json",
					data     : param,
					success  : function(data){
						console.log(data);
						if(data){
							if(data.success){
								XUI.window.alert(data.msg, function(){
									self.refreshTree();
								});
							}else{
								XUI.window.alert(data.msg);
							}
						}
					},
					error    : function(){
						XUI.window.alert("网络错误，请稍后重试");
					}
				});
			}
		};
	}();
	
	//分类模块公共方法
	XUI.Category.common = function(){
		return {
			deleteCategory : function(id){
				XUI.window.confirm("确定删除该类别吗？","确认删除", function(){
					$.ajax({
						type : "delete",
						dataType : "json",
						url      : "/titan/category/delete/" + id,
						success  : function(data){
							if(data.success){
								XUI.window.alert(data.msg, function(){
									window.location.href = "/titan/category";
								});
							}else{
								XUI.window.alert(data.msg);
							}
						},
						error    : function(){
							XUI.window.alert("网络错误，请稍后重试");
						}
					});
				});
			},
			toggleActivate : function(id){
				$.ajax({
					type : "post",
					url  : "/titan/category/toggleActivate",
					data : {id : id},
					dataType : "json",
					success : function(data){
						if(data.success){
							XUI.window.alert(data.msg, function(){
								window.location.href = "/titan/category";
							});
						}else{
							XUI.window.alert(data.msg);
						}
					},
					error   : function(){
						XUI.window.alert("网络错误，请稍后重试");
					}
				});
			},
			seo            : function(id){
				var data = new Array();
				var temp = new Object();
				temp.name= "id";
				temp.value = id;
				data.push(temp);
				XUI.form.submit("/titan/category/seo", "post", data);
			},
			addCategory    : function(parent){
				var data = new Array();
				var temp = new Object();
				temp.name = "parent";
				temp.value = parent;
				data.push(temp);
				XUI.form.submit("/titan/category/add", "post", data);
			},
			editCategory   :  function(id){
				var data = new Array();
				var temp = new Object();
				temp.name = "id";
				temp.value = id;
				data.push(temp);
				XUI.form.submit("/titan/category/edit", "post", data);
			},
			search        : function(keyword, showDisabled){
				if(!keyword || keyword ==""){
					XUI.window.alert("关键字不能为空");
					return false;
				}
				var data = new Array();
				var temp = new Object();
				temp.name = "keyword";
				temp.value = keyword;
				data.push(temp);
				temp = new Object();
				temp.name= "includeHidden";
				temp.value=showDisabled;
				data.push(temp);
				XUI.form.submit("/titan/category/search", "post", data);
				var form = $("form[name='myform']");
				form.append("<input type='hidden' name='keyword' value='"+keyword+"'>");
				form.append("<input type='hidden' name='includeHidden' value='"+showDisabled+"'>");
				form.attr("action", "/titan/category/search");
				form.attr("method", "post");
				form.submit();
			}
		};
	}();
	
	//添加和修改分类页面对象
	XUI.Category.add = function(){
		return {
			init : function(){
				var self = this;
				self.bindEvent();
				self.searchAttr();
                self.searchTemplete();
			},
			//初始化添加、修改页面的树对象
			initTree : function(){
				var self = this;
				addCateTree = new YAHOO.widget.TreeView("category-tree");
				var node = new YAHOO.widget.TextNode("所有分类", addCateTree.getRoot(), true);
				addCateTree.subscribe("expand", function(node) {
					
				});
				addCateTree.subscribe("click", function(node){
					//console.log(click);
				});
				node.data = {parent : 0, id : 0, name : "所有分类"};
				addCateTree.setDynamicLoad(self.dynamic);
				addCateTree.draw();
				addCateTree.getRoot().expand();
				//YAHOO.util.Event.addListener(window, "load", self.initTree);
			},
			//动态加载树
			dynamic : function(node, callback){
				$.ajax({
					type : "post",
					data : {parent : node.data.id},
					url  : "/titan/category/findByParent",
					dataType : "json",
					success  : function(data){
						var list = data.list;
						if(list!=null && list.length!=0){
	                        var maxOrder = list[list.length-1].order;
							$.each(list, function(i, n){
								var node1 =new YAHOO.widget.HTMLNode(n.name , node, false);
								node1.data = {parent : n.parent, name : n.name, id : n.id,maxOrder:maxOrder};
								node1.index = n.id;
							});
						}
						callback();
					}
				});
			},
			searchCallback : function(data){
				var self = this;
				if(data){
					if(data.success){
						var container = $("#search-select");
						var attrOptions = $("#attr-select option");
						container.empty();
						var list = data.list;
						$.each(list, function(i, n) {
							if(!self.isAttrExist(attrOptions, n.id)){
								var temp ="<option attr-id="+n.id+" attrTypeId="+ n.attrTypeId+" title=\""+ n.show +"\">" + n.show + "</option>";
								container.append(temp);
							}
						});
					}else{
						XUI.alert(data.msg);
					}
				}
			},
            //搜索模板后回调
            searchTempleteCallback : function(data){
                var self = this;
                if(data){
                    if(data.success){
                        var container = $("#search-select-temp");
                        var attrOptions = $("#temp-select option");
                        container.empty();
                        var list = data.list;
                        $.each(list, function(i, n) {
                            if(!self.isTempExist(attrOptions, n.id)){
                                var temp ="<option temp-id="+n.id+" title=\""+ n.name +"\">" + n.name + "</option>";
                                container.append(temp);
                            }
                        });
                    }else{
                        XUI.alert(data.msg);
                    }
                }
            },
			//判断某个属性在指定的选择框中是否存在
			//
			isAttrExist : function(options, id){
				var flag = false;
				$.each(options , function(i, n){
					if(id == $(n).attr("attr-id")){
						flag = true;
						return;
					}
				});
				return flag;
			},

            getAttrExistOption : function(options, id){
                var obj ;
                $.each(options , function(i, n){
                    if(id == $(n).attr("attr-id")){
                        obj = $(this);
                        return true;
                    }
                });
                return obj;
            },
            //判断某个属性在指定的选择框中是否存在
            //
            isTempExist : function(options, id){
                var flag = false;
                $.each(options , function(i, n){
                    if(id == $(n).attr("temp-id")){
                        flag = true;
                        return;
                    }
                });
                return flag;
            },
			//绑定事件
			bindEvent : function(){
				var self = this;
				//搜索属性按钮
				$("#search-attr").unbind().bind("click", function(){
					self.searchAttr();
					return false;
				});
                //搜索模板按钮
                $("#search-templete").unbind().bind("click", function(){
                    self.searchTemplete();
                    return false;
                });
				//从属性选择框中移除
				$("#remove-attr").unbind().bind("click", function(){
					var attrSelectedOptions = $("#attr-select option:selected");
					var searchableAttrOptions = $("#search-attr-select");
					$.each(attrSelectedOptions, function(i, n){
						var temp = $(n);
						searchableAttrOptions.find("option[attr-id='"+temp.attr("attr-id")+"']").remove();
						temp.remove();
					});
					
					self.searchAttr();
					return false;
				});
                //从模板选择框中移除
                $("#remove-temp").unbind().bind("click", function(){
                    var attrSelectedOptions = $("#temp-select option:selected");
                    //var searchableAttrOptions = $("#search-attr-select");
                    $.each(attrSelectedOptions, function(i, n){
                        var temp = $(n);
                        //searchableAttrOptions.find("option[attr-id='"+temp.attr("attr-id")+"']").remove();
                        temp.remove();
                    });

                    self.searchTemplete();
                    return false;
                });
				//从搜索选择框中添加到属性选择框
				$("#add-to-attr").unbind().bind("click", function(){
					self.addToAttrContainer();
					return false;
				});

                //从搜索选择框中添加到模板选择框
                $("#add-to-temp").unbind().bind("click", function(){
                    self.addToTempContainer();
                    return false;
                });
				
				//从属性选择框添加到可搜索属性选择框
				$("#add-search-attr").unbind().bind("click", function(){
					self.addToSearchAttrContainer();
					return false;
				});
				//从可搜索属性选择框中移除
				$("#remove-search-attr").unbind().bind("click", function(){
					var searchAttrSelectedOptions = $("#search-attr-select option:selected");
					$.each(searchAttrSelectedOptions, function(i, n){
						var temp = $(n);
						temp.remove();
					});
					return false;
				});
				
				$("#save-category-item").unbind().bind("click",function(){
					self.submit();
				});
				
				$("input[attrType='attr_sales_range']").bind("click", function(event){
					var target = $(event.target);
					var saleRanges =  $("input[attrType='attr_sales_range']");
					var saleRangesSelect = $("input[attrType='attr_sales_range']:checked");
					if(!target.is(":checked") && !self.checkChildrenSaleRange(target)){
						return false;
					}
                    if($(this).attr("name")!="third_party"){
                        if(this.checked){
                            document.getElementById("self_support_check").checked=true;
                            document.getElementById("consignment_sale_check").checked=true;
                        }else{
                            document.getElementById("self_support_check").checked=false;
                            document.getElementById("consignment_sale_check").checked=false;
                        }
                    }

					if(saleRangesSelect.length >0){
						self.searchAttr();
						self.checkLegalAttr();
					}else{
						var container = $("#search-select");
						container.empty();					
						self.clearAttrContainer();
					}
				});
				
				$("#return-category-page").unbind().bind("click", function(){
					window.location.href = "/titan/category";
				});
				
				/*$("#parent-category-name").unbind().bind("click", function(){
					$("#tree-container").show();
				});*/
			},
			clearAttrContainer : function(){
				$("#attr-select").empty();
				$("#search-attr-select").empty();
			},
			checkLegalAttr : function(){
				var self = this;
				var scopes = new Array();
				var attrs = new Array();
				var searchable = new Array();
				var attrContainer = $("#attr-select");
				var attrOptions = attrContainer.find("option");
				var searchableContainer = $("#search-attr-select");
				var searchableOptions = searchableContainer.find("option");
				//运营范围
				var salesRangeSelect = $("input[attrType='attr_sales_range']");
				$.each(salesRangeSelect, function(i, n){
					var temp = $(n);
					if(temp.is(":checked")){
						var saleRange = new Object();
						saleRange.scopeId = temp.val();
						scopes.push(saleRange);
					}
				});	
				//属性列表
				$.each(attrOptions , function(i , n){
					var temp = $(n);
					var attr = new Object();
					attr.id = temp.attr("attr-id");
					attrs.push(attr);
				});
				//可搜索属性列表
				$.each(searchableOptions, function(i, n){
					var temp = $(n);
					searchable.push(temp.attr("attr-id"));
				});
				if(scopes.length <=0 || attrs.length <= 0){
					return;
				}
				$.ajax({
					type : "post",
					url  : "/titan/attribute/checkExistAttribute",
					dataType : "json",
					data     : {scopes : JSON.stringify(scopes), attrs : JSON.stringify(attrs)},
					success : function(data){
						if(data){
							if(data.success){
								self.clearAttrContainer();
								var list = data.list;
								var order = 0;
								$.each(list, function(i, n){
									var temp ="<option attr-id="+n.id+" title=\""+ n.show +"\" order=" + order + ">"
									+ n.show + "</option>";
									attrContainer.append(temp);
									order++;
									for(x in searchable){
										if(searchable[x] == n.id){
											searchableContainer.append(temp);
											break;
										}
									}
								});
							}else{
								XUI.window.alert(data.msg);
							}
						}
					},
					error   : function(){}
				});
			},
			
			checkChildrenSaleRange : function(target){
				//TODO 检查是否使用这段代码
				var scopes = new Array();
				var id = $("input[name='id']").val();
				var salesRangeSelect = $("input[attrType='attr_sales_range']");
				$.each(salesRangeSelect, function(i, n){
					var temp = $(n);
					if(temp.is(":checked")){
						var saleRange = new Object();
						saleRange.scopeId = temp.val();
						scopes.push(saleRange);
					}
				});		
				var isLegal = false;
				
				$.ajax({
					type : "post",
					url  : "/titan/category/checkChildrenSaleRange",
					async : false,
					dataType : "json",
					data     : {cateId : id, target : target.val()},
					success : function(data){
						if(data){
							if(data.success){
								isLegal = true;
							}else{
								XUI.window.alert(data.msg);
							}
						}
					},
					error   : function(){}
				});
				return isLegal;
			},
			
			searchAttr : function (){
				var keyword = $("#keyword-input").val();
				if(!keyword){
					keyword = "";
				}
				var self = this;
				var scopes = new Array();
				var salesRangeSelect = $("input[attrType='attr_sales_range']");
				$.each(salesRangeSelect, function(i, n){
					var temp = $(n);
					if(temp.is(":checked")){
						var saleRange = new Object();
						saleRange.scopeId = temp.val();
						scopes.push(saleRange);
					}
				});
				$.ajax({
					type : "post",
					dataType : "json",
					url      : "/titan/attribute/searchByAjax",
					data     : {keyword : keyword, scopes : JSON.stringify(scopes)},
					success  : function(data){
						if(data){
							if(data.success){
								self.searchCallback(data);
							}else{
								XUI.window.alert(data.msg);
							}
						}
					},
					error    : function(){
						XUI.window.alert("网络错误，请稍后重试");
					},
				});
			},
            //搜素模板
            searchTemplete : function (){
                var keyword = $("#temp-keyword-input").val();
                if(!keyword){
                    keyword = "";
                }
                var self = this;

                $.ajax({
                    type : "post",
                    dataType : "json",
                    url      : "/titan/category/searchByAjax",
                    data     : {keyword : keyword},
                    success  : function(data){
                        if(data){
                            if(data.success){
                                self.searchTempleteCallback(data);
                            }else{
                                XUI.window.alert(data.msg);
                            }
                        }
                    },
                    error    : function(){
                        XUI.window.alert("网络错误，请稍后重试");
                    },
                });
            },

            //添加到销售属性，描述属性框
			addToAttrContainer : function(){
				var self = this;
				var attrSearchOptions = $("#search-select option:selected");
				var attrSelectContainer = $("#attr-select");
				var order = attrSelectContainer.find("option").length;
                var saleTypeCount = attrSelectContainer.find("option[attrTypeId='2']").length;
                var selectSaleCount =attrSearchOptions.filter("option[attrTypeId='2']").length;
                var choiceNum=selectSaleCount+saleTypeCount;
                if(choiceNum>2){
                    alert("一个类目只能设置两个销售属性，不能设置两个以上!");
                    return false;
                }
				$.each(attrSearchOptions, function(i, n){
					var temp = $(n);
                    if(temp.attr("attrTypeId")==2 && saleTypeCount>=2){
                        alert("一个类目只能设置两个销售属性，不能设置两个以上!");
                        return false;
                    }
					temp.attr("order", order);
                    temp.attr("selected",false);
					attrSelectContainer.append(temp);
					order++;
				});
				return false;
			
			},

            addToSearchAttrContainer : function(){
                var self = this;
                var attrSelectedOptions = $("#attr-select option:selected");
                var searchableOptions = $("#search-attr-select option");
                var searchAttrSelect = $("#search-attr-select");
                $.each(attrSelectedOptions, function(i, n){
                    var temp = $(n);
                    var tempText = $(n).text();
                    if (tempText.indexOf('-复选)')>0){
                        if(!self.isAttrExist(searchableOptions, temp.attr("attr-id"))){
                            temp.clone(temp).attr("order",searchableOptions.length+i).appendTo(searchAttrSelect);
                        }
                    }

                });
                return false;
            },

            //添加到模板到框
            addToTempContainer : function(){
                var self = this;
                var tempSearchOptions = $("#search-select-temp option:selected");
                var choiceNum=tempSearchOptions.length;
//                if(choiceNum>3){
//                    XUI.window.alert("添加的模板不能超过3个");
//                    return false;
//                }
                var tempSelectContainer = $("#temp-select");
                var order = tempSelectContainer.find("option").length;

                if((choiceNum+order)>3){
                    XUI.window.alert("添加的模板不能超过3个");
                    return false;
                }
                $.each(tempSearchOptions, function(i, n){
                    if((order)>=3){
                        XUI.window.alert("添加的模板不能超过3个");
                        return false;
                    }
                    var temp = $(n);
                    temp.attr("order", order);
                    tempSelectContainer.append(temp);
                    order++;
                });

                return false;

            },
			//提交保存
			submit  : function(){
				var parent = $("input[name='parent']").val();
				var name = $("input[name='category-name']").val();
                if(name!=""){
                    name = name.replace(/(^\s*)|(\s*$)/g, "");
                }
//				$("input[name='category-name']").val(name);
//                var alias = $("input[name='category-alias']").val();
//                if(alias!=""){
//                    alias = alias.replace(/(^\s*)|(\s*$)/g, "").replaceAll("，",",");
//                }
              
//                $("input[name='category-alias']").val(alias);
				var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》【】\+=\]\[]+$/g;
				var message="请输入合法的分类名称（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）";
                var message1="请输入合法的分类别名（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）";
                var regex1=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》【】\+=\]\[,]+$/g;
				if (name=="" || !regex.test(name)) {
                    XUI.window.alert(message);
					return false;
				}
//                if (alias!=""&&!regex1.test(alias)) {
//                    XUI.window.alert(message1);
//                    return false;
//                }
				var id = $("input[name='id']").val();
				var attrSelectOption = $("#attr-select option");
                var tempSelectOption = $("#temp-select option");
                var searchableSelectOptionS = $("#search-attr-select option");
				var searchableSelectOption = $("#search-attr-select");
				var saleRanges = new Array();
				var attrs = new Array();
                var templetes = new Array();
                var searchers = new Array();
//				var salesRangeSelect = $("input[attrType='attr_sales_range']");
//				$.each(salesRangeSelect, function(i, n){
//					var temp = $(n);
//					if(temp.is(":checked")){
//						var saleRange = new Object();
//						saleRange.scopeId = temp.val();
//						saleRanges.push(saleRange);
//					}
//				});
				
				$.each(attrSelectOption , function(i, n){
					var option = $(n);
					var temp = new Object();
					var attrId = option.attr("attr-id");
					temp.attrId = attrId;
					if(searchableSelectOption.find("option[attr-id='"+attrId+"']").length >= 1){
						temp.searchable = 1;
					}else{
						temp.searchable = 0;
					}
					temp.order = option.attr("order");
					attrs.push(JSON.stringify(temp));
				});

                $.each(searchableSelectOptionS , function(i, n){
                    var option = $(n);
                    var temp = new Object();
                    var attrId = option.attr("attr-id");
                    temp.attrId = attrId;
                    temp.order = option.attr("order");
                    searchers.push(JSON.stringify(temp));
                });

                //模板参数
                $.each(tempSelectOption , function(i, n){
                    var option = $(n);
                    var temp = new Object();
                    var tempId = option.attr("temp-id");
                    temp.templeteId = tempId;

                    temp.order = option.attr("order");
                    templetes.push(JSON.stringify(temp));
                });
				var url = null;
				if(id){
					url = "/titan/category/edit";
				}else{
					url = "/titan/category/add";
				}
				$.ajax({
					type : "put",
					dataType : "json",
					url      : url,
					data     : {
								name       : name,
//                                alias       : alias,
								parent     :parent,
								id         : id,
								list       : JSON.stringify(attrs),
                                searchList      : JSON.stringify(searchers),
								saleRanges : JSON.stringify(saleRanges),
                                templetes:JSON.stringify(templetes)
						        },
					success  : function(data){
						console.log(data);
						if(data){
							if(data.success){
								XUI.window.alert(data.msg, function(){
									window.location.href = "/titan/category";
								});
							}else{
								XUI.window.alert(data.msg);
							}
						}
					},
					error    : function(){
						XUI.window.alert("网络错误，请稍后重试");
					},
				});
			},
			
			//继承上级分类属性
			inheritAttr : function(){
				var self = this;
				var parent = $("form input[name='parent']").val();
				var scopes = new Array();
				var saleRangesSelect = $("input[attrType='attr_sales_range']:checked");
				if(saleRangesSelect.length <= 0){
					XUI.window.alert("请至少选择一种运营范围");
					return false;
				}
				$.each(saleRangesSelect, function(i, n){
					var temp = $(n);
					var saleRange = new Object();
					saleRange.scopeId = temp.val();
					scopes.push(saleRange);
				
				});
				$.ajax({
					type : "post",
					url  : "/titan/category/findAttrByParent",
					dataType : "json",
					data : {parent : parent, scopes : JSON.stringify(scopes)},
					success : function(data){
						if(data){
							if(data.success){
								var list = data.list;
                                var searchContainer = $("#search-select");
								var searchAttrOptions = searchContainer.find("option");
                                var attrIds = new Array();
                                $.each(list, function(i, n){
                                    if(self.isAttrExist(searchAttrOptions, n.attrId)){
                                        var option = self.getAttrExistOption(searchAttrOptions, n.attrId);
                                        option.prop("selected", 'selected');
//                                        option.trigger("dblclick");
//
                                        if(n.searchable == 1) {
                                            attrIds.push(n.attrId);
                                        }
                                    }

                                });
                                $("#add-to-attr").trigger("click", function () {

                                });
                                if(attrIds.length>0){
                                    for(var n in attrIds) {
                                        var selectAttrOptions = $("#attr-select").find("option");
                                        var selectOption = self.getAttrExistOption(selectAttrOptions, attrIds[n]);
                                        if (selectOption) {
                                            selectOption.prop("selected", 'selected');
                                            $("#add-search-attr").trigger("click");
                                            selectOption.prop("selected", false);
                                        }
                                    }
                                }
                                self.searchAttr();
							}
						}
					},
					error   : function(){
						XUI.window.alert("网络错误，请稍后重试");
					}
				});
			},
			
			//属性排序
			order : function(operation){
				var selected = $("#attr-select option:selected");
				if(selected.length > 0){
					if(operation == "up"){
						$.each(selected , function(i, n){
							var temp = $(n);
							var tempOrder = temp.attr("order");
							if(temp.prev().length > 0){
								if(temp.prev().is(":selected")){
									return;
								}
								temp.attr("order", temp.prev().attr("order"));
								temp.prev().attr("order", tempOrder);
								temp.after(temp.prev());
							}
						});
					}else{
						if(selected.length > 1){
							selected =  jQuery.makeArray(selected).reverse();
						}
						$.each(selected, function(i, n){
							var temp = $(n);
							var tempOrder = temp.attr("order");
							if(temp.next().length > 0){
								if(temp.next().is(":selected")){
									return;
								}
								temp.attr("order", temp.next().attr("order"));
								temp.next().attr("order", tempOrder);
								temp.before(temp.next());
							}
						});
					}
				}
			},
			
			//可搜索属性排序
			orderSeacherAttr : function(operation){
				var selected = $("#search-attr-select option:selected");
				if(selected.length > 0){
					if(operation == "up"){
						$.each(selected , function(i, n){
							var temp = $(n);
							var tempOrder = temp.attr("order");
							if(temp.prev().length > 0){
								if(temp.prev().is(":selected")){
									return;
								}
								temp.attr("order", temp.prev().attr("order"));
								temp.prev().attr("order", tempOrder);
								temp.after(temp.prev());
							}
						});
					}else{
						if(selected.length > 1){
							selected =  jQuery.makeArray(selected).reverse();
						}
						$.each(selected, function(i, n){
							var temp = $(n);
							var tempOrder = temp.attr("order");
							if(temp.next().length > 0){
								if(temp.next().is(":selected")){
									return;
								}
								temp.attr("order", temp.next().attr("order"));
								temp.next().attr("order", tempOrder);
								temp.before(temp.next());
							}
						});
					}
				}
			},
            //模板排序
            orderTemp : function(operation){
                var selected = $("#temp-select option:selected");
                if(selected.length > 0){
                    if(operation == "up"){
                        $.each(selected , function(i, n){
                            var temp = $(n);
                            var tempOrder = temp.attr("order");
                            if(temp.prev().length > 0){
                                if(temp.prev().is(":selected")){
                                    return;
                                }
                                temp.attr("order", temp.prev().attr("order"));
                                temp.prev().attr("order", tempOrder);
                                temp.after(temp.prev());
                            }
                        });
                    }else{
                        if(selected.length > 1){
                            selected =  jQuery.makeArray(selected).reverse();
                        }
                        $.each(selected, function(i, n){
                            var temp = $(n);
                            var tempOrder = temp.attr("order");
                            if(temp.next().length > 0){
                                if(temp.next().is(":selected")){
                                    return;
                                }
                                temp.attr("order", temp.next().attr("order"));
                                temp.next().attr("order", tempOrder);
                                temp.before(temp.next());
                            }
                        });
                    }
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
            }

        };
	}();
	
	//seo页面对象
	XUI.Category.seo = function(){
		return {
			init   : function(){
				var self = this;
				self.bindEvent();
                jQuery("#seo-title").blur(function(){
                    jQuery("#seo-title").val(this.value.ltrim());
                    jQuery("#seo-title").val(this.value.rtrim());
                    var message="请输入合法字符（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）";
                    var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》【】\+=\]\[,]+$/g;
                    if (this.value=="" || !regex.test(this.value)) {
                        XUI.window.alert(message);
                        return false;
                    }
                    if(this.value.length>200){
                        alert("title输入超过限制了，多出部分已处理，请重新调整输入");
                        this.value = this.value.substring(0,200);
                        jQuery("#seo-title").val(this.value);
                    }
                });
                jQuery("#seo-keyword").blur(function(){
                    jQuery("#seo-keyword").val(this.value.ltrim());
                    jQuery("#seo-keyword").val(this.value.rtrim());
                    var message="请输入合法字符（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）";
                    var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》【】\+=\]\[,]+$/g;
                    if (this.value=="" || !regex.test(this.value)) {
                        XUI.window.alert(message);
                        return false;
                    }
                    if(this.value.length>200){
                        alert("keyword输入超过限制了，多出部分已处理，请重新调整输入");
                        this.value = this.value.substring(0,200);
                        jQuery("#seo-keyword").val(this.value);
                    }
                });
                jQuery("#seo-desc").blur(function(){
                    jQuery("#seo-desc").val(this.value.ltrim());
                    jQuery("#seo-desc").val(this.value.rtrim());
                    var message="请输入合法字符（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）";
                    var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》【】\+=\]\[,]+$/g;
                    if (this.value=="" || !regex.test(this.value)) {
                        XUI.window.alert(message);
                        return false;
                    }
                    if(this.value.length>200){
                        alert("description输入超过限制了，多出部分已处理，请重新调整输入");
                        this.value = this.value.substring(0,200);
                        jQuery("#seo-desc").val(this.value);
                    }
                });
			},
					bindEvent : function(){
						var self = this;
						$("#submit-seo-info").unbind().bind("click", function(){
							self.submit();
						});
					},
			submit : function(){
				var param = new Object();
				param.cateId = $("#cate-id").val();
				param.seoTitle = $("#seo-title").val();
                if(param.seoTitle.trim()==""){
                    XUI.window.alert("请输入title");
                    return false;
                }
                var message="请输入合法字符（中文汉字、英文字母（含大小写）、数字、“/，（），&，《》，【】，[]，=，+”）";
                var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》【】\+=\]\[,]+$/g;
                if (param.seoTitle.trim()=="" || !regex.test(param.seoTitle.trim())) {
                    XUI.window.alert(message);
                    return false;
                }
				param.seoKeyword = $("#seo-keyword").val();
                if(param.seoKeyword.trim()==""){
                    XUI.window.alert("请输入keyword");
                    return false;
                }

                var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》【】\+=\]\[,]+$/g;
                if (param.seoKeyword.trim()=="" || !regex.test(param.seoKeyword.trim())) {
                    XUI.window.alert(message);
                    return false;
                }
				param.seoDesc = $("#seo-desc").val();
                if(param.seoDesc.trim()==""){
                    XUI.window.alert("请输入description");
                    return false;
                }
                var regex=/^[0-9a-zA-Z\u4e00-\u9fa5/（）()&《》【】\+=\]\[,]+$/g;
                if (param.seoDesc.trim()=="" || !regex.test(param.seoDesc.trim())) {
                    XUI.window.alert(message);
                    return false;
                }
				console.log(JSON.stringify(param));
				$.ajax({
					type : "put",
					url  : "/titan/category/seo",
					dataType : "json",
					data     : param,
					success  : function(data){
						//console.log(data);
						if(data){
							if(data.success){
								XUI.window.alert(data.msg, function(){
									window.location.href = "/titan/category";
								});
							}else{
								XUI.window.alert(data.msg);
							}
						}
					},
					error    : function(){
						XUI.window.alert("网络错误，请稍后重试");
					}
				});
			},
		};
	}();
	
	XUI.Category.search = function(){
		return {
			init : function(){
				var self = this;
				self.bindEvent();
			},
			bindEvent : function(){
				$("#search-category-button").unbind().bind("click", function(){
					var showDisabled = 0;
					var keyword = $("#search-keyword").val();
					if($("#show-disabled-category").is(":checked")){
						showDisabled = 1;
					}
					XUI.Category.common.search(keyword, showDisabled);
				});
			}
			
		};
	}();
	
})();

