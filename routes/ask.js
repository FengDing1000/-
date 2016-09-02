// 处理与提问有关的请求
const exp = require('express'),
    fs = require('fs'),
    tools = require('../tools');
// 创建一个路由
const router = exp.Router();

/*--------------------提问--------------------*/
//请求过来时先交给tools.sign处理 如果调用了next()则执行后面的函数
router.get('/ask', tools.sign, (req, res) => {
    res.render('ask', { user: req.cookies.petname });
})

router.post('/ask', tools.sign, (req, res) => {
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

module.exports = router;
