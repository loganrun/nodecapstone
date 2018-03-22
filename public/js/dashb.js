'use strict';
$(function(){
   let token = window.localStorage.getItem('token');
   if(!token){
       //.append(not logged in)
       
   }else{
       $.ajax({
      method: 'GET',
      contentType: 'application/json',
      processData: false,
      url: 'https://thinkfulnode-loganrun.c9users.io/api/properties',
      headers: {
         Authorization: 'Bearer ' +token
      }
     
    }).done(function(response){
      console.log(response);
      //let info = response.articles;

    //   $.each(info, (index, item)=>{
    //     let author = item.author;
    //     let desc = item.description;
    //     let title = item.title;
    //     let link = item.url;
    //     let image = item.urlToImage;
    //     console.log(image);
    //     renderArticles(author, desc, title, link, image);
    //   });
    });
       
   }
});