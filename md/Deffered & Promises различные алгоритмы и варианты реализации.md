# ,Deffered & Promises различные алгоритмы и варианты реализации,,

Deffered - варианты написания асинхронных функций "в строчку"(т.е. избегая записи колбэк в колбэке в колбэке, что присутствует в NodeJS без использования сторонних библиотек). Готовые решения есть и они почти всегда устраивают. Jquery($.Deffered), Coffescript(await ... defer), AsyncJS. Эти библиотеки позволяю грамотно структурировать код и обеспечивать его поддерживаемость. Вместо лестничного написания кода, код оформляется "столбиком". Смысл deffered заключается в том, что в программе имеется множество асинхронных функций, c определенным порядком выполнения. Например, скрипт должен вызвать колбэк самой поздней из одновременно исполняемых асинхронных функций без прибегания к хардкорным решениям вроде setTimeInterval и т.д. Или же реализовать нативный паттерн NodeJS, вызывать один скрипт в колбэке другого и т.д. для каждой внутренней асинхронной функции. Для реализации такой сложной задачи необходимо грамотно продумать архитектуру приложения с запасом на будущее и быстрое внесение доработок и поправок.

Promise - как раз паттерн реализации асинхронных функций в последовательном выполнении.

### 1\. Паттерн then

Через 3 сек вызывается callback finished1,через следующие 3 сек - finished 2\.

        var asyncFunction = function(text,cb){ 
            setTimeout(function(){
                console.log(text);
                cb();
            }, 3000)
        };
    
        function callback(){
            console.log('world is wonderful!');
        } 
    
        function Promise(){
            this.arrFunction = [];
        }
        Promise.prototype.then = function(func){
            var args = Array.prototype.slice.call(arguments,1);
            this.arrFunction.push({'func':func, 'args':args});  
            return this;
        }
        Promise.prototype.execute = function(){
            if (this.arrFunction.length>0){
                var curObj = this.arrFunction.shift();
                console.log(curObj.args);
                curObj.func.apply(this, curObj.args);
            }
        }
    
        var myPromise = new Promise();
        myPromise.then(asyncFunction, 'finished 1').then(asyncFunction, 'finished 2').execute();
    

#### 2\. Паттерн async execute

Все асинхронные методы в then выполняются одновременно, задачей является отлавливать callbackот каждой асинхронной функции. Причем рассмотрим общий случай,когда количество asyncFunction и callback может быть записаны в массив. 
    
    var asyncFunction = function(text,time,cb){ 
        var cb = cb;
        setTimeout(function(){
            console.log(text);
            cb();
        }, time)
    };
    function Promise(){
        this.arrFunction = [];
    }
    Promise.prototype.then = function(func){
        //var args = Array.prototype.slice.call(arguments);
        if (func instanceof Array){
    
            var tmpArr = [];
            for(var i=0; i<func.length; i++){
                tmpArr.push({'func':func[i][0], 'args':func[i].slice(1)});
            }
            this.arrFunction.push(tmpArr);
        }
        else{
            var args = Array.prototype.slice.call(arguments, 1);
            //args = args.slice(1);
            console.log(arguments, args);
            this.arrFunction.push({'func':func, 'args':args});
        }
    
    
        return this;
    };
    Promise.prototype.start = function(){
        this.execute();
    };
    Promise.prototype.execute = function(){
        console.log('qqq', this.arrFunction);
        ;
        if (this.arrFunction.length>0){
            var curStep = this.arrFunction.shift();
            var self = this;
            if (!(curStep instanceof Array)){
                console.log('func');
                curStep.args.push(function(){self.execute();});
                curStep.func.apply(null, curStep.args);
            }
            else{
                console.log('Array');
                this.counterSync  = curStep.length;
                for(var j=0; j<curStep.length;j++){
                    curStep[j].args.push(function(){
                        self.counterSync--;
                        if (self.counterSync == 0)
                            self.execute();                        
                    });
                    curStep[j].func.apply(null, curStep[j].args);              
                }
            }
        }
    }
    var myPromise = new Promise();
    myPromise.then([[asyncFunction, 'finished 1.1',400],[asyncFunction, 'finished 1.2',2000],[asyncFunction, 'finished 1.3', 1000]]).then(asyncFunction, 'finished 2',2000).start();
    

