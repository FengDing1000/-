var petname = $.cookie('petname')

// if(petname){
//     $('#user').find('span').last().text(petname)
// }
// else{
//     $('#user').find('span').last().text('登录').end().end().removeAttr('data-toggle').click(function(){
//         location.href = 'signin.html'
//     })
// }

// $('#ask').click(function(){
//     if(petname){
//         location.href = 'ask.html'
//     }
//     else{
//         location.href = 'signin.html'
//     }
// })

$('.navbar .dropdown-menu li').last().click(function(){
    $.get('/user/signout', null, function(res){
        if(res.code == 'success'){
            location.href = '/'
        }
    })
})

$('.questions').delegate('[question]', 'click', function(){
    if(petname){
        $.cookie('question', $(this).attr('question'))
        location.href = 'answer.html'
    }
    else{
        location.href = 'signin.html'
    }
})