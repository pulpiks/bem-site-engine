var express = require('express');
var githubhook = require('githubhook');

var github = githubhook({/* options */});

github.listen();

// github.on('*', function (event, repo, ref, data) {
// });

// github.on('push', function (repo, ref, data) {
// });

// github.on('event:reponame', function (ref, data) {
// });
 
github.on('push', function (data) {
	console.log('data',data);
}); 

// github.on('reponame', function (event, ref, data) {
// });

// github.on('reponame:ref', function (event, data) {
// });