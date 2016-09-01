var petname = $.cookie('petname')

if(petname){
    $('#user').find('span').last().text(petname)
}
else{
    $('#user').find('span').last().text('登录').end().end().removeAttr('data-toggle').click(function(){
        location.href = 'signin.html'
    })
}

$('#ask').click(function(){
    if(petname){
        location.href = 'ask.html'
    }
    else{
        location.href = 'signin.html'
    }
})

$('.navbar .dropdown-menu li').last().click(function(){
    $.get('/user/signout', null, function(res){
        if(res.code == 'success'){
            location.href = 'index.html'
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

$.getJSON('/questions', null, function(res){
    var html = ''
    for(var i = 0; i < res.data.length; i++){
        var q = res.data[i]
        html += '<div class="media" question="' + new Date(q.time).getTime() + '">'
        html += '<div class="media-left">'
        html += '<a>'
        html += '<img class="media-object" src="/uploads/' + q.petname + '.jpg" onerror="this.src=\'/images/user.png\'">'
        html += '</a>'
        html += '</div>'
        html += '<div class="media-body">'
        html += '<h4 class="media-heading">' + q.petname + '</h4>'
        html += q.content
        html += '<div class="media-footing">'
        html +=  formatDateTime(new Date(q.time))
        html += '</div>' 
        html += '</div>'
        html += '</div>'
        
        if(q.answers){
            for(var j = 0; j < q.answers.length; j++){
                var a = q.answers[j]
                html += '<div class="media media-child">'
                html += '<div class="media-body">'
                html += '<h4 class="media-heading">' + a.petname + '</h4>'
                html += a.content
                html += '<div class="media-footing">'
                html +=  formatDateTime(new Date(a.time))
                html += '</div>' 
                html += '</div>'
                html += '<div class="media-right">'
                html += '<a>'
                html += '<img class="media-object" src="/uploads/' + a.petname + '.jpg" onerror="this.src=\'/images/user.png\'">'
                html += '</a>'
                html += '</div>'
                html += '</div>'
            }
        }
    }
    
    $('.questions').html(html)
})


function formatDateTime(t){
    var M = t.getMonth() + 1,
        d = t.getDate(),
        h = t.getHours(),
        m = t.getMinutes()

    M = M < 10 ? '0' + M : M
    d = d < 10 ? '0' + d : d
    h = h < 10 ? '0' + h : h
    m = m < 10 ? '0' + m : m
    
    return t.getFullYear() + '-' + M + '-' + d + ' ' + h + ':' + m
}

function formatIP(ip){
    if(ip.startsWith('::1')){
        return '127.0.0.1'
    }
    if(ip.startsWith('::ffff:')){
        return ip.substr(7)
    }
}