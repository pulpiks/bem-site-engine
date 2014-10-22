# ,Pattern Responsible chain(Цепочка обязанностей),,

[http://jsfiddle.net/qHL6e/6/][0]

    function func1(next, val){
        if(true){
            console.log('1');
            next();
        } else {
            next(false);
        }
    }   
    function func2(next, val){
        console.log('2');
        next();
    }
    function func3(next, val){
        console.log('3');
        next();
    }
    function fail(){
        console.log('fail baby');
    }
    
    function Chain(){
    }
    
    Chain.prototype.next = function(){
        if (arguments.length>0)
            this.handlerFail(this.val);
        else{
            if (this.handlers[++this.index]!=undefined)                 this.handlers[this.index(this.next.bind(this), this.val);
    }
    }
    
    
    Chain.prototype.add = function(handler){
        if (typeof(this.handlers) == 'undefined'){
            this.handlers = [];
        }
        this.handlers.push(handler);
        return this;
    }
    Chain.prototype.fail = function(handler){
       this.handlerFail = handler;
       return this;
    }
    Chain.prototype.execute = function(val){
        this.val = val;
        this.index = 0;
        if (this.handlers.length>0)
             this.handlers[this.index](this.next.bind(this), val);  
    }    
    
    
    var chain  = new Chain();
    chain.add(func1).add(func2).add(func3).fail(fail).execute(123);
    
    Результат выполнения:
    1
    2
    3
    



[0]: http://jsfiddle.net/qHL6e/6/