/**
 * Created by chenzw on 2014/6/12.
 */
/** 单选 */
var INPUT_TYPE_RADIO = 1;
/** 复选框 */
var INPUT_TYPE_CHECK_BOX = 2;
/** 多行输入 */
var INPUT_TYPE_TEXT_AREA = 3;



    /**
     *  商品销售属性设置
     */
    var SalesDatas = function(_obj){
        var _adata = [];//选中，未选中判断
        var _aobj = {};//添加的属性集合，方法体
        var _self = this;
        var _sRootView = null;
        var _titles = [];
        /*
         * 初始化数值
         */
        this.start = function(){
            _sRootView = $(_obj.rootView+' li');
            _sRootView.each(function(){
                if(! $(this).hasClass('clear')){
                    var key = $(this).find('span').find('input').attr('class');//初始，kkid
                    var aAdd = new AddSclass(key);
                    _aobj[key] = aAdd
                    _adata.push(aAdd.eDtata);
                    //_titles.push($(this).find('.spw').html().split('：')[0]);
                    _titles.push($(this).find('.spw').text().split('*')[1].split('：')[0]);
                };
            });

        };

        /**
         * 更新数据
         */
        this.updata = function(){
            _adata = [];//所有已判断，是否选中的数据
            var _sArray = [];//所有已选中的值
            for(i in _aobj){//初始，没有数据
                _adata.push(_aobj[i].eDtata);
            };
            for (var i=0; i < _adata.length; i++) {//属性数
                var list = [];//每一组，选中的 txt 和 val
                for (var k=0; k < _adata[i].length; k++) {//每一个属性的长度
                    if(_adata[i][k].bl){//第i属性的k值，是否选择
                        list.push({txt:_adata[i][k].name, val:_adata[i][k].val});
                        //list.push(_adata[i][k].name);
                    };
                };
                _sArray.push(list);
            };

            var array = _sArray;//所有已选中的值
            var len = array.length;//所有选中的属性数
            var results = [];//选中值重新排序（组合）？
            var indexs = {};
            function specialSort(start) {
                start++;
                if (start > len - 1) {//未有选中组合的？
                    return;
                }
                if (!indexs[start]) {
                    indexs[start] = 0;
                }
                if (!(array[start] instanceof Array)) {
                    array[start] = [array[start]];
                }
                for (indexs[start] = 0; indexs[start] < array[start].length; indexs[start]++) {
                    specialSort(start);
                    if (start == len - 1) {
                        var temp = [];
                        for (var i = len - 1; i >= 0; i--) {
                            if (!(array[start - i] instanceof Array)) {
                                array[start - i] = [array[start - i]];
                            }
                            temp.push({txt:array[start - i][indexs[start - i]].txt, val: array[start - i][indexs[start - i]].val});
                        }
                        results.push(temp);
                    }
                }
            };

            specialSort(-1);

            $(_obj.showView+' tbody tr').hide();

            for (var i=0; i < results.length; i++) {
                var trId="";
                var trView = "<tr id='";
                var trOver ="'>"
                var tdView="";
                for (var k=0; k < _titles.length; k++) {
                    tdView += '<td class="attId" val="'+results[i][k].val+'">'+results[i][k].txt+'</td>';
                    trId+=results[i][k].val;
                };
                var trObj = jQuery("#"+trId);
                if(trObj.length>0){
                    jQuery("#"+trId).show();
                }else{

                    var Aview = trView+trId+trOver+tdView;

                    Aview += '<td><input type="text" class="price dili-price" maxlength="11" style="width:90px;"/></td></td><td><input type="text" class="stockNum dili-num" maxlength="9" style="width:90px;"/></td>'
                        +'<td><input type="text" class="supplyPrice dili-price" maxlength="11" style="width:90px;"/></td></tr>';


                    $(_obj.showView +' tbody').append(Aview);
                }

            };
        };


        /*$("."+_obj.radioNmae).change(function(){
            _self.updata();
        });*/

        /**
         * 绑定对象
         */
        function AddSclass(_view){//属性名，属性值，是否选中
            this.eDtata = [];
            this.key = _view;
            var _sAself = this;
            if(this.eDtata.length==0){
                //先默认执行一遍
                _sAself.eDtata = [];
                $('.'+_view).each(function(){
                    var key = $(this).attr('alt');//属性名
                    if($(this).attr('checked') == "checked"){
                        _sAself.eDtata.push({ bl : true, name:key, val:$(this).attr('value')+"-"+_view});
                    }else{
                        _sAself.eDtata.push({ bl : false, name:key, val:''});
                    };
                });
            }
            $('.'+_view).change(function(){
                _sAself.eDtata = [];
                $('.'+_view).each(function(){
                    var key = $(this).attr('alt');//属性名
                    if($(this).attr('checked') == "checked"){
                        _sAself.eDtata.push({ bl : true, name:key, val:$(this).attr('value')+"-"+_view});
                    }else{
                        _sAself.eDtata.push({ bl : false, name:key, val:''});
                    };
                });
                _self.updata();
            });

            return this;
        };


        _self.start();

        return this;
    };



