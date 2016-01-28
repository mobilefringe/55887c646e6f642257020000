

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        console.log(val)
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://assets.codecloudapp.com/sites/56056be06e6f641a1d020000/image/png/1446826281000/stc-logo-holiday-360 copy.png";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        }
        else{
            val.description_short = val.body;
        }
        val.description_short = val.description_short.replace("&amp;", "&");
        val.slug = "posts/" +val.slug;
        
        var date_blog = new Date((val.publish_date + " 05:00:00").replace(/-/g,"/"));
        val.published_on = get_month(date_blog.getMonth()) + " " + date_blog.getDate() + ", " + date_blog.getFullYear();
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter+1;
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}



function load_more(num){
    var n = parseInt(num);
    for(i=n; i < n+5; i++){
        
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    if(i >= getAllPublishedPosts().length+1){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}