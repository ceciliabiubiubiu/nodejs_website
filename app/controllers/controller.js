var mongoose = require('../model/module');

var Revision = mongoose.revision;
var User = mongoose.user;


var fs = require('fs');
var path = require('path');






module.exports.showLandingPage=function(req,res){
	res.render("main.ejs");
}







//register
module.exports.register = function(req, res){
	var rfn= req.body.rfn;
	var rln= req.body.rln;
	var rpw= req.body.rpw;
	var rem= req.body.rem;
	var newuser = new User({
		firstname: rfn,
		lastname: rln,
		password: rpw,
		email: rem
	})
	console.log(req.body);
	newuser.save(function(error){
		if(error){
			console.log(error)
			res.send("fail")
		}else{
			res.send("success")
		}
	})
}





//这边的signin
module.exports.signin = function(req, res){
	var em = req.body.em;
	var pw = req.body.pw;
	var callback = function(error, result) {
		if(error){
			console.log(error)
			res.send("fail")
		}else{
			res.send(result)
		}
	}
	User.signin(em, pw, callback);
}








////找到修改次数最多的文章
module.exports.highestRevision = function (req, res) {
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.highestRevision(callback);
}


////找到修改次数最少的文章
module.exports.lowestRevision = function (req, res) {
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.lowestRevision(callback);
}









//该文章由最大的注册用户组编辑
module.exports.largestRegistered = function (req, res) {
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.largestRegistered(callback);
}




//该文章由最小的注册用户组编辑
module.exports.smallestRegistered = function (req, res) {
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.smallestRegistered(callback);
}




//用户更改最高修订数量的文章数量的方法
module.exports.changedHighestRevision = function (req, res) {
	var number = parseInt(req.body.hr);
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.changedHighestRevision(number, callback);
}






//用户更改最低修订数量的文章数量的方法
module.exports.changedLowestRevision = function (req, res) {
	var number = parseInt(req.body.hr);
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.changedLowestRevision(number, callback);
}






////历史最长的前2篇文章
module.exports.longestHistory = function (req, res) {
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.longestHistory(callback);
}



////历史最短的文章
module.exports.shortestHistory = function (req, res) {
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.shortestHistory(callback);
}






module.exports.abc = function (req, res) {
	Revision.abc(function(error, result) {
		console.log(result);
		res.send(result);
	});
}






//文章分析
//找到一篇文章
module.exports.findArticleName = function (req, res) {
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.findArticleName(callback);
}






//根据前端所选的文章题目得到这篇文章的修订总数
module.exports.articleTotalRevisions = function(req, res){
 var title = req.body.artnm;
 var callback = function(error, result){
  if(error){
   console.log(error)
  }else{
   res.send(result)
  }
 }
 Revision.articleTotalRevisions(title, callback);
}








//显示这篇文章的具体信息
module.exports.showArticleSummary = function (req, res) {
	var articleName = req.body.artnm;
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			res.send(result)
		}
	}
	Revision.showArticleSummary(articleName, callback);
}





//选定特定数量的user，以及年份，显示的图表是不同列的user的bar chart
module.exports.singleUserRevisionDistribution = function(req, res){
	var selectUser = req.body.user;
	var articleName = req.body.artnm;
	var startYear = req.body.startYear;
	var endYear= req.body.endYear;
	console.log(req.body)
	var callback = function(error, result) {
		if(error){
			console.log(error)
		}else{
			console.log(result)
			res.send(result)
		}
	}
	Revision.singleUserRevisionDistribution(articleName, selectUser, startYear, endYear, callback);
}








//图表
module.exports.def = function (req, res) {
	var articleName = req.body.artnm;
	Revision.def(articleName, function(error, result) {
		console.log(result);
		res.send(result);
	});
}






//得到所有author的名字
module.exports.allAuthorNames = function(req, res){
 Revision.allAuthorNames(function(error, result){
  if(error){
   console.log(error)
  }
  else{
   res.send(result)
  }
 })
}




//作者分析 某作者的所有article
module.exports.articlesByAuthor = function(req, res){
 var authorName = req.body.authorName
 Revision.articlesByAuthor(authorName, function(error, result){
  if(error){
   console.log(error)
  }else{
   res.send(result)
  }
 })
}




