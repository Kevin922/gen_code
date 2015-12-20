

Namespace.register("XUI.page");
(function(){
	XUI.page.serverDate = function() {
		var currentTime = $("#serverDate").attr("data-serverTime");
		if(XUI.isne(currentTime)){currentTime = (new Date()).getTime();}
		currentTime = parseInt(currentTime);
		var now = new Date(currentTime);
		$("#serverDate").attr("data-serverTime",currentTime+1000).text(now.format("yyyy-MM-dd HH:mm:ss"));
	};
})();
$(document).ready(function() {//页面入口
	XUI.init();
	window.setInterval(XUI.page.serverDate, 1000);//服务器时间
	$(document.body).bind("keyup",function(event){if(event.keyCode == 27) {XUI.window.close();}});
});