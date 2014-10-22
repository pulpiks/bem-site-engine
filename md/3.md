# ,NodeTypes,,

Написать функцию, которая принимает html element node'у и возвращает результирующий массив текстовых нод(text node) которые находятся внутри. Использовать возможности нативного языка.

Пример html-разметки:

    <div id="init">
        <!-- fgsjhfsja -->
        <span>lsjdflsk
            <a href="/gb">ajhsdjagsjd</a>
        </span>ewrhekrg
    </div>
    

Решение завязано на свойствах js **childNodes** и **nodeType**:([http://jsfiddle.net/B2BZh/1/][0]). В отличии от children() jquery, нативный childNodes возвращает набор элементов-потомков с дополнительной информацией о том какого типа пришла node(element, textnode, comment, etc.). Более подробно о nodeTypes в [http://www.w3schools.com/jsref/prop][1]_node_nodetype.asp

    function getTextNodes(el){
        var res = [],
            term;
        for(var i = 0,l=el.childNodes.length;i < l;i++){
            if (el.childNodes[i].nodeType===3){
                if (term = el.childNodes[i].data.trim()){
                    res.push(term);
                }
            } else if (el.childNodes[i].nodeType===1){
                res = res.concat(getTextNodes(el.childNodes[i]));
            }
        }
        return res;
    }
    var el = document.getElementById('init'),
    result = getTextNodes(el);
    console.log(result);
    



[0]: http://jsfiddle.net/B2BZh/1/
[1]: http://www.w3schools.com/jsref/prop