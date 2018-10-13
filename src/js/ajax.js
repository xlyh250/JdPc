
const getJSON = function (type,url,bool,data) {
    const promise = new Promise(function (resolve, reject) {
      
        const client = new XMLHttpRequest();
         client.responseType = "json";
         const handler = function () {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
         client.onreadystatechange = handler;
        let params = Params(data)
        if (type === "GET"){
            client.open(type, url);
            client.send();
        } else if (type === 'POST') {
            client.open(type,url,bool);
            client.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            client.send(params);
        }
    });

    function Params(data) {
        var arr = [];
        for (var prop in data) {
            arr.push(prop + "=" + data[prop]);
        }
        return arr.join("&");
    }

    return promise;
};


export default{
    getJSON
}