var vow = require('vow'),
    _ = require('lodash');

modules.define('middleware__search', ['config', 'logger', 'model', 'template'], function(provide, config, logger, model, template) {

    function getDescription(item, lang) {
        var key = item.source.key,
            block = model.getBlocks()[key],
            description;

        if(!block || !block.data) {
            return '';
        }

        block = block.data[lang] || block.data;
        description = block.description;

        if(_.isArray(description)) {
            description = description[0].content;
        }
        return description;
    }

    function convertResults(result, lang) {
        return result.reduce(function(prev, item) {
            var route = item.route,
                conditions = route.conditions,
                library = conditions.lib,
                version = conditions.version,
                level = conditions.level,
                block = conditions.block,
                uniqName = block + '-' + library,
                existed = prev[uniqName] || {
                    block: block,
                    lib: library,
                    title: item.title,
                    description: getDescription(item, lang),
                    versions: {}
                };

            existed.versions[version] = existed.versions[version] || [];
            existed.versions[version].push({
                level: level,
                url: item.url
            });

            prev[uniqName] = existed;

            return prev;
        }, {});
    }

    provide(function(){
        return function(req, res, next) {
            var url = req.path,
                text = req.query.text || '';

            if(!url.match(/^\/search\/?$/)) {
                return next();
            }

            function getResults() {
                var searchText = text.trim(),
                    nodes,
                    results,
                    sortResults;

                nodes = model.getNodesByCriteria(function() {
                    return searchText.length > 1 && 'block' === this.class &&
                        this.title && this.title[req.lang].indexOf(searchText) !== -1;
                }, false);

                results = nodes.length ? _.values(convertResults(nodes, req.lang)) : [];
                sortResults = _.sortBy(results, function(result) {
                    return result.block;
                });

                var ctx = {
                    req: req,
                    lang: req.lang,
                    bundleName: 'common',
                    statics: '',
                    block: 'search-results',
                    results: sortResults,
                    text: searchText
                };

                return template.apply(ctx, req, req.query.__mode);
            }

            vow.when(getResults())
                .then(function(html) {
                    return res.end(html);
                })
                .fail(function(err) {
                    return next(err);
                });
        };
    });
});
