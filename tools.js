
//请求外部定义的函数都是同用的相当于全局变量
exports.sign = function (req, res, next) {//这三个参数来自于调用者 （express） 这是固定好的
    if (!req.cookies.petname) {
        // 判断当前请求是否为ajax请求
        if (req.xhr) {
            // 如果是ajax请求则向浏览器端返回一个json数据 否则是指定向
            exports.send(res, 'not signin', '登录超时，请重新登录...')
        } else {
            // redirect 要求浏览器跳转到后面指定的地址
            // exports.send(res, 'not signin', '请重新登录...')
            res.redirect('/user/signin');
        }
    }
    else {
        next();//交给下一步
    }
}

exports.send = function (res, code, message, data) {
    if (data) {
        res.status(200).json({ code, message, data });
    } else {
        res.status(200).json({ code, message });
    }
}

// module.exports = {sign,send}
// exports.sign = sign;
// exports.send = send;