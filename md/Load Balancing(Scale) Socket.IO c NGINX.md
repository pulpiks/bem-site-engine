# ,Load Balancing(Scale) Socket.IO c NGINX,,

Socket.IO замечательная штука для написания Realtime приложений(об это вы можете прочитать [здесь][0], в число ее многочисленных плюсов входит отслеживание heartbeat'а клиента и самостоятельное отключение его в случае если он отсутствует, востановление соединения в случае если оно было потеряно и конечно поддержка умелого даунгрейда. Но и у него есть пара минусов. Например ее невозможно использовать без sticky сессий(закрепленных за одним сервером), просто положившись на Round Robin, и она вообще слабо дружит с LB.

**Что будет если использовать без sticky session?**   
Так как socket.io работает через handshake, где делает первый запрос, затем чтобы сервер ответил какие способы соединения может использовать клиент, и только потом идет попытка установить полноценное соединение через websocket. Соотвественно первый запрос приходит на сервер 1, а второй уже на сервер 2, таким образом получается, что клиента на 2м сервере заново просят пройти handshake.

## NGINX

В качестве Load Balancer'а у нас выступает nginx хотя HAProxy несомнено хорош, но в случае сайта, все таки имеет смысл сразу делать статику на nginx и соотвественно проксировать это там же.

Load Balancing на nginx со sticky session можно сделать следующими способами(их больше чем здесь перечислено, но я лично выбирал лишь из этого, потому что ставить модуль на ubuntu и отдельно компилить nginx не хотелось):   
1\. начиная с 1.5.7 версии есть директива [sticky][1] у nginx.   
2\. (им я пользуюсь) Load Balancing на клиенте, через Javascript, который рандомит функцию:

Псевдокод **JS** 
    
    var servers = [1,2,3,4];
    if(typeof(getCookie('server'))=='undefined') setCokie('server', randomFrom(servers),{path:'/'});
    

Проставляем куку на клиенте до запроса к Socket.IO.

**NGINX** 
    
    map $cookie_server $balance {
        default 127.0.0.1:3000;
        1 127.0.0.1:3000;
        2 127.0.0.1:3001;
        3 127.0.0.1:3002;
        4 127.0.0.1:3003;
    }
    

Мапим по куке до конкретного сервера NodeJs.

    location /socket.io/ {
      proxy_pass http://$balance$uri;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
    

Там где у нас socket.io отдаем уже через reverse proxy'рование.

К тому что сверху и там там следует только дописать, что делать в случае падение одного из серверов и можно балансить как-то поумнее, но в принципе и так неплохо выходит.

Вот мы и сделали sticky session на nginx.

## Socket.IO

К сожалению проблема не исчерпана на этот момент. Балансится замечательно и красиво. Вот только нету у нас единной шины сообщений и хранилища между этими серверами. На помощь нам приходит [Redis][2], в качестве системы хранения данных и шины сообщений:

    var RedisStore = require('socket.io/lib/stores/redis')
    , redis  = require('socket.io/node_modules/redis')
    , pub    = redis.createClient()
    , sub    = redis.createClient()
    , client = redis.createClient();
    io.set('store', new RedisStore({
      redisPub : pub
      , redisSub : sub
      , redisClient : client
    }));
    

Вуаля! Готово. Вот теперь ваше приложение на Socket.IO масштабируется! :)


[0]: http://socket.io
[1]: http://nginx.org/en/docs/http/ngx_http_upstream_module.html#sticky
[2]: http://redis.io/