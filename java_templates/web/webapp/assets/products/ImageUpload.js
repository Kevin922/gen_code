/**
 * @author zzf
 * 参数:
 * 		选填：
 * 		_obj   参数对象
 * 		_obj.type   操作类型list多个上传  a为单个上传   默认多个上传
 * 		_obj.btn	表单ID
 * 		_obj.sbtn	表单上传元素ID
 * 		_obj.list   多个上传列表CLASS名称或者一个img对象的class
 * 		_obj.fun    失败回掉
 * 返回:无
 * 方法:无
 */

var ImageUpload = function(_obj){
	var _index = 0;
    var info = {
    		type : 'list',
    		btn : 'imageForm',
    		sbtn : 'uploadImg',
    		list : 'list-images',
            fun : function(){}
    };
    
    info = $.extend(info, _obj);
    
	
	//商品图片下标改变
	var ImageAct = Tools.setSelected(info.list, 'li', 'act', {
		fun:function(view){
			$("."+info.list+" .act").removeClass("act");
			view.addClass("act");
			var _act = view.attr('val');
        	_act = parseInt(_act); 
        	_index = _act;
		}
	});

    //点击图片上传
    var imgList = $("div.a-img");
    $.each(imgList, function(i, n){
        $(n).bind("click", function(){
            $("#" + info.sbtn).click();
        });
    });
	
	$('#'+info.sbtn).live('change', function(){
		//请求地址
		jQuery("#"+info.btn).ajaxSubmit(function(result){
		   var errorMsg = null; 
		   console.log(result);
			result = JSON.parse(result);
			if(result.success){
				if(info.type == "list"){
					// TODO: 如何动态渲染进？？
					var src = 'http://img0.xianmai365.com/xmxm_product_b2b/' + result.key;
					$("."+info.list+" .act").find('.a-img').find('img').attr('src', src).attr("library", "0");
					$("."+info.list+" .act").removeClass("act");
					_index += 1;
					ImageAct.setIndex(_index);
				}else{
					$('.'+info.list).attr('src', src);
				};
			}else{
				alert(result.msg);
			}
		   //if((/http:/).test(result)){
			//   if(info.type == "list"){
			//	   var src = '' + result.key;
			//	   $("."+info.list+" .act").find('.a-img').find('img').attr('src', src).attr("library", "0");
			//	   $("."+info.list+" .act").removeClass("act");
			//	   _index += 1;
			//	   ImageAct.setIndex(_index);
			//   }else{
			//	   $('.'+info.list).attr('src', src);
			//   };
		   //}else{
			//   //errorMsg = eval('(' + result + ')');
			//   errorMsg = result.msg;
		   //}
		   //if(errorMsg){
			//   alert(errorMsg);
            //   //return false;
		   //}
		   jQuery("#"+info.btn).resetForm();
	    });
	});
	
	
	return {}
};
