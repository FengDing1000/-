// 处理与提问有关的请求
const exp = require('express'),
    fs = require('fs'),
    tools = require('../tools');
// 创建一个路由
const router = exp.Router();
/*--------------------回答--------------------*/
router.get('/answer', tools.sign, (req, res) => {
    // console.log('answer=', req.cookies.question)
    var filename = `questions/${req.cookies.question}.txt`
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

router.post('/answer', tools.sign, (req, res) => {
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
module.exports = router;