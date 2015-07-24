/*
*assinput:联想输入
*by:　   zhe-he
*e-mail:    hezhe@jiaju.com
*人有多懒，思想就有多远
*version: 1.0
*last-time:2015-7-22
*/
(function ($){
    $.tools = $.tools || {version: '1.0'};
    $.tools.Assinput = {
        ul:  '',                //选填
        hidden: '',            //选填
        input: '',              //选填
        data:   '',             //必填
        keyword:    '',         //当data为字符串时,必填
        ajax:       {},         //当data为字符串时,必填
        format:    '',          //选填
        para:       {},         //选填
        callback:   function (){}   //选填
    }

    function Assinput(ele,json){
        var _this = this;

        this.ul = !!json.ul?$(ele).find(json.ul):$(ele).find('ul').eq(0);         //联想的菜单ul
        this.hidden = !!json.hidden?$(ele).find(json.hidden):$(ele).find('input[type=hidden]').eq(0); //选中的值
        this.input = !!json.input?$(ele).find(json.input):$(ele).find('input[type=text]').eq(0);   //输入框
        this.callback = json.callback;          //回调事件
        
        this.para = json.para || {};            //自定义参数名，仅当this.format='hard'设置
        this.format = (this.para.key && this.para.value)?'hard':json.format;

        this.data = json.data;                  //数据

        this.keyword = json.keyword;            //接口传入的keyword参数名，仅当this.data 为字符串时生效
        this.ajax = json.ajax;                  //接口，仅当this.data 为字符串时生效


        this.re = /(?:)/;                   //正则匹配
        this.ready = false;                 //控制失焦与点击

        this.init();
    };

    Assinput.prototype = {
        constructor:   Assinput,
        init:          function (){
            delete this.init;
            var _this = this;
            this.input.keyup(function (){       //抬起查询
                _this.find.call(_this);
            });

            this.input.focus(function (){       //聚焦查询
                _this.find.call(_this);
            });
            this.input.blur(function (){       
                setTimeout(function (){         
                    if (!_this.ready) {         //如果失焦没产生点击事件选择第一个
                        _this.blur.call(_this);
                    };
                },300);
            });

            this.ul.delegate('li','click',function (){    //创建的li选择事件
                var value = $(this).html();
                var key = $(this).attr('data-key');
                _this.ready = true;
                _this.set.call(_this,value,key);
            });
        },
        _ajax:          function (){
            var _this = this;
            
            this.ajax.success = function (data){        //请求成功的回调函数
                _this.success(data);
            }
            $.ajax(this.ajax);
        },
        success:        function (data){                //处理自定义参数字符串的data
            if (typeof data === 'string') {             
                data = $.parseJSON(data);
            };
            if (typeof this.data === 'string') {       //仅在第一次处理
                var arr = this.data.split('.');
                var str = 'data';
                for (var i = 0; i < arr.length; i++) {
                    str += '["'+arr[i]+'"]';
                };
                this.data = eval(str);
            };
            
            this.get();
        },
        filter:         function (){
            var name,i=0;
            var reKey = /\w+/g;
            if(Object.prototype.toString.call(this.data).indexOf('Array') != -1 && this.data.length > 0){
                if(Object.prototype.toString.call(this.data[0]).indexOf('Object') != -1) {
                    for(name in this.data[0]){
                        i++;
                        if (i === 1) {
                            if (reKey.test(this.data[0][name])) {
                                this.para.key = name;
                            }else{
                                this.para.value = name;
                            };
                        }else{
                            if (!this.para.key) {
                                this.para.key = name;
                            }else{
                                this.para.value = name;
                            };
                        }  
                    }
                    if (i === 1) {
                        this.format = 'normal';
                    }else{
                        this.format = 'hard';
                    };
                };
            }else if(Object.prototype.toString.call(this.data).indexOf('Object') != -1){
                this.format = 'easy';
            }else{
                this.format = 'unknow';
                throw '当前格式无法解析'
            }
        },
        find:          function (){                     
            var value = this.input.val();
            if (this.ajax) {                            //判断是用接口还是用正则
                this.ajax.data[this.keyword] = value;
                this._ajax();
            }else{
                this.re = RegExp(value);
                this.get();
            };  
        },
        blur:          function (ev){                   //失焦事件
            var child = this.ul.children();
            var value = '';
            var key = '';
            if (child.length && this.input.val()) {       //input有值，选择第一个
                value = child.eq(0).html();
                key = child.eq(0).attr('data-key');
            };
            this.set(value,key);
        },
        get:           function (){
            !this.format && this.filter();      //没有传format,自动解析

            this.ul.css('display','none');
            this.ul.empty();                    //清空ul
                                                //判断传入数据的格式
            if(this.format === 'easy'){
                for(var name in this.data){
                    if (this.ajax || this.re.test(this.data[name]) || this.re.test(name)) {
                        var item = [
                            '<li data-key=',
                            name,
                            '>',
                            this.data[name],
                            '</li>'
                        ];
                        item = item.join('');
                        this.ul.append(item).css('display','block');    //插入li
                    };
                }
            }else if(this.format === 'normal'){
                for (var i = 0; i < this.data.length; i++) {
                    for(var name in this.data[i]){
                        if (this.ajax || this.re.test(this.data[i][name]) || this.re.test(name)) {
                            var item = [
                                '<li data-key=',
                                name,
                                '>',
                                this.data[i][name],
                                '</li>'
                            ];
                            item = item.join('');
                            this.ul.append(item).css('display','block');    //插入li
                        };
                    }
                };
            }else if(this.format === 'hard'){
                for (var i = 0; i < this.data.length; i++) {
                    if (this.ajax || this.re.test(this.data[i][this.para.key]) || this.re.test(this.data[i][this.para.value])) {
                        
                        var item = [
                            '<li data-key=',
                            this.data[i][this.para.key],
                            '>',
                            this.data[i][this.para.value],
                            '</li>'
                        ];
                        item = item.join('');
                        this.ul.append(item).css('display','block');    //插入li
                    };
                }
            }
            
        },
        set:         function (value,key){              //设置值
            var _this = this;
            this.input.val(value);
            this.hidden.val(key); 
            this.ul.css('display','none');
            this.callback && this.callback(value,key);

            _this.ready && setTimeout(function (){
                _this.ready = false;
            },300);
        }
    }


    $.fn.Assinput = function (json){
        return this.each(function (i,ele){
            $(this).data('Assinput', new Assinput(ele,json));
        });
    };
})(jQuery);