const template = require('art-template');
template.config('cache', false);

template.helper('getTime', function (t) {
    t = new Date(t);
    return t.getTime();
})

template.helper('formatDateTime', function (t) {
    t = new Date(t);
    var M = t.getMonth() + 1,
        d = t.getDate(),
        h = t.getHours(),
        m = t.getMinutes()

    M = M < 10 ? '0' + M : M
    d = d < 10 ? '0' + d : d
    h = h < 10 ? '0' + h : h
    m = m < 10 ? '0' + m : m

    return t.getFullYear() + '-' + M + '-' + d + ' ' + h + ':' + m
})

template.helper('formatIP', function (ip) {
    if (ip.startsWith('::1')) {
        return '127.0.0.1'
    }
    if (ip.startsWith('::ffff:')) {
        return ip.substr(7)
    }
    return ip;
})
module.exports = template;