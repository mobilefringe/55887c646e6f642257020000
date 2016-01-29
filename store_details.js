
    $("#directory_link").addClass("active");
    $(document).ready(function() {
        
        
        function renderPageData(){
            //renders the store list by referencing the template id and the html id
            //for where to place the rendered content. See mallmaverick.js for implementation
            var pathArray = window.location.pathname.split( '/' );
            var slug = pathArray[pathArray.length-1];
            var store_details = getStoreDetailsBySlug(slug);
            // checkErrorPage(store_details);
            var store_promos = getPromotionsForIds(store_details.promotions);
            var jobs = getJobsForIds(store_details.jobs);
            $("#pop-over").hide();
            renderTemplate("#store_title_container","#store_title_template", store_details, "store_details");
            renderTemplate("#store_detail_container","#store_detail_template", store_details, "store_details");
            renderTemplate("#store_hours_container","#store_hours_template", store_details, "hours");
            renderTemplate("#store_detail_container2","#store_detail_template2", store_details, "store_details");
            renderTemplate("#store_detail_container3","#store_detail_template3", store_details, "store_details");
            renderTemplate("#promo_list_container","#promo_list_template", store_promos, "promotions");
            renderTemplate("#job_list_container","#job_list_template", jobs, "jobs");
            renderSVGMap(store_details);
            
        }
        
   
    
    
    
    function renderSVGMap(store_details){
            var isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
            var didPanZoom = false;
            if(navigator.appVersion.indexOf("MSIE 9.") == -1){
                $('#map').bind('mousemove', function(e){
                    //console.log(e.pageX+","+e.pageY);
                   $('#pop-over').css({'top':e.pageY+20,'left':e.pageX-70});
                });
                var s = Snap("#map");
                var store_svg_id = null;
                if(store_details.svgmap_region != null && typeof(store_details.svgmap_region)  != 'undefined'){
                    store_svg_id = "#"+ store_details.svgmap_region;
                }
                var stores = getStoresList();
                Snap.load(getSVGMapURL(), function (f) {
                    if(store_svg_id!=null){
                        f.select(store_svg_id).addClass("map-mouse-over");
                        console.log(store_svg_id)
                        
                    }
                    $.each( stores, function( key, value ) {
                        if(value.svgmap_region != null && typeof(value.svgmap_region)  != 'undefined'){
                            var svg_id = "#" + value.svgmap_region;
                            f.select(svg_id).mouseover(function() {
                                if(typeof(value) != 'undefined' && value != null){
                                    this.addClass("map-mouse-over");
                                    $("#pop-over").show();
                                    $("#pop-over-map-name").html(value.name);
                                    $("#pop-over-map-phone").html(value.phone);
                                }
                                          
                            });
                                
                            //add the mouse up handler for hiding the pop over when done hovering
                            
                                f.select(svg_id).mouseout(function() {
                                    if (svg_id != store_svg_id) {
                                        this.removeClass("map-mouse-over");    
                                    }
                                    
                                    $("#pop-over").hide(0);
                                    
                                });
                                    
                            
                            
                            //add the mouse up function for when the user clicks a store
                            f.select(svg_id).mouseup(function() {
                                
                                if(!isMobile && !didPanZoom){
                                    
                                    goToStore(value);
                                }
                                didPanZoom = false;
                                      
                            });
                        }
                    });
                    s.append(f.select("svg"));
                    
                    
                    
                });
                
                var startingMapTransform = 'scale(1.05)';
                var startingPanX = -120;
                var startingPanY = -100;
                if(isMobile) {
                        startingMapTransform = 'scale(0.5)';
                        startingPanX = -170;
                        startingPanY = -200;
                }
                $('#loading').hide();
                $( "#page_content" ).fadeIn( "fast", function() {
                    var panzoom = $(".panzoom-elements").panzoom({
                        cursor: "move",
                        increment: 0.15,
                        minScale: 0.15,
                        maxScale: 20,
                        transition: true,
                        duration: 150,
                        easing: "ease-in-out",
                        $zoomIn: $('.zoom-in'),
                        $zoomOut: $('.zoom-out'),
                        $zoomRange: $('.zoom-range'),
                        startTransform: startingMapTransform
            
                    });
                    $(".panzoom-elements").panzoom("pan", startingPanX, startingPanY, { relative: true });
                    
                    panzoom.on('panzoomchange', function(e, panzoom, matrix, changed) {
                      didPanZoom = true;
                    });
                    
                    panzoom.on('panzoomend', function(e, panzoom, matrix, changed) {
                      didPanZoom = false;
                    });
                });
            }else{
                $('#loading').hide();
                $('#zControls').hide();
                $('#map').hide();
                $( "#page_content" ).fadeIn( "fast");
            }
        }
    function goToStore(store_details){
        if(typeof(store_details) != 'undefined' && store_details != null){
            window.location.href = "/stores/"+store_details.slug;
        }
    }
        
        loadMallData(renderPageData);
        
        function renderTemplate(container, template, collection, type){
            var item_list = [];
            var item_rendered = [];
            var template_html = $(template).html();
            Mustache.parse(template_html);   // optional, speeds up future uses
            if (type == "store_details"){
                item_list.push(collection)
                $.each( item_list , function( key, val ) {
     
                    if (val.phone){
                        $("#phone_label").show();
                    }else {
                        $("#phone_label").hide();
                    }
                    if (val.email){
                        $("#email_label").show();
                    } else {
                         $("#email_label").hide();
                    }
                    if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
                        val.alt_store_front_url = "http://kodekloud.s3.amazonaws.com/sites/54cfabe36e6f641f2e010000/e3caeac24db5ab4cc9a8679e6db6392d/VV_default.jpg"    
                    } else {
                        val.alt_store_front_url = getImageURL(val.store_front_url);    
                    }
                    if (val.gallery){
                        val.alt_gallery_image = getImageURL(val.gallery[0]);    
                    }
                    
                    
                    val.hours = (getHoursForIds(val.store_hours))
                    
                    var rendered = Mustache.render(template_html,val);
                    item_rendered.push(rendered);
                });
            }else if (type == "hours"){
                hours = getHoursForIds(collection.store_hours)
                $('#hours_header').hide()
                $.each( hours , function( key, val ) {
                    switch(val.day_of_week) {
                        case 0:
                            val.day = "Sunday"
                            break;
                        case 1:
                            val.day = "Monday"
                            break;
                        case 2:
                            val.day = "Tuesday"
                            break;
                        case 3:
                            val.day = "Wednesday"
                            break;
                        case 4:
                            val.day = "Thursday"
                            break;
                        case 5:
                            val.day = "Friday"
                            break;
                        case 6:
                            val.day = "Saturday"
                            break;
                        
                    }
                    var open_time = new Date (val.open_time)
                    var close_time = new Date (val.close_time)
                    val.open_time = convert_hour(open_time);
                    val.close_time = convert_hour(close_time);
                    var rendered = Mustache.render(template_html,val);
                    item_rendered.push(rendered);
                    
                });
            }else {
                $.each( collection , function( key, val ) {
                    // if (type == "store_details"){
                    //     val.alt_store_front_url = getImageURL(val.store_front_url);    
                    // }
                    if (type == "promotions"){
                        if ((val.promo_image_url).indexOf('missing.png') > -1){
                            var pathArray = window.location.pathname.split( '/' );
                            var slug = pathArray[pathArray.length-1];
                            var store_details = getStoreDetailsBySlug(slug);
                            val.alt_promo_image_url = getImageURL(store_details.store_front_url);
                        } else {
                            val.alt_promo_image_url = getImageURL(val.promo_image_url);
                        }
                        
                        start = new Date (val.start_date);
                        end = new Date (val.end_date);
                        start.setDate(start.getDate()+1);
                        end.setDate(end.getDate()+1);
                
                        if (start.toDateString() == end.toDateString()) {
                            val.start_month = get_month(start.getMonth())
                            val.start_day = start.getDate()
                            
                            val.date_string = val.start_month + " " + val.start_day
                            
                            
                        } else {
                            val.start_month =get_month(start.getMonth())
                            val.start_day = start.getDate() 
                            val.end_month = get_month(end.getMonth())
                            val.end_day = end.getDate()
                            val.date_string = val.start_month + " " + val.start_day + ' - ' + val.end_month + " " + val.end_day
                        }
                        console.log(val)   
                        $("#promo_header").show();   
                        
                    }
                    if (type == "jobs") {
                        var pathArray = window.location.pathname.split( '/' );
                        var slug = pathArray[pathArray.length-1];
                        var store_details = getStoreDetailsBySlug(slug);
                        val.image_url = getImageURL(store_details.store_front_url);
                        $("#job_header").show();  
                    }
                     start = new Date (val.start_date);
                        end = new Date (val.end_date);
                        start.setDate(start.getDate()+1);
                        end.setDate(end.getDate()+1);
                
                        if (start.toDateString() == end.toDateString()) {
                            val.start_month = get_month(start.getMonth())
                            val.start_day = start.getDate()
                            
                            val.date_string = val.start_month + " " + val.start_day
                            
                            
                        } else {
                            val.start_month =get_month(start.getMonth())
                            val.start_day = start.getDate() 
                            val.end_month = get_month(end.getMonth())
                            val.end_day = end.getDate()
                            val.date_string = val.start_month + " " + val.start_day + ' - ' + val.end_month + " " + val.end_day
                        }
                    var rendered = Mustache.render(template_html,val);
                    item_rendered.push(rendered);
                    
                    
                });
            }
            
            $(container).show();
            $(container).html(item_rendered.join(''));
            if (type == "store_details"){
                if (collection.website != ""){
                        $("#store_website_link").show();
                }
            }
            
        }
        
        
        
        function convert_hour(d){
            var h = addZero(d.getUTCHours());
            var m = addZero(d.getUTCMinutes());
            var s = addZero(d.getUTCSeconds());
            if (h >= 12) {
                if ( h != 12) {
                    h = h - 12;    
                }
                
                i = "PM"
            } else {
                i = "AM"
            }
            return h+":"+m+" "+i;
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
                    month = "Jan"
                    break;
                case 1:
                    month = "Feb"
                    break;
                case 2:
                    month = "Mar"
                    break;
                case 3:
                    month = "Apr"
                    break;
                case 4:
                    month = "May"
                    break;
                case 5:
                    month = "Jun"
                    break;
                case 6:
                    month = "Jul"
                    break;
                case 7:
                    month = "Aug"
                    break;
                case 8:
                    month = "Sep"
                    break;
                case 9:
                    month = "Oct"
                    break;
                case 10:
                    month = "Nov"
                    break;
                case 11:
                    month = "Dec"
                    break;
                    
            }
            return month;
        }


        
        
    });
    
    