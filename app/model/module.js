var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/user', { useNewUrlParser: true }, function(){
	console.log('mongodb connected')
});

var Revision = new mongoose.Schema({
    revid: String,
    parentid: String, 
    user: String,
    userid: String,
    timestamp: String,
    usertype: String,
    anon: Boolean,
    size: String,
    sha1: String,
    parsedcomment: String,
    title: String
});


var User = new mongoose.Schema({
	firstname: String,
	lastname: String,
	password: String,
	email: String
})


//register
User.statics.register = function(rfn, rln, rpw, rem, callback){
	return this.aggregate(
	[
		{$group: {_id: "$email", firstname: "firstname", lastname: "lastname", password: "password"}},
		{$sort: {_id: 1}}
	]		
	).exec(callback);
}


//signin 
User.statics.signin = function(em, pw, callback){
	return this.findOne({'email': em, 'password': pw}).exec(callback);
}








////找到修改次数最多的文章
Revision.statics.highestRevision = function (callback) {
    return this.aggregate(
        [
            { $group: { _id: "$title", total: { $sum: 1 } } },
            { $sort: { total: -1 } },
            { $limit: 1}
        ]
    ).exec(callback);
}
//
//
//
//
////找到修改次数最少的文章
Revision.statics.lowestRevision = function (callback) {
    return this.aggregate(
        [
            { $group: { _id: "$title", total: { $sum: 1 } } },
            { $sort: { total: 1 } },
            { $limit: 1}
        ]
    ).exec(callback);
}





//用户更改最高修订数量的文章数量的方法
Revision.statics.changedHighestRevision = function (number, callback) {
    return this.aggregate(
        [
            { $group: { _id: "$title", total: { $sum: 1 } } },
            { $sort: { total: -1 } },
            { $limit: number}
        ]
    ).exec(callback);
}






//用户更改最低修订数量的文章数量的方法
Revision.statics.changedLowestRevision = function (number, callback) {
    return this.aggregate(
        [
            { $group: { _id: "$title", total: { $sum: 1 } } },
            { $sort: { total: 1 } },
            { $limit: number}
        ]
    ).exec(callback);
}
//
//








//该文章由最大的注册用户组编辑
Revision.statics.largestRegistered = function(callback) {
    return this.aggregate(
        [
            { $group: { _id: {uid:'$user', title:'$title'} } },
            { $group: { _id: '$_id.title', total: {$sum:1} } },
            { $sort: { total: -1 } },
            { $limit: 1 }
        ]
     ).exec(callback);
}



//该文章由最小的注册用户组编辑
Revision.statics.smallestRegistered = function (callback) {
    return this.aggregate(
        [
            { $group: { _id: {uid:'$user', title:'$title'} } },
            { $group: { _id: '$_id.title', total: {$sum:1} } },
            { $sort: { total: 1 } },
            { $limit: 1 }
        ]
     ).exec(callback);
}



////历史最长的前2篇文章
Revision.statics.longestHistory = function (callback) {
    return this.aggregate(
        [
            { $group: { _id: "$title", timestamp: { $min: "$timestamp" } } },
            { $sort: { timestamp: 1 } },
            { $limit: 2}
        ]
    ).exec(callback);
}



////历史最短的文章
Revision.statics.shortestHistory = function (callback) {
    return this.aggregate(
            [
                { $group: { _id: "$title", timestamp: { $min: "$timestamp" } } },
                { $sort: { timestamp: -1 } },
                { $limit: 1}
            ]
      ).exec(callback);
}


//overall的图表

