// var express = require('express');
var fs = require('fs');
var util = require('util');
try{
var items = JSON.parse(fs.readFileSync('model/data.json', {encoding: 'utf8'}));
}catch(e){
    console.log('\n', process.cwd(), '\n')
    console.log(e);
    console.log(e.printStackTrace())
    process.exit(1);
}// var app = express();

// app.get('/', function(req, res){
//   res.send('hello world');
// });

module.exports = {
    get: function() {
        return [
            getMain(),
            getCustom()
            // getDocs()
            // getLibraries(),
            // getAuthors(),
            // getTags()
        ];
    }
};

var getCustom = function() {
     var obj = {
        title: 'Статьи',
        route: {
           name: 'articles',
           pattern: '/articles(/<id>)(/)'
        },
        items: items
    };
    console.log(util.inspect(obj, {showHidden: false, depth: null}));
    return obj;
};

var getMain = function() {
    return {
        title: 'Привет Bem-Engine',
        route: {
            name: 'index',
            pattern: '/'
        },
        source: {
            ru: {
                title: 'Bem-site-engine',
                createDate: '12-07-2014',
                authors: ['pulpiks'],
                tags: ['readme'],
                content: 'https://github.com/pulpiks/jsboom-bem/blob/dev/md/0.md'
            }
        }
    };
};


var getDocs = function() {
    return {
        title: 'Документация',
        route: {
            name: 'documentation',
            pattern: '/documentation(/<id>)(/)'
        },
        items: [
            {
                title: 'Создание модели',
                route: 'model',
                source: {
                    ru: {
                        title: 'Создание модели',
                        createDate: '12-07-2014',
                        authors: ['kuznetsov-andrey'],
                        tags: ['documentation', 'model'],
                        content: 'https://github.com/bem/bem-site-engine/blob/dev/docs/model.ru.md'
                    }
                }
            },
            {
                title: 'Конфигурация',
                route: 'config',
                source: {
                    ru: {
                        title: 'Руководство по конфигурированию приложения',
                        createDate: '12-07-2014',
                        authors: ['kuznetsov-andrey'],
                        tags: ['documentation', 'config'],
                        content: 'https://github.com/bem/bem-site-engine/blob/dev/docs/config.ru.md'
                    }
                }
            },
            {
                title: 'Описание middleware модулей',
                route: 'middleware',
                source: {
                    ru: {
                        title: 'Описание middleware модулей',
                        createDate: '12-07-2014',
                        authors: ['kuznetsov-andrey'],
                        tags: ['documentation', 'middleware'],
                        content: 'https://github.com/bem/bem-site-engine/blob/dev/docs/middleware.ru.md'
                    }
                }
            },
            {
                title: 'Процесс сборки данных',
                route: 'compile',
                source: {
                    ru: {
                        title: 'Процесс сборки данных',
                        createDate: '12-07-2014',
                        authors: ['kuznetsov-andrey'],
                        tags: ['documentation', 'data-compile'],
                        content: 'https://github.com/bem/bem-site-engine/blob/dev/docs/data_compiling.ru.md'
                    }
                }
            }
        ]
    };
};

var getLibraries = function() {
    return {
        title: 'Библиотеки',
        route: {
            name: 'libs',
            pattern: '/libs(/<lib>)(/<version>)(/<level>)(/<block>)(/<id>)(/docs|jsdoc|examples)(/)'
        },
        source: {
            ru: {
                title: 'Библиотеки',
                content: 'https://github.com/bem/bem-site-engine/blob/dev/README.md'
            }
        },
        items: [
            getLib('bem-components')
        ]
    };
};

var getAuthors = function() {
    return {
        title: {
            en: "Authors",
            ru: "Авторы"
        },
        route:{
            name: "authors",
            pattern: "/authors(/<id>)(/)"
        },
        view: "authors",
        items: [
            {
                title: {
                    en: "Authors",
                    ru: "Авторы"
                },
                dynamic: "authors"
            }
        ]
    };
};

var getTags = function() {
    return {
        title: {
            en: "Tags",
            ru: "Теги"
        },
        route:{
            name: "tags",
            pattern: "/tags(/<id>)(/)"
        },
        view: "tags",
        source: "https://github.com/bem/bem-method/tree/bem-info-data/pages/dummy",
        items: [
            {
                title: "Теги",
                hidden: ['en'],
                dynamic: "tags:ru"
            }
        ]
    };
};

var getLib = function(lib) {
    return {
        title: lib,
        route: {
            conditions: {
                lib: lib
            }
        },
        type: 'select',
        lib: lib
    };
};
