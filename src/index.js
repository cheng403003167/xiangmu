const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');
const mysqlData = require('./mysqlData.js');
const path = require('path');
const data = new mysqlData();
const app = new Koa();
const router = new Router();
router.get('/users',async (ctx)=>{
  await data.conn();

  ctx.body = await data.searchName();
})
router.get('/month/:month',async (ctx)=>{
  var datas = {};
  await data.conn();
  datas.originData =  await data.searchImgMonth(ctx.params.month);
  datas.day = {};
  datas.originData.forEach(function(item){
    let dates = new Date(item.update);
    day = dates.getDate();
    if(datas.day[day]){
      datas.day[day]++;
    }else{
      datas.day[day] = 1;
    }
  })
  ctx.body = datas;
})
router.get('/day/:month/:day',async (ctx)=>{
  var datas = {},userNameTempData = [],userTempFlag = false;
  await data.conn();
  datas.originData =  await data.searchImgDay(ctx.params.month,ctx.params.day);
  datas.type = {};
  datas.userTotal = 0;
  for(let s = 0;s<datas.originData.length;s++){
    userTempFlag = false;
    if(datas.type[path.extname(datas.originData[s].imgName).slice(1)]){
      datas.type[path.extname(datas.originData[s].imgName).slice(1)]++;
    }else{
      datas.type[path.extname(datas.originData[s].imgName).slice(1)] = 1;
    }
    for(let userI = 0;userI < userNameTempData.length;userI++){
      if(datas.originData[s].userId == userNameTempData[userI].userId){
        datas.originData[s]['userName'] = userNameTempData[userI].userName;
        userTempFlag = true;
        break;
      }
    }
    if(!userTempFlag){
      datas.userTotal++;
      datas.originData[s]['userName'] = await data.searchName(datas.originData[s].userId);
      userNameTempData.push({
        userId: datas.originData[s].userId,
        userName: datas.originData[s]['userName']
      })
    }
  }
  ctx.body = datas;
})
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000,()=>{
  console.log('启动在 localhost:3000');
  process.send('ready');
})