const {Router}=require('express')
const router=Router();

router.get('/',(req,res)=>{
    res.render('index',{
        isIndex:true,
        title:'Главная страница'
    })
})

module.exports=router