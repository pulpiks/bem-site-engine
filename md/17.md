# ,Пример переопределения нативного метода push у объектов типа Array,,

var MyArray = function(){   
Array.prototype.push.apply(this, Array.prototype.slice.call(arguments, 0));   
}

> //F = function(){};   
> //F.prototype = Array.prototype;   
> MyArray.prototype = new Array(); //new F 

Две формы записи (с вспомоготельным объектом F и только с Array) имеют место быть. Использовать дополнительный объект правильнее в данном случае, поскольку функция F имеет пустую функцию-конструктор, а Array обладает непустым конструктором. 

MyArray.prototype.push = function(){   
Array.prototype.push.apply(this, arguments);   
}

a = new MyArray(1,2,3);   
a.push(4);

Пример на переопределения нативного push:

    function MyArray() { 
          this.args = Array.prototype.slice.call(arguments)||[]; 
    }
    MyArray.prototype.push = function(b) {
           this.args.push(b);
           console.log(b);
    }
    MyArray.prototype = Array.prototype
    
    var myArr = new MyArray(3,5,6);
    myArr.push(1);
    

Еще один способ переопределения:

    var MyArray = function(){
    
    Array.prototype.push.apply(this, Array.prototype.slice.call(arguments, 0));
    
    }
    
    MyArray.prototype = new Array(); //new F
    MyArray.prototype.push = function(){
        console.log(arguments);
        Array.prototype.push.apply(this, arguments);   
    }
    
    
    a = new MyArray(1,2,3);
    a.push(4);
    console.log(a);