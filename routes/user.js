// 处理与提问有关的请求
const exp = require('express'),
    fs = require('fs'),
    uploads = require('../upload'),
    tools = require('../tools');
// 创建一个路由
const router = exp.Router();
/*--------------------注册--------------------*/
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
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
router.get('/signin', (req, res) => {
    res.render('signin')
})
router.post('/signin', (req, res) => {
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

/*--------------------头像--------------------*/
router.get('/profile', tools.sign, (req, res) => {
    res.render('profile')
})

router.post('/photo', tools.sign, uploads.single('photo'), (req, res) => {
    res.status(200).json({ code: 'success', message: '上传成功' })
})
/*--------------------退出--------------------*/
router.post('/signout', (req, res) => {
    res.clearCookie('petname')
    res.status(200).json({ code: 'success' })
})
module.exports = router;