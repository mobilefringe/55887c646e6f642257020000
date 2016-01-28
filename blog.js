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