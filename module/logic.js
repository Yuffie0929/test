var crypto = require('crypto');

var dao = require('../dao/pasion_dao.js');

function indexGet(req, res, next){
    dao.findMusicList(function(err, musicList){
        checkIsLogined(req, res, next);
//若 req.session.userInfo 存在，说明用户已经登录过了
        function checkIsLogined(req, res, next){
            if(req.session.userInfo){
                console.log('req.session.userInfo 存在');
                res.render('page.ejs',{ uInfo : req.session.userInfo, musicList: musicList});
            }else {
                console.log('req.session.userInfo 不存在');
                res.render('page.ejs',{ uInfo : '', musicList: musicList});
            }
        }
    });
}
exports.indexGet = indexGet;

//登录
function loginGet(req, res, next){
    res.render('login.ejs');
}
exports.loginGet = loginGet;

function loginPost(req, res, next){
    var userName = req.body.userName;
    var password = req.body.password;
    console.log(userName, password);

    if(!userName || !password){
        res.writeHead(200, {'content-type':'text/plain;charset=utf8'});
        res.end('用户名密码不能为空');
        return;
    }
    dao.findUserByName(userName, function(err, userInfo){
        if(err){
            next(err);
        }else {
            if(userInfo){
                var md5 = crypto.createHash('md5');
                md5.update(password);
                var passwordMD5 = md5.digest('hex');
                if(userInfo.password == passwordMD5){
                    req.session.userInfo = userInfo;
                    console.log('userInfo '+userInfo);
                    res.redirect('/');
                }else {
                    res.writeHead(200, {'content-type':'text/plain;charset=utf8'});
                    res.end('请输入正确的密码');
                }
            }else {
                res.writeHead(200, {'content-type':'text/plain;charset=utf8'});
                res.end('用户名不存在请重新登录');
            }
        }
    });
}
exports.loginPost = loginPost;


//注册
function registerGet(req, res, next){
    res.render('register.ejs');
}
exports.registerGet = registerGet;

function registerPost(req, res, next){

    var userName = req.body.userName;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    console.log(userName, password);

    if(!userName || !password || !confirmPassword){
        res.writeHead(200, {'content-type':'text/plain;charset=utf8'});
        res.end('用户名、密码、确认密码，不能为空');
        return;
    }
    dao.findUserByName(userName, function(err, userInfo){
        if(err){
            next(err);
        }else {
            if(userInfo){
                res.writeHead(200, {'content-type':'text/plain;charset=utf8'});
                res.end('用户名已经存在，请重新注册');
            }else{
                if(password != confirmPassword){
                    res.writeHeader(200, {'Content-type': 'text/html;charset=utf-8'});
                    res.end('两次密码不一致，请重新注册');
                }else {
                    var md5 = crypto.createHash('md5');
                    md5.update(password);
                    var passwordMD5 = md5.digest('Hex');

                    dao.addUser(userName, passwordMD5, function(err){
                        dao.findUserByName(userName, function(err,userInfo){
                            if(err){
                                next(err);
                            }else {
                                req.session.userInfo = userInfo;
                                console.log('userInfo '+userInfo);
                                res.redirect('/');
                            }
                        });
                    });
                }
            }
        }
    });
}
exports.registerPost = registerPost;

//登出
function logout(req, res, next){
    req.session.userInfo = null;
    res.redirect('/');
}
exports.logout = logout;


function userIndexPage(req, res){
    var userName = req.params.userName;
    //var userName = req.session.userInfo.userName;

    console.log('userIndexPage' + userName);
    if('wukong' === userName){
        //显示 全部信息
        dao.getJobsInfo_all(showPages);
    }else{
        //显示 部分信息
        dao.getJobsInfo_partial(showPages);
    }
    function showPages(err, data){
        if(err){
            console.error(err);
        }else {
            var obj = {
                jobs : data
            };
            res.render('jobs.ejs', obj);
        }
    }
}
exports.userIndexPage = userIndexPage;

//获取用户信息修改页面
function setUserInfoGet(req, res, next){
    res.render('change_userInfo.ejs',{ uInfo: req.session.userInfo});
}
exports.setUserInfoGet = setUserInfoGet;

//上传头像post
var uploadAvatarPost = function(req, res, next) {
    //修改数据库
    var _id = req.session.userInfo._id;
    var avatarFileName = req.session.userInfo.userName;
    dao.uploadAvatar(_id, avatarFileName, function(err, userInfo){
        if(err){
            next(err);
        }
        else{
            req.session.userInfo = userInfo;
            res.render('change_userInfo.ejs',{ uInfo: req.session.userInfo});
        }
    });
};
exports.uploadAvatarPost = uploadAvatarPost;

//上传个人信息post
var setProfilePost = function(req, res, next) {
    //修改数据库
    var _id = req.session.userInfo._id;
    console.log('_id'+_id);
    var nickname = req.body.nickname;
    var city = req.body.city;
    var gender = req.body.gender;
    var aboutme = req.body.aboutme;
    dao.uploadProfile(_id, nickname, city, gender, aboutme, function(err, userInfo){
        if(err){
            next(err);
        }
        else{
            req.session.userInfo = userInfo;
            res.redirect('/');
/*            res.render('page.ejs',{ uInfo: req.session.userInfo});*/
        }
    });
};
exports.setProfilePost = setProfilePost;
