var petname = $.cookie('petname')

$('.navbar .dropdown-menu li').last().click(function(){
    $.post('/user/signout', null, function(res){
        if(res.code == 'success'){
            location.href = '/user/signin'
        }
    })
})

$('.questions').delegate('[question]', 'click', function(){
        $.cookie('question', $(this).attr('question'))
        location.href = '/answer'
})