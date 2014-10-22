var fs = require('fs');
var dirmd = 'md';
var files = fs.readdirSync(dirmd);
files.forEach(function(file, i){
	// var content = fs.readFileSync(dirmd+'/'+file, {encoding: 'utf8'});
	fs.readFile(dirmd+'/'+file, {encoding: 'utf8'}, function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  var title = data.split('\n')[0].substr(2).trim();
	  var res = '# '+ title.replace(/\,(.+)\,\,/, function(str, p1, p2, offset, s){
	  		console.log(arguments[1]);
	  		return arguments[1]
	  }) + '\n' + data.split('\n').slice(1).join('\n');
	  fs.writeFile(dirmd+'/'+file, res, 'utf8', function (err) {
	     if (err) return console.log(err);
	  });
	});
});