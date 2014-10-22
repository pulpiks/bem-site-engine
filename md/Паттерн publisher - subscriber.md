# ,Паттерн publisher - subscriber,,

    function Publisher(){         
    }
    Publisher.prototype.subscribe = function(event, func){
        if (typeof(this.events) == 'undefined'){ 
            this.events = {};       
        }  
        if (event!=''){
            if (typeof(this.events[event]) == 'undefined')
                this.events[event] = [];
            this.events[event].push(func);
        }
    }
    
    Publisher.prototype.fire = function(event, data){
        for(var i=0; i<this.events[event].length; i++)
            this.events[event][i](data);
    }
    
    publisher = new Publisher();
    publisher.subscribe('info',function(a){console.log('2'+a);}); 
    publisher.subscribe('info',function(a){console.log('1'+a);});
    publisher.fire('info', 50);
    

результат:
250   
150

Код доступен по ссылкам: [http://jsfiddle.net/SapTX/6/][0]


[0]: http://jsfiddle.net/SapTX/6/