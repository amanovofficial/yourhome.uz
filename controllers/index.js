module.exports.getIndexPage = function(req,res){
    res.render('index',{
        isIndex:true,
        title:'Главная страница'
    })
}