//overall-anonymous类型
Revision.statics.anonByYear = function (callback) {
	return this.aggregate(
			[
				{$match: {usertype: "anonymous"}},
				{$group: {_id: "$year", anon: {$sum: 1}}},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
} 





//overall-bot类型
Revision.statics.botByYear = function (callback) {
	return this.aggregate(
			[
				{$match: {usertype: "bot"}},
				{$group: {_id: "$year", bot: {$sum: 1}}},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
} 



Revision.statics.abc = function (callback) {
	return this.aggregate(
			[
				{$group:
				    {
				        _id: "$year",
				     	bot: {
				        	$sum: {$cond: [{$eq: ["$usertype", "bot"]} , 1, 0]}
				     	},
				     	anon: {
				        	$sum: {$cond: [{$eq: ["$usertype", "anonymous"]} , 1, 0]}
				     	},
				     	admin: {
				        	$sum: {$cond: [{$or:
				        	    [
				        	    	{$eq: ["$usertype", "admin_active"]},
				        	    	{$eq: ["$usertype", "admin_former"]},
				        	    	{$eq: ["$usertype", "admin_semi_active"]},
				        	    	{$eq: ["$usertype", "admin_inactive"]}
				        	    ]}
				        	    , 1, 0]}
				     	},
				     	regular: {
				        	$sum: {$cond: [{$eq: ["$usertype", "regular"]} , 1, 0]}
				     	},
				    },
				},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
}



//overall-regular类型
Revision.statics.regularByYear = function (callback) {
	return this.aggregate(
			[
				{$match: {usertype: "regular"}},
				{$group: {_id: "$year", regular: {$sum: 1}}},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
} 





//overall-admin类型(admin_active, admin_former, admin_inactive, admin_semi_active)
Revision.statics.adminByYear = function (callback) {
	return this.aggregate(
			[
				{$match: {$or: [{usertype: "admin_active"},{usertype: "admin_former"},{usertype: "admin_inactive"},{usertype: "admin_semi_active"}]}},
				{$group: {_id: "$year", admin: {$sum: 1}}},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
} 




//文章分析

//得到所有的文章的名字
Revision.statics.findArticleName = function (callback) { 
    		 return this.aggregate(
    			        [
    			            { $group: {_id: "$title" } },
    			            { $sort: {_id: 1 } }
    			        ]
    			    ).exec(callback);
    			}





//根据前端所选的文章题目得到这篇文章的修订总数/////////////
Revision.statics.articleTotalRevisions = function(title, callback){
 return this.aggregate([
  {$match:{title:title}},
  {$group:{_id:"$title", sum:{$sum:1}}}
 ]).exec(callback);
}






//所选的文章要显示（标题，修订总数，排名前5的普通用户按本文的总修订号排序，相应的修订号）
Revision.statics.showArticleSummary = function (articleName, callback) {
    return this.aggregate(
        [
        	{$match: {title: articleName}},
            {$group: {_id: '$user', sum: {$sum: 1}}},
            {$sort: {sum: -1 } },
            {$limit: 5}
        ]
    ).exec(callback);
}





//单用户年度修订版本
Revision.statics.singleUserRevisionDistribution = function(articleName, selectUser, startYear, endYear, callback){
	console.log(selectUser)
	return this.aggregate(
	[
		{$match: {title: articleName, user: selectUser, year: {$gte: startYear, $lte: endYear}}},
        {$group: {_id: '$year', sum: {$sum: 1}}},
        {$sort: {_id: -1 }}
	]
	).exec(callback);
}






//图表
Revision.statics.def = function (articleName, callback) {
	return this.aggregate(
			[
				{$match: {title: articleName}},
				{$group:
				    {
				        _id: "$year",
				     	bot: {
				        	$sum: {$cond: [{$eq: ["$usertype", "bot"]} , 1, 0]}
				     	},
				     	anon: {
				        	$sum: {$cond: [{$eq: ["$usertype", "anonymous"]} , 1, 0]}
				     	},
				     	admin: {
				        	$sum: {$cond: [{$or:
				        	    [
				        	    	{$eq: ["$usertype", "admin_active"]},
				        	    	{$eq: ["$usertype", "admin_former"]},
				        	    	{$eq: ["$usertype", "admin_semi_active"]},
				        	    	{$eq: ["$usertype", "admin_inactive"]}
				        	    ]}
				        	    , 1, 0]}
				     	},
				     	regular: {
				        	$sum: {$cond: [{$eq: ["$usertype", "regular"]} , 1, 0]}
				     	},
				    },
				},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
}





//individual-anonymous类型
Revision.statics.selectedArticleAnonByYear = function (articleName, callback) {
	return this.aggregate(
			[
				{$match: {title: articleName}},
				{$match: {usertype: "anonymous"}},
				{$group: {_id: "$year", sum: {$sum: 1}}},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
} 





//individual-bot类型
Revision.statics.selectedArticleBotByYear = function (articleName, callback) {
	return this.aggregate(
			[
				{$match: {title: articleName}},
				{$match: {usertype: "bot"}},
				{$group: {_id: "$year", sum: {$sum: 1}}},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
} 





//individual-regular类型
Revision.statics.selectedArticleRegularByYear = function (articleName, callback) {
	return this.aggregate(
			[
				{$match: {title: articleName}},
				{$match: {usertype: "regular"}},
				{$group: {_id: "$year", sum: {$sum: 1}}},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
} 





//individual-admin类型(admin_active, admin_former, admin_inactive, admin_semi_active)
Revision.statics.selectedArticleAdminByYear = function (articleName, callback) {
	return this.aggregate(
			[
				{$match: {title: articleName}},
				{$match: {$or: [{usertype: "admin_active"},{usertype: "admin_former"},{usertype: "admin_inactive"},{usertype: "admin_semi_active"}]}},
				{$group: {_id: "$year", sum: {$sum: 1}}},
				{$sort: {_id: 1}}
			]
		).exec(callback);	
} 








//////////////////////////
//得到所有author的名字
Revision.statics.allAuthorNames = function(callback){
return this.aggregate(
 [
  {$group:{_id:"$user"}},
  {$sort:{_id:1}}
 ]
).exec(callback);
}



//作者分析////////
Revision.statics.articlesByAuthor = function(authorName, callback){
return this.aggregate(
[
 {$match:{user:authorName}},
 {$group:{_id:"$title",numOfRevisions:{$sum:1},timestampList:{$push:"$timestamp"}}},
 {$sort:{numOfRevisions:-1}} 
]
).exec(callback);
}












//test
userModel=mongoose.model('users', User,'users')

revisionModel=mongoose.model('revisions', Revision,'revisions')

//test
module.exports.user = userModel;


module.exports.revision = revisionModel;