Второй вариант реализации

    var asyncFunction = function(text,cb){ 
    var cb = cb;
    setTimeout(function(){
    console.log(text);
    cb();
    }, 3000)
    };
    function Promise(){
    this.arrFunction = [];
    }
    Promise.prototype.then = function(func){
    var args = Array.prototype.slice.call(arguments, 1);
    //args = args.slice(1);
    console.log(arguments, args);
    this.arrFunction.push({'func':func, 'args':args}); 
    return this;
    };
    Promise.prototype.start = function(){
    this.execute();
    };
    Promise.prototype.execute = function(){
    if (this.arrFunction.length>0){
    var curObj = this.arrFunction.shift();
    var self = this;
    curObj.args.push(function(){self.execute();});
    curObj.func.apply(null, curObj.args);
    }
    }
    var myPromise = new Promise();
    myPromise.then(asyncFunction, 'finished 1').then(asyncFunction, 'finished 2').start();
    
    
    
    
    var asyncFunction = function(text,time,cb){ 
    var cb = cb;
    setTimeout(function(){
    console.log(text);
    cb();
    }, time)
    };
    function Promise(){
    this.arrFunction = [];
    }
    Promise.prototype.then = function(func){
    //var args = Array.prototype.slice.call(arguments);
    if (func instanceof Array){
    
    var tmpArr = [];
    for(var i=0; i<func.length; i++){
    tmpArr.push({'func':func[i][0], 'args':func[i].slice(1)});
    }
    this.arrFunction.push(tmpArr);
    }
    else{
    var args = Array.prototype.slice.call(arguments, 1);
    //args = args.slice(1);
    console.log(arguments, args);
    this.arrFunction.push({'func':func, 'args':args});
    }
    
    
    return this;
    };
    Promise.prototype.start = function(){
    this.execute();
    };
    Promise.prototype.execute = function(){
    console.log('qqq', this.arrFunction);
    ;
    if (this.arrFunction.length>0){
    var curStep = this.arrFunction.shift();
    var self = this;
    if (!(curStep instanceof Array)){
    console.log('func');
    curStep.args.push(function(){self.execute();});
    curStep.func.apply(null, curStep.args);
    }
    else{
    console.log('Array');
    this.counterSync = curStep.length;
    for(var j=0; j<curStep.length;j++){
    curStep[j].args.push(function(){
    self.counterSync--;
    if (self.counterSync == 0)
    self.execute(); 
    });
    curStep[j].func.apply(null, curStep[j].args); 
    }
    }
    }
    }
    var myPromise = new Promise();
    myPromise.then([[asyncFunction, 'finished 1.1',400],[asyncFunction, 'finished 1.2',2000],[asyncFunction, 'finished 1.3', 1000]]).then(asyncFunction, 'finished 2',2000).start();
    

