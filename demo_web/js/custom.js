$(document).ready(function () {

var img = null;
// Image

$(document).on('change', '.btn-file :file', function() {
    var input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [label]);
});

$('.btn-file :file').on('fileselect', function(event, label) {
    
    var input = $(this).parents('.input-group').find(':text'),
        log = label;
    
    if( input.length ) {
        input.val(log);
    } else {
        if( log ) alert(log);
    }

});
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#vqa-visual').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}

$("#imgInp").change(function(){
    readURL(this);
});     

var getImg = function () {
    // var formData = $("#formBasic").serialize();
    $.ajax({

        type: 'GET',
        url: 'https://clam.cs.washington.edu/pancake/vqa/img', // your global ip address and port
        cache: false,

        error: function (xhr, status, thrown) {
            alert("There was an error processing this page.");
            console.log(xhr);
            console.log(status);
            console.log(thrown);
            return false;
        },

        success: function (output) {
            console.log(output);
            img = output['id'];
            $('#vqa-visual').attr('src', 'data:image/jpeg;base64,' + output['img']);
        }
    });
}

// Send Image + Question

var formBasic = function () {
    var formData = $("#formBasic").serialize();
    var data = { visual : img,
                 question : $('#vqa-question').val()}
    console.log(data);
    $.ajax({

        type: 'post',
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        url: 'https://clam.cs.washington.edu/pancake/vqa/query', // your global ip address and port

        // error: function () {
        //     alert("There was an error processing this page.");
        //     return false;
        // },

        complete: function (output) {
            console.log(output);
            //console.log(output.responseText);
            var ul = $('<ul></ul>');
            for (i=0; i < output.responseJSON.ans.length; i++)
            { 
                var li = $('<li></li>');
                var span = $('<span></span>');

                span.text(output.responseJSON.ans[i]+' ('+output.responseJSON.val[i]+')');

                li.append(span);
                ul.append(li);
            }

            for (i=0; i < output.responseJSON.att.length; i++)
            {
                var img = $('<img src="'+output.responseJSON.att[i]+'"/>');

                ul.append(img);
            }

            $('#vqa-answer').append(ul);
        }
    });
    return false;
};

$("#basic-img").on("click", function (e) {
    e.preventDefault();
    getImg();
 });

$("#basic-submit").on("click", function (e) {
   e.preventDefault();
   formBasic();
});
});
