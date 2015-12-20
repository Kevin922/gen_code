 (function(){
	 document.write("<script type='text/javascript' src='/assets/yui/yuiloader/yuiloader-min.js'></script>");
	 document.write("<script type='text/javascript' src='/assets/yui/event/event-min.js'></script>");
	 document.write("<script type='text/javascript' src='/assets/yui/dom/dom-min.js'></script>");
	 document.write("<script type='text/javascript' src='/assets/yui/treeview/treeview-min.js'></script>");
	 document.write("<script type='text/javascript' src='/assets/yui/element/element-min.js'></script>");
	 document.write("<script type='text/javascript' src='/assets/yui/button/button-min.js'></script>");
 })();
 
 Namespace.register("XUI.tree");
 (function(){
 	XUI.tree = function(){
 		return{
 			initWithDialog : function(conf, callback){
 				var self = this;
 				bootbox.dialog({
 					message : "<div id='treeDialog' class='ygtv-highlight'></div>",
 					title : "请选择分类",
 					buttons : {
 						success : {
 							label : "确定",
 							className : "confirm btn btn-primary",
 							callback  : function(){
 								if(result.getHighlightedNode() != null){
 									callback(result.getHighlightedNode().data);
 								}else{
 									callback();
 									
 								}
 							},
 						},
 						cancel : {
 							label : "取消",
 							className : "cancel btn btn-default",
 						}
 					}
 				});
 				var result = self.init("treeDialog", conf, callback);
 				return result;
 			},
 			/**
 			 * 初始化树
 			 * @param container 必填参数，包含树的div的id，不需要#
 			 * @param conf 配置项，{onlyNormal : true/false, true：只显示未删除状态
 			 * 					onlyActivated : true/false, true: 只显示已激活分类
 			 * 					trigger : "trigger"} 触发容器，不需要#，当该容器点击时返回树中被选中的那条项目，并且触发callback回调函数
 			 * @param callback 回调函数，参数data ：{parent : parent, 父类目id
 			 * 									name : name, 分类名称
 			 * 									id : id, 分类id
 			 * 									order : order} 分类排序
 			 * @returns
 			 */
 			init : function(container, conf, callback){
 				var self = this;
 				if(!container){
 					return null;
 				}
 				var result = new YAHOO.widget.TreeView(container);
 				var node = new YAHOO.widget.TextNode("所有分类", result.getRoot(), true);
 				result.configure = conf;
 				result.singleNodeHighlight = true;
 				result.subscribe('clickEvent',result.onEventToggleHighlight);  
 				node.data = {parent : 0, id : 0, name : "所有分类"};
 				result.setDynamicLoad(self.dynamic);
 				result.getRoot().expand();
 				result.render();
 				//self.bindTrigger(result, conf.trigger, callback);
 				return result;
 			
 			},
 			bindTrigger : function(tree, trigger, callback){
 				var node = tree.getHighlightedNode();
 				if(trigger){
 					$("#" + trigger).unbind().bind("click", function(){
 						if(node){
 							callback(node.data);
 						}else{
 							callback(null);
 						}
 					});
 				}
 			},
 			dynamic : function(node, callback){
 				var tree = node.tree;
 				var param = {};
 				param.parent = node.data.id;
 				if(tree.configure.onlyNormal){
 					param.status = 1;
 				}
 				if(tree.configure.onlyActivated){
 					param.activate = 1;
 				}
 				$.ajax({
 					type : "post",
 					data : param,
 					url  : "/titan/category/findByParent",
 					dataType : "json",
 					success  : function(data){
 						var list = data.list;
 						$.each(list, function(i, n){
 							var node1 =new YAHOO.widget.TextNode(n.name, node, false);
 							node1.data = {parent : n.parent, name : n.name, id : n.id, order : n.order};
 							node1.id = n.id;
 						});
 						callback();
 					}
 				});
 			}
 		};
 	}();
 })();