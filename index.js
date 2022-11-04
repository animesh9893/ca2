var express = require('express');  
var app = express();

var bodyParser = require('body-parser');  

app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({ extended: false })  

// function to convert string to int
function toInt(str) {
    return parseInt(str)
}

// check if string contain only int
function isInt(str) {
    for(var i=0;i<str.length;i++){
        if(str[i]<='9' && str[i]>='0'){
            continue
        }else{
            return false
        }
    }
    return true
}

function middleware1(req, res, next) {
    console.log(req.body)

    var first = req.body?.first
    var sec = req.body?.sec
    var method = req.body?.method

    if(isInt(first)===false || isInt(sec)===false){
        res.status(400).send("Bad Request")
        return
    }
    
    var first_n = toInt(req.body?.first)
    var sec_n = toInt(req.body?.sec)

    var ans = 0;

    if(method==="addition"){
        ans = first_n + sec_n
    }else if(method==="subtraction"){
        ans = first_n - sec_n
    }else if(method==="multiplication"){
        ans = first_n * sec_n 
    }else if(method==="division"){
        ans = first_n / sec_n
    }

    // load data to resposne
    res.locals.data = {
        first: first_n, 
        sec: sec_n,
        ans: ans,
        method:method
    }
    
    next()
}

app.get('/',function (req, res) {
    res.send(`
    <form action="http://localhost:3000/" method="post">
        <input type="text" name="first">
        <input type="text" name="sec">
        <select name="method">
            <option value="addition">addition</option>
            <option value="division">division</option>
            <option value="subtraction">subtraction</option>
            <option value="multiplication">multiplication</option>
        </select>
        <button type="submit">Submit</button>
    </form>`)
    res.status(200);
})

app.post('/',[urlencodedParser,middleware1],function(req,res){
    console.log("post request")
    res.send(`
    <form action="http://localhost:3000/" method="post">
        <input type="text" name="first" value="${res.locals.data.first}">
        <input type="text" name="sec" value="${res.locals.data.sec}">
        <select name="method">
            <option value="addition">addition</option>
            <option value="division">division</option>
            <option value="subtraction">subtraction</option>
            <option value="multiplication">multiplication</option>
        </select>
        <button type="submit">Submit</button>
    </form>
    <div>
        <div>Result</div>
        <div> first: ${res.locals.data.first} </div>
        <div> sec: ${res.locals.data.sec} </div>
        <div>
            <span>${res.locals.data.method} : </span>
            <span>${res.locals.data.ans}</span>
        </div>
    </div>
    `)
    console.log("from post ",res.locals)

    res.status(200);
})

// server
app.listen(3000, function () {
    console.log("listning at port 3000");
})