const express= require('express');
const router=express.router();

router.use(function timelog(req, res, next){
    next();
});

router.get("/",async (req, res)=>{
    res.send({info:"Olá projeto 2 que vale nota"});
});

module.exports=router