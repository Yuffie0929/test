var router = require('express').Router();
var business_logic = require('../module/logic.js');

//引入上传文件中间件
var multer = require('multer');

/*主页*/
router.get('/', function(req, res, next){
    business_logic.indexGet(req, res);
});

/*登录*/
router.get('/login', checkIsLogined);
router.get('/login', function(req, res, next){
    business_logic.loginGet(req, res);
});
router.post('/login', function(req, res, next){
    business_logic.loginPost(req, res);
});

/*注册*/
router.get('/register', checkIsLogined);
router.get('/register', function(req, res, next){
    business_logic.registerGet(req, res);
});
router.post('/register', function(req, res, next){
    business_logic.registerPost(req, res);
});

//登出
router.get('/logout', function(req, res, next){
    business_logic.logout(req, res);
});

//用户信息
router.get('/setUserInfo',checkIsNotLogined);
router.get('/setUserInfo', business_logic.setUserInfoGet);


//处理个人首页
router.get('/user_index/:userName',checkIsNotLogined);
router.get('/user_index/:userName',function(req, res, next){
    business_logic.userIndexPage(req, res);
});

function checkIsLogined(req, res, next) {
    if (req.session.userInfo) {
        console.log('req.session.userInfo 存在');
        res.render('page.ejs', {uInfo: ''});
    } else {
        console.log('req.session.userInfo 不存在');
        next();
    }
}
//如果 req.session.userInfo 存在，说明用户已经登录过了
function checkIsNotLogined(req, res, next){
    if(!req.session.userInfo){
        console.log('req.session.userInfo 不存在');
        res.render('page.ejs',{ uInfo : ''});
    }else {
        console.log('req.session.userInfo 存在');
        next();
    }
}

var AVATAR_PATH = '../public/avatars/';
var storage = multer.diskStorage({
    destination: AVATAR_PATH,
    filename: function (req, file, cb) {
        var fileName = req.session.userInfo.userName;
        cb(null, fileName);
    }
});

var uploadObj = multer({ storage: storage });
router.post('/setAvatar',
    uploadObj.single('avatar'),
    business_logic.uploadAvatarPost
);

router.post('/setProfile', business_logic.setProfilePost);

//404
router.all('*', function(req, res, next){
    res.redirect('/404.html');
});

module.exports = router;
