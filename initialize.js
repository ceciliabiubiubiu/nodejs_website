var schema;
var fs;

var Revision;

var folder;

var fileNames;
var types;

var pages;

var ct1;
var ct2;
var ct3;
var index;


module.exports.init = function() {
	schema = require('./app/model/module');
	fs = require("fs");
	Revision = schema.revision;
	folder = '/Users/luoshanshan/Desktop/5347web/group_ass/Dataset_25_March_2019/';
	fileNames = ["admin_active", "admin_former", "admin_inactive", "admin_semi_active", "bot"];
	types = []
	pages = fs.readdirSync('/Users/luoshanshan/Desktop/5347web/group_ass/Dataset_25_March_2019/revisions/');
	for (var i = 0; i < pages.length; i++) {
		pages[i] = pages[i].substring(0, pages[i].length-5);
	}
	for (var i = 0; i < fileNames.length; i++) {
		var names = fs.readFileSync(folder + fileNames[i] + ".txt", 'utf8').split("\n")
		types.push(names);
	}
	ct1 = 0;
	ct2 = 0;
	ct3 = 0;
	index = 0;
}


module.exports.exec = function() {
	addColumn(31);
}

function addColumn(num) {
	if (num > pages.length - 1) {
		return;
	}
	var progress = 0;
    Revision.find({title: pages[num]}).exec(function (err, data) {
        if (err){
        	console.log(err)
        }
        outer: for (var k = 0; k < data.length; k++) {
        	var rev = data[k];
        	if (rev.anon) {
        		ct1++;
        		progress++;
//        		Revision.findOneAndUpdate({_id: rev._id}, {usertype: "anonymous"});
				Revision.collection.update({'_id':rev._id}, {'$set':{'usertype':"anonymous"}});
//        		console.log("ct1: " + ct1);
    		} else {
    			for (var i = 0; i < types.length; i++) {
                	var type = types[i];
                	for (var j = 0; j < type.length; j++) {
                		var name = type[j];
                		if (rev.user === name) {
                			ct2++;
                			progress++;

                			Revision.collection.update({'_id':rev._id}, {'$set':{'usertype': fileNames[i]}});

                            continue outer;
                		}
                	}
                }
    			ct3++;
    			progress++;

    			Revision.collection.update({'_id':rev._id}, {'$set':{'usertype':"regular"}})

    		}
        	var total = ct1 + ct2 + ct3;
        	if (total === 582618) {
        		console.log("Database update completed");
        	}
        	if (progress === data.length) {
        		console.log(pages[num] + " completed");

        	}
        	var current = Math.floor(total / 1000);
        	if (current > index) {
        		console.log(total);
        		index = current;
        	}
        }

    })
}






