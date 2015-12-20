//图片库
jQuery.ImgStore = {
    init:function(){
        var imageUpload = new ImageUpload();
        //商品图片上传 tab切换
        var TabAct = Tools.setSelected('tab', 'a', 'act', {
            fun:function(view){
                var _act = view.attr('val');
                if(_act == "0"){
                    $('.user-img').animate({left:'698px'});
                    $('.local-img').animate({left:'0px'});
                }else{
                    $('.local-img').animate({left:'-698px'});
                    $('.user-img').animate({left:'0px'});
                    $.ImgStore.loadStore(0);
                };
            }
        });
    },
        loadStore: function (id) {
            if(id==0){
                id=$("#imgCateId").val();
            }
            if(id==""){
                return false;
            }

            var tempDiv = "<div class='u_img' time='{imgTime}'><img src='{imgUrl}'><input type='checkbox'></div>";
            $("#imgstore").empty();

            $.ajax({
                type: "get",
                dataType: "json",
                url: "/image/getImage?cateId=" + id,
                success: function (data) {
                    if(data !=null && data.length>0){
                        for(var i in data){
                            var img = data[i];
                            var time = new Date(img.ctime).format("yyyy-MM-dd");
                            var imgDiv = riot.render(tempDiv, {"imgUrl":img.imageUrl,"imgTime": time});
                            $("#imgstore").append(imgDiv);
                        }
                    }

                },
                error: function () {
                    XUI.window.alert("加载图片库数据，网络错误，请稍后重试");
                }
            });
        },
        screen: function () {
            var startTime = $("#startTime").val();
            var startDate = new Date(startTime);
            var endTime = $("#endTime").val();
            var endDate = new Date(endTime);
            $(".u_img").each(function(){
                var time = $(this).attr("time");
                var imgDate = new Date(time);
                if(startDate> imgDate || imgDate>endDate){
                    $(this).hide();
                }else{
                    $(this).show();
                }
            })
        }
};


//选中用户图片添加到商品列表
$('.user_images .u_img input').live("change",function(){
    if($(this).attr('checked') == "checked"){
        var url = $(this).prev().attr('src');
        if(_index==0){
            $(".list-images .a-img").each(function(){
                var alreadyUrl = $(this).find('img').attr('src');
                if(alreadyUrl.length>5){
                    _index+= 1;
                }
            });
        }
        var _view = setView(_index);
        _view.attr('src', url);
        _index += 1;
        //ImageAct.setIndex(_index);
        $(".m-images .list li").eq(_index).click();
    };
});

//商品删除
$('.list-images .delete').click(function(){
    $(this).parent().parent().find('img').attr('src', '');
    $('.local-img .text').html('');
    return false;
});
//设为封面
$('.list-images .cover').click(function(){
    var imgsrc = $(this).parent().parent().find('img').attr('src');
    if(imgsrc==""){
        return false;
    }
    var cover = $('.list-images li').eq(0).find("div img").attr('src');

    $(this).parent().parent().find('img').attr('src',cover);
    $('.list-images li').eq(0).find("div img").attr('src',imgsrc);
    return false;
});
//商品拖动
$(".list-images").dragsort({ dragSelector: "div", dragBetween: true, dragEnd: function(){
    for (var i=0; i < 5; i++) {
        $('.list-images li').eq(i).attr('val', i);
        var cover = $('.list-images li').eq(i).find(".cover");
        if(i==0){
            if(cover!=undefined && cover.length==1){
                $('.list-images li').eq(i).find(".cover").remove();

            }
        }else{
            if(cover == undefined || cover.length==0){
                $('.list-images li').eq(i).find(".bar").prepend("<a href='#' class='cover'>设置为封面</a>");
                $('.list-images li').eq(i).find(".cover").click(function(){
                    var imgsrc = $(this).parent().parent().find('img').attr('src');
                    if(imgsrc==""){
                        return false;
                    }
                    var cover = $('.list-images li').eq(0).find("div img").attr('src');

                    $(this).parent().parent().find('img').attr('src',cover);
                    $('.list-images li').eq(0).find("div img").attr('src',imgsrc);
                    return false;
                })
            }
        }
    };
}});

//商品图片操作栏显示
$('.list-images li').hover(function(){
    $(this).find('.a-img').find('.bar').show();
}, function(){
    $(this).find('.a-img').find('.bar').hide();
});

var ImageAct = Tools.setSelected('list-images', 'li', 'act', {
    fun:function(view){
        var _act = view.attr('val');
        _act = parseInt(_act);
        _index = _act;
    }
});


var _index = 0;//商品选中下标
var _max = 6;//商品最大数限制
function previewImage(file){
    var MAXWIDTH  = 260;
    var MAXHEIGHT = 180;

    var div =$('.list-images .a-img img');
    //获取 photo的长度
    var $photolength = $(':input[name^=photo]').length;
    if (file.files && file.files[0]){  // alert(file.name);
        if(file.files.length > _max || _index >= (_max )){
            $('.local-img .text').html('你上传的图片已达上限');
            return false;
        };
        $('.local-img .text').html('');
        // div.innerHTML ='<img id=imghead>';
        if(file.files.length <= 1){
            var _view = setView(_index);
            var reader = new FileReader();
            reader.onload = function(evt){_view[0].src = evt.target.result;}
            reader.readAsDataURL(file.files[0]);
            _index += 1;
            ImageAct.setIndex(_index);
        }else{
            for (var i=0; i < file.files.length; i++) {
                var _file = file.files.item(i);
                var freader = new FileReader();
                freader.readAsDataURL(_file);
                freader.dView = $('.list-images .a-img img').eq(i);
                freader.onload=function(e){
                    this.dView.attr('src', e.target.result);
                };
                _index = i;
                ImageAct.setIndex(_index);
            };
        }
        //alert(img.attr('id'));
        //隐藏当前上传按钮  显示新的按钮
        $(file).hide();
        $(file).after("<input type='file' name='photo[]' onchange='previewImage(this)'/>");
    }else{ //兼容IE
        $('.list-images .a-img img').eq(_index).attr('src', $('#add-img').val());
        _index += 1;
        ImageAct.setIndex(_index);
    }
};
//图片大小设置
function setView (index){
    var div =$('.list-images .a-img img');
    var img = div.eq(index);
    img.load = function(){
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        img[0].width  =  rect.width;
        img[0].height =  rect.height;
        img[0].style.marginTop = rect.top+'px';
    }
    return img;
};
//IE下面图片计算
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight ){
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight ){
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
        }else{
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }
    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);

    return param;
};



