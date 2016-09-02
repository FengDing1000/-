const exp = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    fs = require('fs'),
    uploads = require('./upload'),
    template = require('./template'),
    tools = require('./tools')
    app = exp();
    console.log(uploads)
//设置express视图引擎        
app.engine('.html', template.__express);
app.set('view engine', 'html');

app.use(exp.static('www'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

/*--------------------注册--------------------*/
app.get('/user/register', (req, res) => {
    res.render('register')
})

app.post('/user/register', (req, res) => {
    req.body.ip = req.ip
    req.body.time = new Date()

    function saveFile() {
        var fileName = `users/${req.body.petname}.txt`

        fs.exists(fileName, exists => {
            if (exists) {
                tools.send(res, 'registered', '用户名已经注册过了！')
            }
            else {
                fs.appendFile(fileName, JSON.stringify(req.body), err => {
                    if (err) {
                        tools.send(res, 'file error', '抱歉，系统错误...')
                    }
                    else {
                        tools.send(res, 'success', '恭喜，注册成功！请登录...')
                    }
                })
            }
        })
    }

    fs.exists('users', exists => {
        if (exists) {
            saveFile()
        }
        else {
            fs.mkdir('users', err => {
                if (err) {
                    tools.send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    saveFile()
                }
            })
        }
    })
})

/*--------------------登录--------------------*/
// user不存在 这是虚拟路径 服务器会拦截请求 临时生成一个路径  这个路径是中途生成的
app.get('/user/signin', (req, res) => {
    res.render('signin')
})
app.post('/user/signin', (req, res) => {
    var fileName = `users/${req.body.petname}.txt`

    fs.exists(fileName, exists => {
        if (exists) {
            fs.readFile(fileName, (err, data) => {
                if (err) {
                    tools.send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    var user = JSON.parse(data)
                    if (user.password == req.body.password) {

                        res.cookie('petname', req.body.petname)
                        // 此处需要加密

                        tools.send(res, 'success', '登录成功...')
                    }
                    else {
                        tools.send(res, 'signin error', '用户名或密码错误！')
                    }
                }
            })
        }
        else {
            tools.send(res, 'register error', '用户名未注册！')
        }
    })
})

/*--------------------退出--------------------*/

app.post('/user/signout', (req, res) => {
    res.clearCookie('petname')
    res.status(200).json({ code: 'success' })
})

/*--------------------提问--------------------*/
//请求过来时先交给tools.sign处理 如果调用了next()则执行后面的函数
app.get('/ask', tools.sign, (req, res) => {
    res.render('ask', { user: req.cookies.petname });
})

app.post('/ask', tools.sign, (req, res) => {
    var petname = req.cookies.petname

    if (!petname) {
        tools.send(res, 'signin error', '请重新登录...')
        return
    }

    var time = new Date()

    req.body.petname = petname
    req.body.ip = req.ip
    req.body.time = time

    function saveFile() {
        var fileName = `questions/${time.getTime()}.txt`

        fs.appendFile(fileName, JSON.stringify(req.body), err => {
            if (err) {
                tools.send(res, 'file error', '抱歉，系统错误...')
            }
            else {
                tools.send(res, 'success', '问题提交成功！')
            }
        })
    }

    fs.exists('questions', exists => {
        if (exists) {
            saveFile()
        }
        else {
            fs.mkdir('questions', err => {
                if (err) {
                    tools.send(res, 'file error', '抱歉，系统错误...')
                }
                else {
                    saveFile()
                }
            })
        }
    })
})

/*--------------------头像--------------------*/
app.get('/user/profile', tools.sign, (req, res) => {
    res.render('profile')
})

app.post('/user/photo', tools.sign, uploads.single('photo'), (req, res) => {
    res.status(200).json({ code: 'success', message: '上传成功' })
})

/*--------------------首页--------------------*/
// '/'表示首页
app.get('/', (req, res) => {

    function readFiles(i, files, questions, complete) {
        if (i < files.length) {
            fs.readFile(`questions/${files[i]}`, (err, data) => {
                // console.log(data + '');

                if (!err) {
                    var data = JSON.parse(data);
                    // console.log('data=',data)  
                    // console.log('data1=',data.answers)                  
                    // data.answers.reverse();
                    // console.log('data=',data)
                    questions.push(data)

                }
                readFiles(++i, files, questions, complete)
            })
        }
        else {
            complete()
        }
    }

    // filesysterm
    fs.readdir('questions', (err, files) => {
        // console.log(files);

        if (err) {
            console.error('读取questions文件夹错误', err);
        }
        else {
            // files 是一个数组 其数值是文件夹的名字及后缀
            files = files.reverse()

            var questions = []
            // 读取文件数组的所有文件
            readFiles(0, files, questions, function () {
                res.render('index', {
                    user: req.cookies.petname,
                    data: questions
                });//data:[]
            })
        }
    })
})

/*--------------------回答--------------------*/
app.get('/answer', tools.sign, (req, res) => {
    // console.log('answer=', req.cookies.question)
    var filename = `questions/${ req.cookies.question}.txt`
    fs.readFile(filename, (err, data) => {
        if (err) {
            console.error('读取文件错误'.err)
        }
        else {
            var questions = JSON.parse(data)
            console.log('data=', questions)
            res.render('answer', {
                user: req.cookies.petname,
                questions: questions
            });
        }
    })
})

app.post('/answer', tools.sign, (req, res) => {
    var petname = req.cookies.petname
    console.log('post=', req.body, req.body.question)
    var filename = `questions/${req.body.question}.txt`

    req.body.petname = petname
    req.body.ip = req.ip
    req.body.time = new Date()

    fs.readFile(filename, (err, data) => {
        if (err) {
            console.error('读取文件错误'.err)
        }
        else {
            var question = JSON.parse(data)
            if (!question.answers) question.answers = [];
            question.answers.push(req.body)

            fs.writeFile(filename, JSON.stringify(question), err => {
                if (err) {
                    console.error('保存文件错误'.err)
                }
                else {
                    res.status(200).json({ code: 'success', message: '提交回答成功' })
                }
            })
        }
    })
})

/*--------------------监听--------------------*/

app.listen(3000, () => console.log('正在运行...'))