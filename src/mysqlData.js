const mysql = require('mysql');

module.exports = class searchData {
  constructor(){
    this.config = {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'jiandanimg'
    }
  }
  async conn(){
    this.connection = await mysql.createConnection(this.config);
  }
  async searchName(){
    let userData = await new Promise((resolve,reject)=>{
      this.connection.query("SELECT * FROM user",(err,result)=>{
        if(err){
          console.log(err);
          reject()
          return;
        }
        resolve(result)
        return result;
      })
    });
    userData.forEach(function(item,index,data){
      var val="";
      var arr = item.userName.split(",");
      for(var i = 0; i < arr.length; i++){
        val += String.fromCharCode(parseInt(arr[i],16));
      }
      data[index].userName = val;
    });
    return userData;
  }
  async searchImgMonth(year,month){
    let searcText = "SELECT `update` FROM imgdata WHERE `update` LIKE '"+year+"-"+month+"%' ORDER BY `update`";
    return await new Promise((resolve,reject)=>{
      this.connection.query(searcText,(err,result)=>{
        if(err){
          console.log(err);
          reject()
          return;
        }
        resolve(result)
        return result;
      })
    });
  }
  async searchImgDay(year,month,day){
    let searcText = "SELECT * FROM imgdata WHERE `update` LIKE '"+year+"-"+month+'-'+day+"%' ORDER BY `update`";
    return await new Promise((resolve,reject)=>{
      this.connection.query(searcText,(err,result)=>{
        if(err){
          console.log(err);
          reject()
          return;
        }
        resolve(result)
        return result;
      })
    });
  }
  async searchNameId(id){
    let searcText = "SELECT `userName` FROM user WHERE `id` = "+id+"";
    return await new Promise((resolve,reject)=>{
      this.connection.query(searcText,(err,result)=>{
        if(err){
          console.log(err);
          reject()
          return;
        }
        var val="";
        result.forEach(function(item,index,data){
          var arr = item.userName.split(",");
          for(var i = 0; i < arr.length; i++){
            val += String.fromCharCode(parseInt(arr[i],16));
          }
          data[index].userName = val;
        });
        resolve(val)
        return val;
      })
    });
  }
  async userChart(){
    let searchText = "SELECT `userId`,COUNT(`userId`) as number FROM imgdata GROUP BY `userId` ORDER BY `number` DESC";
    return await new Promise((resolve,reject)=>{
      this.connection.query(searchText,(err,result)=>{
        if(err){
          console.log(err);
          reject()
          return;
        }
        resolve(result)
        return result;
      })
    });
  }
  async getOneUserInfoBYID(id){
    let searcText = "SELECT * FROM imgdata WHERE `userId` = "+id+" ORDER BY `update` DESC";
    return await new Promise((resolve,reject)=>{
      this.connection.query(searcText,(err,result)=>{
        if(err){
          console.log(err);
          reject();
        }
        resolve(result);
        return result;
      })
    })
  }
}