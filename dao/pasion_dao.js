var mongoose = require('mongoose');
var dburl = 'mongodb://127.0.0.1:27017/pasion';
var db = null;
//建立数据库连接
function connect(){
    //连接
    mongoose.connect(dburl);
    //获取连接对象
    db = mongoose.connection;
    //注册事件回调
    db.on('open', function(err){
        if(err){
            throw err;
        }
        console.log('opened');
    });
    //注册时间回调
    db.on('error', function(err){
        if(err){
            throw err;
        }
    });
}
exports.connect = connect;
//断开数据库连接
function disconnect(){
    //断开连接
    mongoose.disconnect();
    db = null;
}
exports.disconnect = disconnect;

var Schema = mongoose.Schema;
//建立用户信息表
var userInfoSchema = new Schema({
    userName: String,
    password: String,
    level: {type: Number, default: 1},//默认为1级
    avatar: String,
    avatarFileName: String,
    nickname: String,
    city: String,
    gender: {type: Number, default: 0}, //0:秘密 1:男 2:女
    aboutme: String
});
var userInfoModel = mongoose.model('userInfo',userInfoSchema);

/*用户注册成功 向数据库中添加用户信息*/
function addUser(userName,password,cb){

    var userInfo = {
        userName: userName,
        password: password,
        level: 1
    };
    var userTemp = new userInfoModel(userInfo);
    userTemp.save(function(err){
        if(err){
            cb(err);
        }
        else{
            return cb(null,null);
        }
    });
}
exports.addUser = addUser;

/*查找用户名是否存在*/
function findUserByName(userName, cb){
    userInfoModel.find({userName: userName}, function(err, result){
        if(err){
            cb(err);
        }else {
            var user = null;
            switch (result.length) {
                case 0:
                    user = null;
                    break;
                case 1:
                    user = result[0];
                    break;
                default:
                    user = result[0];
                    console.error('too many users were found');
            }
            cb(null, user);
        }
    })
}
exports.findUserByName = findUserByName;

//通过id查找用户
var findUserById = function(id, cb){
    userInfoModel.findOne({_id: id}, function(err, user){
        if (err) {
            cb(err);
        }
        else{
            cb(null, user);
        }
    });
};

//上传头像信息
var uploadAvatar = function (_id, avatarFileName, cb){
    findUserById(_id, function(err, user){
        if(err){
            return cb(err);
        }else {
            user.avatar = 'uploaded';
            user.avatarFileName = user.userName;
            user.save(function(err, userNew){
                if(err){
                    return cb(err);
                }else {
                    console.warn('avatar saved');
                    console.warn(userNew);
                    return cb(null, userNew);
                }
            });
        }
    });
};
exports.uploadAvatar = uploadAvatar;

//上传个人信息
var uploadProfile = function (_id, nickname, city, gender, aboutme, cb){
    findUserById(_id, function(err, user){
        if(err){
            return cb(err);
        }else {
            user.nickname = nickname;
            user.city = city;
            user.gender = gender;
            user.aboutme = aboutme;
            console.log('user:'+user);
            user.save(function(err, userNew){
                if(err){
                    return cb(err);
                }else {
                    console.warn('profile saved');
                    console.warn(userNew);
                    return cb(null, userNew);
                }
            });
        }
    });
};
exports.uploadProfile = uploadProfile;
//建立音乐库
var musicListSchema = new Schema({
    musicName: String,
    singer: String
});
var musicListModel = mongoose.model('music_list',musicListSchema);

/*var AddMusic = new musicListModel({
    musicName: 'リンゴ日和 ～The Wolf Whistling Sond (苹果的日常～The Wolf Whistling Sond)',
    singer: 'Rocky Chack'
});

AddMusic.save(function (err, brow) {
    if (err) {
        return console.error(err);
    }
    console.log('-------    brow    -----------');
    console.log(brow);
});*/



function findMusicList(cb){
    musicListModel.find(function(err, result){
        if(err){
            cb(err);
        }else {
            cb(null, result);
            console.log(result);
        }
    })
}
exports.findMusicList = findMusicList;