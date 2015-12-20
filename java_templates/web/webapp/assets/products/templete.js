Namespace.register("XUI.Templete");

(function(){
    XUI.Templete = function () {
        return {
            deleteTemplete: function (id) {
                XUI.window.confirm("确定删除该模板吗？", "删除确认窗口", function () {
                    $.ajax({
                        type: "delete",
                        dataType: "json",
                        url: "/titan/templete/" + id,
                        success: function (data) {
                            if (data) {
                                if (data.code=='success') {
                                    window.location.href = "/titan/templete";
                                } else {
                                    XUI.window.alert(data.result);
                                }
                            }
                        },
                        error: function () {
                            XUI.window.alert("网络错误，请稍后重试");
                        }
                    });
                });
            },
            init:function(){
                this.clear();
            },
            clear:function(){
                $(".btn-clear").click(function(){
                    $("input[name='name']").val("");

                });
            }
        };
    }();
})();

