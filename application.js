/*Created 2015-01-15  by Andy*/
function renderLayoutHours(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
        $.each( item_list , function( key, val ) {
            var open_time = new Date (val.open_time);
            var close_time = new Date (val.close_time);
            val.open_time = convert_hour(open_time);
            val.close_time = convert_hour(close_time);    
            val.h = val.open_time+ " - " + val.close_time;
            var rendered = Mustache.render(template_html,val);
            item_rendered.push(rendered);
        });
        $(container).html(item_rendered.join(''));
}


function renderHomeBlog(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "http://cdn.mallmaverick.com/system/sites/logo_images/000/000/049/original/logo.png?1439229969";
        } else {
            val.post_image = val.image_url;
        }
        if(val.body.length > 55){
            val.description_short = val.body.substring(0,55) + "...";
        }
        else{
            val.description_short = val.body;
        }
        val.description_short = val.description_short.replace("&amp;", "&");
        var date_blog = new Date((val.publish_date + " 05:00:00").replace(/-/g,"/"));
        val.published_day = date_blog.getDate();
        val.published_month = get_month(date_blog.getMonth()) ;
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function convert_hour(d){
    var h = (d.getUTCHours());
    var m = addZero(d.getUTCMinutes());
    var s = addZero(d.getUTCSeconds());
    if (h >= 12) {
        if ( h != 12) {
            h = h - 12;    
        }
        
        i = "pm"
    } else {
        i = "am"
    }
    if (m <= 0){
        return h+i;
    }
    else{
        return h+":"+m+i;
    }
}


function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


function get_month (id){
    
    switch(id) {
        case 0:
            month = "Jan";
            break;
        case 1:
            month = "Feb";
            break;
        case 2:
            month = "Mar";
            break;
        case 3:
            month = "Apr";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "Aug";
            break;
        case 8:
            month = "Sep";
            break;
        case 9:
            month = "Oct";
            break;
        case 10:
            month = "Nov";
            break;
        case 11:
            month = "Dec";
            break;
            
    }
    return month;
}