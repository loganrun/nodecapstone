'use strict';
$(document).ready(() => {
    $('#signupForm').on('submit',(e) =>{
        let passWord = $('#passWord').val();
        let username = $('#username').val();
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let emailAddress = $('#emailAddress').val();
        e.preventDefault();
        console.log(passWord,username, firstName,lastName,emailAddress);
       signUp(passWord,username, firstName,lastName,emailAddress);
        
    });
    
    $('#loginForm').on('submit',(e) =>{
        let passWord = $('#passWord').val();
        let username = $('#username').val();
        e.preventDefault();
        console.log(passWord, username);
       logIn(passWord,username);
        
    });
    
    function signUp(passWord, username,firstName,lastName, emailAddress){
        console.log(passWord,username, firstName,lastName,emailAddress);
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      processData: false,
      url: 'https://thinkfulnode-loganrun.c9users.io/api/users/signup',
      data: JSON.stringify({
        password: passWord,
        username: username,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress
      })

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
  
  function logIn(passWord, username){
        console.log(passWord,username);
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      processData: false,
      url: 'https://thinkfulnode-loganrun.c9users.io/api/auth/login',
      data: JSON.stringify( {
        password: passWord,
        username: username,
      })

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
    window.localStorage.setItem('token', response.authToken);
    window.location = '/dashboard.html';
    });
  }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
});