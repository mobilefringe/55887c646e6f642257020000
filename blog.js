

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://cdn.mallmaverick.com/system/sites/logo_images/000/000/049/original/logo.png?1439229969";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 300){
            val.description_short = val.body.substring(0,300) + "...";
        }
        else{
            val.description_short = val.body;
        }
        val.description_short = val.description_short.replace("&amp;", "&");
        val.counter = counter;
        var date_blog = new Date((val.publish_date + " 05:00:00").replace(/-/g,"/"));
        val.published_on = get_month(date_blog.getMonth()) + " " + date_blog.getDate() + ", " + date_blog.getFullYear();
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter+1;
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderBlogs(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPostDetails(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://cdn.mallmaverick.com/system/sites/logo_images/000/000/049/original/logo.png?1439229969";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        }
        else{
            val.description_short = val.body;
        }
        
        if(val.author == "" || val.author == undefined){
            val.author_exists = "display:none;"
        }
        var date_blog = new Date((val.publish_date + " 05:00:00").replace(/-/g,"/"));
        val.published_on = get_month(date_blog.getMonth()) + " " + date_blog.getDate() + ", " + date_blog.getFullYear();
        var next_p = getNextPublishedPostBySlug(val.slug);
        var prev_p = getPrevPublishedPostBySlug(val.slug);
        if (next_p == undefined){
            val.next_post_show = "display:none";
        }
        else{
            val.next_post = next_p.title;
            val.next_slug = next_p.slug;
            val.next_post_show = "display:inline-block";
        }
        if (prev_p == undefined){
            val.prev_post_show = "display:none";
        }
        else{
            val.prev_post = prev_p.title;
            val.prev_slug = prev_p.slug;
            val.prev_post_show = "display:inline-block";
        }
        
        if (val.tag != undefined){
            val.tag_list = val.tag.join(', ');
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
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


