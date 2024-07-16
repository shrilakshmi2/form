const bodyParser = require('body-parser')
const ex=require('express')
// const date=require('Date')
const fs=require('fs')
const { title } = require('process')
const app=ex()

app.use(ex.urlencoded())

app.use(bodyParser.json())

app.use(ex.static(__dirname))
app.use(ex.static(__dirname+'/files'))

app.get('/home',(req,res)=>{
    res.send(fs.readFileSync('./home.html','utf-8'))
})


app.post('/take',(req,res)=>{
    let che=Object.keys(JSON.parse(fs.readFileSync('qns.txt','utf-8')))
    if (!checkid(che,req.body.code)) {
        res.send('This test do not exits')
    }
    let en=JSON.parse(fs.readFileSync('endis.txt','utf-8'))
    if(en[req.body.code]['status']=='disabled'){
        res.send('The test is not started yet')
    }
   
let file=fs.readFileSync('forms.txt','utf-8')
file=JSON.parse(file)
file.curform=req.body.code
file['curid']=file.curid+=1
fs.writeFileSync('./forms.txt',JSON.stringify(file))
res.send(fs.readFileSync('take.html','utf-8'))
})

app.post('/response',(req,res)=>{
    let x=req.body
    let file=fs.readFileSync('forms.txt','utf-8')
    file=JSON.parse(file)
    n=x.name
    console.log(Date.to)
    let obj={[n]:{
        form:file['curform'],
        ans:x,
        dt:datetime()
    }}
    let obj2=JSON.parse(fs.readFileSync('response.txt','utf-8'))
    // Object.assign(obj,obj2)
    fs.writeFileSync('response.txt',JSON.stringify(obj))
    res.send(fs.readFileSync('response.html','utf-8'))
})

app.get('/host',(req,res)=>{
    res.send(fs.readFileSync('host.html','utf-8'))
})

app.post('/host2',(req,res)=>{
    let x=req.body
    console.log(x) 
    
    obj={}
    for(i=1;i<=x['length'];i++){
        if(x['length']!=1){
            temp={[`qn${i}`]:{
                qn:x[`qn${i}`],
                op1:x[`op1`][i-1],
                op2:x[`op2`][i-1],
                op3:x[`op3`][i-1],
                op4:x[`op4`][i-1],
                
            }}
            Object.assign(obj,temp)
        }
        else{
            temp={[`qn${i}`]:{
                qn:x[`qn${i}`],
                op1:x[`op1`],
                op2:x[`op2`],
                op3:x[`op3`],
                op4:x[`op4`],
                
            }}
            Object.assign(obj,temp)
        }
    }
    let file=fs.readFileSync('forms.txt','utf-8')
    file=JSON.parse(file)
    file['curlen']=x['length']
    file['curname']=x['name']
    file['curtitle']=x['title']
    file['curid']+=1
    fs.writeFileSync('forms.txt',JSON.stringify(file))
    id='df'+(file['curid']+1)
    obj={[id]:obj}
    let obj2=JSON.parse(fs.readFileSync('qns.txt','utf8'))
    Object.assign(obj,obj2)
    fs.writeFileSync('qns.txt',JSON.stringify(obj))
    obj3={[id]:{}}
    for(i=1;i<=x['length'];i++){
       if(x['length']!=1){
        temp={
            [`qn${i}`]:x['ans'][i-1]
        }
        Object.assign(obj3[id],temp)
       }
       else{
        temp={
            [`qn${i}`]:x['ans']
        }
        Object.assign(obj3[id],temp)
       }
    }
    // obj3[file['curform']]=temp
    // console.log(obj3)
    // setdatetime()
    


    addname(req.body,id)
    addtime(x,id)


    let ans=JSON.parse(fs.readFileSync('ans.txt','utf-8'))
    Object.assign(obj3,ans)
    fs.writeFileSync('ans.txt',JSON.stringify(obj3))
    res.send(fs.readFileSync('idpass.html','utf-8'))

})


app.post('/disable',(req,res)=>{
    let x=req.body
    console.log(x)
    let en=JSON.parse(fs.readFileSync('endis.txt','utf-8'))
    en[x['id']]['status']='disabled'
    console.log(en[x['id']])
    fs.writeFileSync('endis.txt',JSON.stringify(en))
})

app.post('/enable',(req,res)=>{
    let x=req.body
    console.log(x)
    let en=JSON.parse(fs.readFileSync('endis.txt','utf-8'))
    console.log(en)
    en[x['id']]['status']='enabled'
    console.log(en[x['id']])
    fs.writeFileSync('endis.txt',JSON.stringify(en))
})



app.get('/nametitle',(req,res)=>{
    let en=JSON.parse(fs.readFileSync('endis.txt','utf-8'))
    let file=JSON.parse(fs.readFileSync('forms.txt','utf-8'))
    let obj={'title':en[file['curform']]['title'],
        'name':en[file['curform']]['name']
}
res.send(JSON.stringify(obj))
})



app.post('/namesave',(req,res)=>{
    let file=JSON.parse(fs.readFileSync('forms.txt','utf-8'))
    let n=JSON.parse(fs.readFileSync('names.txt','utf-8'))
    x=file['curres']
    file['curres']+=1
    fs.writeFileSync('forms.txt',JSON.stringify(file))
    let obj={[x]:req.body}
    Object.assign(n,obj)
    fs.writeFileSync('names.txt',JSON.stringify(n))
})


app.get('/view',(req,res)=>{
    res.send(fs.readFileSync('view.html','utf-8'))
})

app.listen(80,()=>{console.log('server started')})


 function random(){
    char='qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789'
    let res=''
    for(i=0;i<6;i++){
        res+=char[Math.floor(Math.random()*char.length)]
    }
    return res
}


function check(x,id){
    key=Object.keys(x)
    for(i in key){
        if(x[key[id]]){
            return true
        }
    }
    return false

}


 function addname( mbody,id){
    p=random()
    let date=new Date()
    console.log(p)
    let title=mbody.title
    let n=mbody.name
    let endis={[id]:{pass:p,status:'enable',title:title,name:n,dt:date.toLocaleString()}}
    en=JSON.parse(fs.readFileSync('endis.txt','utf-8'))
    Object.assign(endis,en)
    fs.writeFileSync('endis.txt',JSON.stringify(endis))
    

}


function checkid(arr,id){
    for(i in arr){
        if(arr[i]==id){
            return true
        }
    }
    return false
}

function datetime(){
    let d= new Date()
    return d.toLocaleString()
}

async function addtime(body,id){
    let forms=JSON.parse(fs.readFileSync('endis.txt','utf-8'))
    let keys=Object.keys(body)
    for(i in keys){
        if(keys[i]=='time'){
            obj={time:body['time']}
            Object.assign(forms[id],obj)
            fs.writeFileSync('endis.txt',JSON.stringify(forms))
            return
        }
    }
    obj={time:'no'}
    Object.assign(forms[id],obj)
    fs.writeFileSync('endis.txt',JSON.stringify(forms))
}