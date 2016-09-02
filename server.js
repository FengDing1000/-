const exp = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    template = require('./template'),
    app = exp();
    //设置express视图引擎        
    app.engine('.html', template.__express);
    app.set('view engine', 'html');

    app.use(exp.static('www'))
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cookieParser())
    /*----------登录 注册 上传文件 退出登录---------*/
    app.use('/user',require('./routes/user'))
    /*--------------------提问---------------------*/
    app.use(require('./routes/ask'))

    /*--------------------首页--------------------*/
    app.use(require('./routes/index'))
    /*--------------------回答--------------------*/
    app.use(require('./routes/answer'))
    /*--------------------监听--------------------*/

    app.listen(3000, () => console.log('正在运行...'))