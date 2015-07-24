/*
*assinput:联想输入
*by:　   zhe-he
*e-mail:    hezhe@jiaju.com
*人有多懒，思想就有多远
*version: 1.0
*last-time:2015-7-22
*

    完整模式:
    $(ele).Assinput({
        ul:  '',                //选填
        hidden: '',            //选填
        input: '',              //选填
        data:   '',             //必填
        keyword:    '',         //当data为字符串时,必填
        ajax:       {},         //当data为字符串时,必填
        format:    '',          //选填
        para:       {},         //选填
        callback:   function (){}   //选填
    })

    懒人模式:
    $(ele).Assinput({data: '数据'});
*
*参数说明：

*json.ul:   联想菜单的ul,默认选择第一个ul,你也可以传入参数指定(.class or #id or tagName)

*json.hidden: 选中的值隐藏域,默认选择第一个input[type=hidden],你也可以传入参数指定 

*json.input: 输入框,默认选择第一个input[type=text],你也可以传入参数指定

*json.data:

*           联想的数据, 
*           如果数据是请求接口, 
*           json.data是字符串(返回数据的参数名,如json.data='data',如果返回的数据是多级,json.data='data.第一级.第二级')
*           {msg:'请求成功',data:[所需数据]}     --> json.data = 'data'
*           {msg:'请求成功',data:{data:[所需数据]}}  --> json.data = 'data.data'
*           {msg:'请求成功',data:[{},{data:{data:{所需数据}}},{}]} --> json.data = 'data.1.data.data'
           
          
*json.ajax: 仅在json.data为字符串时生效,参数同jQuery.ajax,只是没有success回调函数(success会被本插件覆盖)

*json.keyword:  接口传入的keyword参数名,仅当this.data 为字符串时生效

*json.format： 处理数据的难易程度,程序自动追加,如需手动处理请自行设置 easy,normal,hard

*json.para:     自定义参数名,仅当 this.format=hard生效,程序自动追加,

*               如需手动处理请自行设置 
                this.para = {
                    key:    '参数名1',
                    value:  '参数名2'
                }

*json.callback: 选中值后的回调函数
*/