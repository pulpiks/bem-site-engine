var fs = require('fs');
var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};
var vow = require('vow');

var userMap = {
    root: 'pulpiks',
    'Nikolay Mendyaev': 'klond90'
};

var dirmd = './md';
var files = fs.readdirSync(dirmd);

function readFileInfo(file){
    var dfd = vow.defer();
    execute("git log --format='%aN' "+file+" | sort -u", function(res){
        // console.log(file);
        var authors = res.trim().split('\n').map(function(x){var r = x.trim(); return userMap[r]?userMap[r]:r;});
        var title = fs.readFileSync(file, {encoding: 'utf8'}).split('\n')[0].substr(2);
        var content = 'https://github.com/pulpiks/jsboom-bem/blob/dev/'+file;
        var obj = {
            title: title,
            route: file.split('/').pop().split('.md')[0],
            source: {
                ru: {
                    title: title,
                    createDate: '12-09-2014',
                    authors: authors,
                    content: content
                }
            }
        };
        // console.log(obj);
        dfd.resolve(obj);
    });
    return dfd.promise();
};
var chain;
var items = [];
files.forEach(function(curFileName){
    var file = 'md/'+curFileName;
    if (chain){
        chain = chain.then((function(file, result){
            items.push(result);
            return readFileInfo(file);
        }).bind(null, file));
    } else {
        chain = readFileInfo(file);
    }
}, []);
chain.then(function(result){
    items.push(result);
    fs.writeFileSync('model/data.json', JSON.stringify(items), {encoding: 'utf8'});
    console.log('result is written');
});