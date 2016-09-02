const multer = require('multer');
//multer磁盘的保存位置 所有上传的文件都保存在这个文件中
const storage = multer.diskStorage({
    destination: 'www/uploads',
    filename: function (req, file, callback) {
        var petname = req.cookies.petname
        callback(null, `${petname}.jpg`)
    }
})
module.exports = multer({ storage })