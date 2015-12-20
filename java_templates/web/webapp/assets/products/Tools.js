/**
 * jinrun
 * 2014-05-22
 * 工具类
 */

var Tools = (function(){

    /**
     * 设置选中状态class
     * _view : 最外面容器类名
     * _aView ： 需要绑定的标签
     * _show ： 需要显示的类名
     */
    this.setSelected = function(_view, _aView, _show, _obj){
        function addClass (){
            var _showView = $('.'+_view+' .'+_show);
            var _fView = '.'+_view+' '+_aView;
            var type = 'click';
            if(_obj && _obj.type){
                type = _obj.type;
            };
            $(_fView).live(type, function(){
                if(_showView){
                    _showView.removeClass(_show);
                };
                if(_obj && _obj.type == 'change'){
                    $(this).parent().parent().parent().addClass(_show);
                    _showView = $(this).parent().parent().parent();
                }else{
                    $(this).addClass(_show);
                    _showView = $(this);
                }
                if(_obj && _obj.fun){
                    _obj.fun($(this));
                };
                return false;
            });

            this.setIndex = function(index){
                if($(_fView).eq(index)){
                    if(_showView){
                        _showView.removeClass(_show);
                    };
                    $(_fView).eq(index).addClass(_show);
                    _showView = $(_fView).eq(index);
                }
            };

            return this;
        };

        return new addClass();
    };

    /**
     *  数量操作事件
     *  参数 obj  json对象
     *  必填:
     * 		obj.add             function
     * 		obj.change          function
     * 		obj.reduce          function
     *  选填：
     * 		obj.addView         string
     * 		obj.changeView      string
     * 		obj.reduceView      string
     */
    this.numChange = function(_view1, _view2, _view3){
        function DiliNum (){
            //数量减少
            $('.'+_view1).click(function(){
                var num = parseInt($(this).parent().next().find('input').val());
                if(num > 1){
                    num -= 1;
                    $(this).parent().next().find('input').val(num);
                };
            });
            //显示数值
            var inNum = 1;
            $('.'+_view2).focus(function(){
                inNum = parseInt($(this).val());
            }).blur(function(){
                if(parseInt($(this).val())){
                    if(parseInt($(this).val()) >= 10000){
                        $(this).val(inNum);
                    }else{
                        $(this).val(parseInt($(this).val()));
                    };
                }else{
                    $(this).val(inNum);
                };
            });
            //数量添加
            $('.'+_view3).click(function(){
                var num = parseInt($(this).parent().prev().find('input').val());
                if(num < 9999){
                    num += 1;
                    $(this).parent().prev().find('input').val(num);
                };
            });
        };

        function AjaxChange (){
            var _v1 = $('.increment');
            var _v2 = $('.quantity-text');
            var _v3 = $('.decrement');
            if(_view1.addView){
                _v1 = $('.'+_view1.addView);
            }else if(_view1.changeView){
                _v2 = $('.'+_view1.changeView);
            }else if(_view1.reduceView){
                _v3 = $('.'+_view1.reduceView);
            };
            _v1.live('click', _view1.add);
            _v2.live('change', _view1.change);
            _v3.live('click', _view1.reduce);

            this.showNum = function(_txt, _thisView){
                if(_txt == ""){
                    $(_thisView).parent().nextAll('.u-emt').animate({'height':'0px'});
                }else{
                    $(_thisView).parent().nextAll('.u-emt').html(_txt);
                    $(_thisView).parent().nextAll('.u-emt').animate({'height':'auto'});
                }
            };

            return this;
        };

        var _Nc = null;
        if(_view2){
            _Nc = new DiliNum();
        }else{
            _Nc = new AjaxChange();
        };

        return _Nc;
    };

    /**
     * 点击滚动图片
     */
    this.rollImages = function(_obj){
        function Img (){
            var config = {
                leftView : 'p-forward',
                rightView: 'p-backward',
                roollView: 'ulmove',
                width: 175,
                page : 0,
                lng : 5
            };
            config = $.extend(config, _obj);

            $('.'+config.leftView).click(function(){
                if((-config.page) < config.lng){
                    config.page -= 1;
                    am(config.page);
                };
            });
            $('.'+config.rightView).click(function(){
                if(config.page < 0){
                    config.page += 1;
                    am(config.page);
                };
            });

            function am(_index){
                $('.'+config.roollView).animate({'left':(_index * config.width)+'px'});
            };
        };
        return new Img();
    };

    /**
     * 解析url方法
     */
    this.request = function(paras){
        var url = location.href;
        var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
        var paraObj = {}
        for (i=0; j=paraString[i]; i++){
            paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if(typeof(returnValue)=="undefined"){
            return "";
        }else{
            return returnValue;
        }
    };

    /**
     * 输入框添加对象组件
     */
    this.addValue = function(_view){
        function AddValue (){
            var _p_view = $(_view);
            this.setData = function(data){
                _p_view.html('');
                var _show_view = '';
                var _aData = [];
                for (var i=0; i < data.length; i++) {
                    _show_view += '<div class="a-v-view"><p>'+data[i].txt+'</p><span class="a-v-view-d" inx="'+i+'">×</span></div>';
                    _aData.push(data[i].val);
                };
                _show_view += '<input type="hidden" class="a-v-hidden" value="'+_aData+'" name="'+_p_view.attr('data-name')+'" />';
                _p_view.html(_show_view);

                $('.a-v-view-d').click(function(){
                    var _index = $(this).attr('inx');
                    _index = parseInt(_index);
                    _aData.splice(_index, 1);
                    $(this).parent().remove();
                    _p_view.find('.a-v-hidden').remove();
                    var _h_view = '<input type="hidden" class="a-v-hidden" value="'+_aData+'" name="'+_p_view.attr('data-name')+'" />';
                    _p_view.append(_h_view);
                });

            };

            return this;
        };

        return new AddValue();
    };


    /**
     * 购物车提示信息
     */
    this.shoppingMsg = function(_v){
        var _view = $('.q-message');
        var _top = 0;
        var _time = null;
        if(_v){
            _view = $('.'+_v);
        };
        $('.q-close').click(function(){
            _view.hide();
            if(_time){
                clearTimeout(_time);
                _time = null;
            };
        });

        return {
            load : function(_this){
                if(_time){
                    clearTimeout(_time);
                    _time = null;
                };
                _view.find('.load').show();
                _view.find('.text').hide();
                var top = $(_this).parent().offset().top;
                var left = $(_this).parent().offset().left;
                _top = top - 55;
                _view.css({"top":_top, "left":left - 40}).animate({"height":'50px'});
                _view.show();
            },
            show : function(text){
                _time = setTimeout(function(){
                    _view.hide();
                    if(_time){
                        clearTimeout(_time);
                        _time = null;
                    };
                }, 5000);
                _view.animate({"height":'100px', 'top':_top-50}, function(){
                    _view.find('.load').hide();
                    _view.find('.text').show();
                    _view.find('.text').find('p').find('.q-total').html(text);
                });
            }
        }
    };

    return this;
})();


(function($){
    $.fn.simpleZoom = function(options){
        var defs = {
            zoomBox : "#zoomBox",			//需要放大的区域
            markSize : [200, 100],			//放大镜宽高
            zoomSize : [390, 390],			//需要放大的区域宽高
            zoomImg : [780, 780]			//需要放大的区域的图片的宽高
        };
        var opt = $.fn.extend({}, defs, options);
        return this.each(function(){
            var markBox = $(this);
            var zoomBox = $(opt.zoomBox);
            var zoom_img = $(opt.zoomBox).find("img");
            var markBoxSize = [markBox.width(), markBox.height(), markBox.offset().left, markBox.offset().top];
            var markSize = opt.markSize;
            var zoomSize = opt.zoomSize;
            var zoomImg = opt.zoomImg;
            var mark_ele = "<i id='mark'></i>";
            var mark_css = {position:"absolute", top:0, left:0, width:markSize[0]+"px", height:markSize[1]+"px", backgroundColor:"#fff", opacity:.5, filter:"alpha(opacity=10)", "-moz-opacity":0.5, display:"none", cursor:"crosshair"};

            var show_w = markBoxSize[0]-markSize[0];
            var show_h = markBoxSize[1]-markSize[1];

            zoomBox.css({width:zoomSize[0]+"px", height:zoomSize[1]+"px"});
            markBox.append(mark_ele);
            $("#mark").css(mark_css);

            markBox.mouseover(function(){
                $("#mark").show();
                zoomBox.show();
            }).mouseout(function(){
                $("#mark").hide();
                zoomBox.hide();
            }).mousemove(function(e){
                var l = e.pageX-markBoxSize[2]-(markSize[0]/2);
                var t = e.pageY-markBoxSize[3]-(markSize[1]/2);
                if(l < 0){
                    l = 0;
                }else if(l > show_w){
                    l = show_w;
                }
                if(t < 0){
                    t = 0;
                }else if(t > show_h){
                    t = show_h;
                }

                $("#mark").css({left:l+"px", top:t+"px"});

                var z_x = -(l/show_w)*(zoomImg[0]-zoomSize[0]);
                var z_y = -(t/show_h)*(zoomImg[1]-zoomSize[1]);
                zoom_img.css({left:z_x+"px", top:z_y+"px"});
            });
        });
    }
})(jQuery);