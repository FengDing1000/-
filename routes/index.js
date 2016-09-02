// 处理与提问有关的请求
const exp = require('express'),
    fs = require('fs');
// 创建一个路由
const router = exp.Router();
/*--------------------首页--------------------*/
// '/'表示首页
router.get('/', (req, res) => {

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
module.exports = router;