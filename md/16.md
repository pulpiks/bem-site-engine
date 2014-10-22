# ,Прелести underscore,,

Задача сделать typing для онлайн чата была бы жутчайшим занятием без полезной библиотеки underscore. То, о чем мы говорили в первом подкасте(о важности знать удобные тулзы и библиотеки, которые облегчают и упрощают написание сложных проверок, алгоритмов фильтрации и прочее). Зацените выборки неповторяющихся элементов в массивах:

      var a = {"1":"asdasd","2":"sdf","3":"iui","4":"hjhj","5":"shdjsdf","6":"sjdhfsdhf"};
    var b = {"1":"ajsgdjsg","5":"jsdh","3":"mnb","8":"asdas","5":"shgda","6":"djshf"};
    console.log(_.keys(a));
    
    function difference(){
        var A = _.keys(a),B = _.keys(b);
        var removed = _.difference(A, B);
        var added = _.difference(B, A);
        console.log('removed' + removed);
        console.log('added' + added);   
    }
     difference();