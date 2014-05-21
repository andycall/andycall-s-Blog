/**
 * Created with JetBrains WebStorm.
 * User: andycall
 * Date: 8/22/13
 * Time: 9:02 PM
 * To change this template use File | Settings | File Templates.
 */

/*
this function send the get HTTP request ,
return  XML object or JSON object or string text
*/
var ajax = (function(){
    var request = new XMLHttpRequest();

    function encodeFormData(data){
        if(!data) return "";
        var pairs = [];
        for(var name in data){
            if(!data.hasOwnProperty(name)) continue;
            if(typeof data[name] === 'function') continue;
            var value  = data[name].toString();
            name = encodeURIComponent(name.replace("%20",""));
            value = encodeURIComponent(value.replace("%20",""));
            pairs.push(name +"="+ value);
        }
        return pairs.join('&');
    }

    function ResponseHandle(request,callback){
        var type = request.getResponseHeader('Content-Type').toUpperCase();

        if(type.indexOf('XML') !== -1 && type.responseXML){
            callback(request.responseXML);
        }
        else if(type.indexOf('JSON')){
                callback(JSON.parse(request.responseText));
        }
        else{
            callback(request.responseText);
        }
    }

    return {
        get : function(url,callback){
            request.open("GET",url);
            request.addEventListener('readystatechange',function(){
                if(request.readyState === 4 && request.status === 200){
                    var type = request.getResponseHeader("Content-Type").toUpperCase();
                    ResponseHandle(request, callback);
                }
            },false);
        },
        postdata : function(url,data,callback){
            request.open('POST',url,true);
            request.addEventListener('readystatechange',function(){
                if(request.readyState === 4 && callback){
                    ResponseHandle(request, callback);
                }
            },false);
            request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            request.send(encodeFormData(data));
        },
        getdata : function(url,data,callback){
            request.open('GET',url + "?" + encodeFormData(data));
            request.addEventListener('readystatechange',function(){
                if(request.readyState === 4 && callback)
                    ResponseHandle(request, callback);
            },false);
            request.send(null);
        },
        sendJSON : function(url,data,callback){
            request.open('POST',url,true);
            request.addEventListener('readystatechange',function(){
                if(request.readyState === 4 && callback)
                   ResponseHandle(request, callback);
            },false);
            request.setRequestHeader('Content-Type','application/json');
            request.send(data);
        },
        timeGetText : function(url,timeout,callback){
            var timedout = false;
            var timer = setTimeout(function(){
                timedout = ture;
                request.abort();
            },timeout);

            request.open('GET',url,true);

            request.addEventListener('readystatechange',function(){
                if(request.readyState !== 4) return;
                if(timedout) return;
                clearTimeout(timer);
                if(request.status === 200){
                    ResponseHandle(request, callback);
                }
            },false);
            request.send(null);
        }
    }

})();
var whenReady = (function(){
    var func = [];
    var ready = false;

    function hander(e){
        if(ready) return ;

        if(e.type == 'readystatechange' && document.readyState !== 'complete'){
            return ;
        }

        for(var i=0; i< func.length; i++){
            func[i].call(document);
        }


        ready = true;
        func = null;
    }

    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded',hander,false);
        document.addEventListener('readystatechange',hander,false);
        window.addEventListener('load',hander,false);
    }

    else if(document.attachEvent){
        document.attachEvent('onreadystatechange',hander,false);
        window.attachEvent('onload',hander);
    }


    return function whenReady(f){
         if(ready) f.call(document);
         else func.push(f);
    }
})();