Вариант сложного promise

        var asyncFunction = function(text,time,cb){ 
        var cb = cb;
        setTimeout(function(){
            console.log(text);
            cb();
        }, time)
    };
    var getData = function(id,cb){
        var cb = cb, id = id;
        setTimeout(function(){cb(4);},1000);
    };
    var multiplyData = function(num,cb){
        console.log('num=',num);
        var cb = cb, num = num;
        setTimeout(function(){cb(num*4);},1000);
    };
    var consoleData = function(text,cb){
        var text = text, cb = cb;
        setTimeout(function(){console.log(text);cb(text);},1000);
    };
    function Promise(){
        this.arrFunction = [];
    }
    
    Promise.prototype.thenParam = function(func){
        debugger;
        //var args = Array.prototype.slice.call(arguments);
        if (func instanceof Array){
    
            var tmpArr = [];
            for(var i=0; i<func.length; i++){
                tmpArr.push({'func':func[i][0], 'args':func[i].slice(1)});
            }
            this.arrFunction.push(tmpArr);
        }
        else{
            var args = Array.prototype.slice.call(arguments, 1);
            //args = args.slice(1);
            console.log(arguments, args);
            this.arrFunction.push({'func':func, 'args':args});
        }
    
    
        return this;
    };
    
    Promise.prototype.then = function(func){
        //var args = Array.prototype.slice.call(arguments);
        if (func instanceof Array){
    
            var tmpArr = [];
            for(var i=0; i<func.length; i++){
                tmpArr.push({'func':func[i][0], 'args':func[i].slice(1)});
            }
            this.arrFunction.push(tmpArr);
        }
        else{
            var args = Array.prototype.slice.call(arguments, 1);
            //args = args.slice(1);
            console.log(arguments, args);
            this.arrFunction.push({'func':func, 'args':args});
        }
    
    
        return this;
    };
    Promise.prototype.start = function(){
        this.execute();
    };
    Promise.prototype.execute = function(params){
        debugger;
        console.log('qqq', this.arrFunction);
        if (typeof(params)=='undefined'){
            params = [];
        }
        ;
        if (this.arrFunction.length>0){
            var curStep = this.arrFunction.shift();
            var self = this;
            if (!(curStep instanceof Array)){
                console.log('func');
                var res = curStep.args.concat(params);
                res.push(function(){
                    debugger;
                    self.execute(Array.prototype.slice.call(arguments, 0));
                });
                curStep.func.apply(null, res);
            }
            else{
                console.log('Array');
                this.counterSync  = curStep.length;
                for(var j=0; j<curStep.length;j++){
                    curStep[j].args.push(function(){
                        self.counterSync--;
                        if (self.counterSync == 0)
                            self.execute();                        
                    });
                    curStep[j].func.apply(null, curStep[j].args);              
                }
            }
        }
    }
    var myPromise = new Promise();
    myPromise.thenParam(getData,2).thenParam(multiplyData).thenParam(consoleData).start();
    /*
    myPromise.then([[asyncFunction, 'finished 1.1',400],[asyncFunction, 'finished 1.2',2000],[asyncFunction, 'finished 1.3', 1000]]).then(asyncFunction, 'finished 2',2000).start();*/
    
    
     //
    
    var asyncFunction = function(text,cb){ 
    var cb = cb;
    setTimeout(function(){
    console.log(text);
    cb();
    }, 3000)
    };
    function Promise(){
    this.arrFunction = [];
    }
    Promise.prototype.then = function(func){
    var args = Array.prototype.slice.call(arguments, 1);
    //args = args.slice(1);
    console.log(arguments, args);
    this.arrFunction.push({'func':func, 'args':args}); 
    return this;
    };
    Promise.prototype.start = function(){
    this.execute();
    };
    Promise.prototype.execute = function(){
    if (this.arrFunction.length>0){
    var curObj = this.arrFunction.shift();
    var self = this;
    curObj.args.push(function(){self.execute();});
    curObj.func.apply(null, curObj.args);
    }
    }
    var myPromise = new Promise();
    myPromise.then(asyncFunction, 'finished 1').then(asyncFunction, 'finished 2').start();
    
    
    
    
    var asyncFunction = function(text,time,cb){ 
    var cb = cb;
    setTimeout(function(){
    console.log(text);
    cb();
    }, time)
    };
    function Promise(){
    this.arrFunction = [];
    }
    Promise.prototype.then = function(func){
    //var args = Array.prototype.slice.call(arguments);
    if (func instanceof Array){
    
    var tmpArr = [];
    for(var i=0; i<func.length; i++){
    tmpArr.push({'func':func[i][0], 'args':func[i].slice(1)});
    }
    this.arrFunction.push(tmpArr);
    }
    else{
    var args = Array.prototype.slice.call(arguments, 1);
    //args = args.slice(1);
    console.log(arguments, args);
    this.arrFunction.push({'func':func, 'args':args});
    }
    
    
    return this;
    };
    Promise.prototype.start = function(){
    this.execute();
    };
    Promise.prototype.execute = function(){
    console.log('qqq', this.arrFunction);
    ;
    if (this.arrFunction.length>0){
    var curStep = this.arrFunction.shift();
    var self = this;
    if (!(curStep instanceof Array)){
    console.log('func');
    curStep.args.push(function(){self.execute();});
    curStep.func.apply(null, curStep.args);
    }
    else{
    console.log('Array');
    this.counterSync = curStep.length;
    for(var j=0; j<curStep.length;j++){
    curStep[j].args.push(function(){
    self.counterSync--;
    if (self.counterSync == 0)
    self.execute(); 
    });
    curStep[j].func.apply(null, curStep[j].args); 
    }
    }
    }
    }
    var myPromise = new Promise();
    myPromise.then([[asyncFunction, 'finished 1.1',400],[asyncFunction, 'finished 1.2',2000],[asyncFunction, 'finished 1.3', 1000]]).then(asyncFunction, 'finished 2',2000).start();
    

Код выложен по ссылкам
[http://jsfiddle.net/eRpUw/16/][0]
[http://jsfiddle.net/eRpUw/11/][1]
[http://jsfiddle.net/8U9Yc/1/][2]
[http://jsfiddle.net/TKfz2/][3]


[0]: http://jsfiddle.net/eRpUw/16/
[1]: http://jsfiddle.net/eRpUw/11/
[2]: http://jsfiddle.net/8U9Yc/1/
[3]: http://jsfiddle.net/TKfz2/