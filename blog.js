$(document).ready(function(e) {
    function renderAll (){
        var posts = getAllPublishedPosts();
        var published_posts = posts.sortBy(function(o){ return new Date(o.publish_date) }).reverse();
        renderPosts("#blog_container", "#blog_template", published_posts);
        load_more(1);
        
        $('#load_more_posts').click(function(e){
            var i = $('#num_loaded').val();
            load_more(i);
            e.preventDefault();
        });
    }

    loadMallDataCached(renderAll); 
})

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
        var lb = getBlogDataBySlug("stc-lookbook");
        var contest = getBlogDataBySlug("stc-contest");
        var out_blog = lb.posts.concat(contest.posts);
        var id = val.id;
        var result = $.grep(out_blog, function(e){ return e.id == id; });
        if(result.length > 0){
            val.slug = val.video_link;
        }
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