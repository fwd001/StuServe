/* 
  db.js只和数据库有关
  专门用于获取数据
*/
var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

var url = "mongodb://localhost:27017";//数据库服务器的地址
const dbName = "gqServe";//数据库的名字
const user = "user"
const list = "userList"

module.exports = {
  // 注册
  register: (payload, callback) => {
    const { username, password } = payload
    MongoClient.connect(url,{ useNewUrlParser: true }, (err, client) => {
      if(err) return console.log("连接数据失败",err);
      var db = client.db(dbName);
      // 插入数据
      db.collection(user).insertOne({
        username,
        password,
      }, function(err, result){
        if(err) return console.log("注册失败");
        if(result.result.ok === 1) {
          callback && callback();
        }
      });

      client.close();
    });
  },
  // 查询用户名
  queryUser: (payload, callback) => {
    const { username } = payload
    MongoClient.connect(url,{ useNewUrlParser: true }, (err, client) => {
      if(err) return console.log("连接数据失败",err);
      var db = client.db(dbName);
      // 插入数据
      db.collection(user).findOne({username}, function(err, result){
        if(err) {
          console.log("查询user数据库库失败",err);
        }
        callback(result);
      });


      client.close();
    });
  },
  // 登录
  login: (payload, callback) => {
    const { username, password } = payload
    MongoClient.connect(url,{ useNewUrlParser: true }, (err, client) => {
      if(err) return console.log("连接数据失败",err);
      var db = client.db(dbName);
      // 插入数据
      db.collection(user).findOne({username, password}, function(err, result){
        if(err) return console.log("查询user数据库库失败",err);
        callback(result)
      });
      // 关闭连接数据库
      client.close()
    });
  },
  // 新增学生信息
  queryStu: (payload, callback) => {
    const { id } = payload
    MongoClient.connect(url,{ useNewUrlParser: true }, (err, client) => {
      if(err) return console.log("连接数据失败",err);
      var db = client.db(dbName);
      // 插入数据
      db.collection(list).findOne({id}, (err, result) =>{
        if(err) return console.log("查询list数据库库失败",err)
        callback(result);
      });
      // 关闭连接数据库
      client.close();
    });
  },
  // 新增学生信息
  add: (payload, callback) => {
    const { name, age, chinese, english, mathematics, id } = payload
    MongoClient.connect(url,{ useNewUrlParser: true }, (err, client) => {
      if(err) return console.log("连接数据失败",err);
      var db = client.db(dbName);
      // 插入数据
      db.collection(list).insertOne({name, age, chinese, english, mathematics, id}, (err, result) =>{
        if(err) return console.log("查询list数据库库失败",err)
        callback(result);
      });
      // 关闭连接数据库
      client.close();
    });
  },
  get: (payload, callback) => {
    const query = {}
    for(let key in payload) {
      if(payload[key] && key !== 'page' && key !== 'pageSize'){
        query[key] = payload[key]
      }
    }
    MongoClient.connect(url,{ useNewUrlParser: true }, (err, client) => {
      if(err) return console.log("连接数据失败",err);
      var db = client.db(dbName);
      // 查找数据
      db.collection(list).find().toArray((err, result) =>{
        if(err) return console.log("查询list数据库库失败",err)
        callback(result);
      })
      // 关闭连接数据库
      client.close();
    });
  },
}
