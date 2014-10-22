# ,Маленькая задача по сортировке(sort),,

**Задание из Яндекса**: Нечетные числа должны быть отсортированы друг с другом. А четные должны остаться на своем вместе. Т.е. входящий массив может выглядеть: \[3,1,4,8,9,5,4,6,0\], а выходящий: \[1,3,4,8,5,9,4,6,0\]

Варианты решения:
1) Решение "в лоб". Сохраним в отдельный массив нечетные значения с их индексами в исходном массиве.([http://jsfiddle.net/UevJv/10/][0]) 
    
    function sortFunction(a, b, index){
        if(a[index]<b[index])
            return -1;
        if(a[index]>b[index])
            return 1; 
        return 0;
    }
    function sortMy(mas){
        var newmas = [], indexes = [];
        for(var i=0; i<mas.length; i++){
            if (mas[i]%2!=0){
              newmas.push([mas[i],i]); 
              indexes.push(i);
            }    
        }
        indexes = indexes.sort();
        newmas = newmas.sort(sortFunction,0);
        for(var j=0;j<newmas.length;j++){
            mas[indexes[j]] = newmas[j][0];
        }
        return mas;
    }
    
    var mas = [3,1,4,8,9,5,4,6,0];
    console.log(sortMy(mas));
    
    И ниже с сортировкой в двумерном массиве(можно считать, что отличие только в записи)
    
    function sortMy2(mas){
        var newmas = [], newindexes = [];
        for(var i=0; i<mas.length; i++){
            if (mas[i]%2!=0){
              newmas.push([mas[i],i]); 
            }    
        }
        newmas = newmas.sort(sortFunction,0);
        newindexes = newmas.sort(sortFunction,1);
        for(var j=0;j<newindexes.length;j++){
            mas[newindexes[j][1]] = newmas[j][0];
        }
        return mas;
    }
    
    console.log('Новый массив', sortMy2(mas));
    

2) Решением с "функцией сортировки" в которой заложено(сортировка только четных чисел) - [http://jsfiddle.net/UevJv/11/][1] . Немного сложнее и проще одновременно:

    function sortFunction(a, b){
        if (a%2!==0 && b%2!==0){
            if(a<b) return -1;
            if (a>b) return 1;
        }
        return 0;
    }
    
    var arr = [3,1,4,8,9,5,4,6,0];
    
    arr.sort(sortFunction);
    



[0]: http://jsfiddle.net/UevJv/10/
[1]: http://jsfiddle.net/UevJv/11/