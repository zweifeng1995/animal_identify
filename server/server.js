'use strict';
var express=require('express');
var app =express();
var bodyParser = require('body-parser');
var mysqlx = require('@mysql/xdevapi');

var options = {
  host: 'localhost',
  port: 33060,
  password: 'zwf123666',
  user: 'root'
};

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//设置跨域访问
app.all('*', function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    response.header("X-Powered-By",' 3.2.1');
    response.header("Content-Type", "application/json;charset=utf-8");
    next();
 });
 
	
//写个接口
app.get('/api/v1/getKnowledge',function(request, response){
	var Obj = [];
	mysqlx.getSession(options)
	.then(function(session){
		var table = session.getSchema('animal_identify').getTable('animal_identify');
		table.select('maofa','chanru','yumao','feixing','shengdan',
		'chirou','zhuazi','lichi','qianshi','youti',
		'fanchu','huanghese','heisetiaowen','shensebandian','changtui',
		'changjing','baise','heibaixiangza','heisehebaise','youshui',
		'burudongwu','niaoleidongwu','shiroudongwu','youtidongwu','liebao',
		'laohu','changjinglu','banma','tuoniao','qie',
		'haiyan'
		)
		.execute((row) => {
			var temp = {
				"maofa": row[0],
				"chanru": row[1],
				"yumao": row[2],
				"feixing": row[3],
				"shengdan": row[4],
				"chirou": row[5],
				"zhuazi": row[6],
				"lichi": row[7],
				"qianshi": row[8],
				"youti": row[9],
				"fanchu": row[10],
				"huanghese": row[11],
				"heisetiaowen": row[12],
				"shensebandian": row[13],
				"changtui": row[14],
				"changjing": row[15],
				"baise": row[16],
				"heibaixiangza": row[17],
				"heisehebaise": row[18],
				"youshui": row[19],
				"burudongwu": row[20],
				"niaoleidongwu": row[21],
				"shiroudongwu": row[22],
				"youtidongwu": row[23],
				"liebao": row[24],
				"laohu": row[25],
				"changjinglu": row[26],
				"banma": row[27],
				"tuoniao": row[28],
				"qie": row[29],
				"haiyan": row[30],
			};
			Obj.push(temp);
		})
		.then(function(){
			response.status(200),
			response.json(Obj);
		}.bind(response));
	}.bind(response));
	
});

/*
app.post('/abc',function(request,response){
    console.log(request.stack);
    console.log(request.body);
    console.log(request.url);
    console.log(request.query);
    response.json(request.body)
})
*/

//配置服务端口
var server = app.listen(8888, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
})