$("#directory_link").addClass("active");
$(document).ready(function() {
function renderAll(){
    var stores = getStoresList();
    var category_stores = getStoresListByCategory();
    var categories = getStoreCategories();
    renderPageData('#store_list_container','#store_list_template', stores, "stores");
    // renderPageData('#categories_container', '#categories_list_template', categories, "categories");
    render_categories(categories);
    render_category_stores();    
    $("#loading_screen").hide();
    $("#main_content").show();
    renderSVGMap();
    
    
    $('.show_cat_stores').click(function(e){
        var cat_id = $(this).attr('data-id');
        var rows = $('.cats_row');
        rows.hide();
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        $.each(rows, function(i, val){
            var cat_array = val.getAttribute('data-cat').split(',');
            if ($.inArray(cat_id, cat_array) >= 0){
                $(val).show();
            }
        });
        $('html,body').animate( { scrollTop:$('#store_list').offset().top } , 500);
        e.preventDefault();
    });
    $('#show_all_stores').click(function(e){
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.show();
        $('html,body').animate( { scrollTop:$('#store_list').offset().top } , 500);
        e.preventDefault();
    });
}




function renderSVGMap(){
    var isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
    var didPanZoom = false;
    if(navigator.appVersion.indexOf("MSIE 9.") == -1){
        $('#map').bind('mousemove', function(e){
            //console.log(e.pageX+","+e.pageY);
           $('#pop-over').css({'top':e.pageY+20,'left':e.pageX-70});
        });
        var s = Snap("#map");
        var stores = getStoresList();
        console.log (getSVGMapURL())
        Snap.load(getSVGMapURL(), function (f) {
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
                        this.removeClass("map-mouse-over");
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
        var startingMapTransform = 'scale(0.35)';
        var startingPanX =-250;
        var startingPanY = -300;
        if(isMobile) {
                startingMapTransform = 'scale(0.3)';
                startingPanX = -140;
                startingPanY = -140;
        }
            // $('#loading').hide();
            $( "#page_content" ).fadeIn( "fast", function() {
                var panzoom = $(".panzoom-elements").panzoom({
                    cursor: "move",
                    increment: 0.5,
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

function getSVGMapURL(){
    initData();
    var mallDataJSON = JSON.parse(sessionStorage.mallData);
    return 'http://cdn.mallmaverick.com' + mallDataJSON.property.svgmap_url;
}


function render_categories(categories){
    $.each( categories , function( key, val ) {
        $("#categories_container").append('<a href="#" data-id="'+ val.id + '" class="btn btn-primary show_cat_stores">'+val.name+'</a>');
    });
};
function renderPageData(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (type == "stores" || type == "category_stores"){
            if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
                    val.alt_store_front_url = "http://kodekloud.s3.amazonaws.com/sites/54cfabe36e6f641f2e010000/e3caeac24db5ab4cc9a8679e6db6392d/VV_default.jpg"    
            } else {
                val.alt_store_front_url = getImageURL(val.store_front_url);    
            }
        }
        val.cat_list = val.categories.join(',')
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
};


function render_category_stores(){
    
    var category_stores = [];
    var item_rendered = [];
    var all_stores = getStoresList();
    var all_categories = getStoreCategories();
    var test = []
    var template_html = $("#category_store_list_template").html();
    Mustache.parse(template_html);
    for (i = 0; i < all_categories.length; i++) {
        var stores_per_cat = [];
        for (j = 0; j < all_stores.length; j++) {
            if($.inArray(parseInt(all_categories[i].id), all_stores[j].categories) > -1){
                all_stores[j].cat_name = all_categories[i].name;
                category_stores.push(all_stores[j]);
                stores_per_cat.push(all_stores[j]);
            }
        
        }
        var rendered = Mustache.render(template_html,all_categories[i]);
        item_rendered.push(rendered);
    }
    $("#store_category_list_container").show();
    $("#store_category_list_container").html(item_rendered.join(''));
    for (i = 0; i < all_categories.length; i++) {
        var stores_per_cat = [];
        for (j = 0; j < all_stores.length; j++) {
            if($.inArray(parseInt(all_categories[i].id), all_stores[j].categories) > -1){
                all_stores[j].cat_name = all_categories[i].name;
                all_stores[j].alt_store_front_url = getImageURL(all_stores[j].store_front_url);    
                populate_stores_for_cat(all_categories[i].id, all_stores[j]);
            }
        
        }
    }
    
};

function populate_stores_for_cat (categoryid, store){
    // console.log (categoryid);
    // console.log(store);
    $('#cat'+ categoryid).append('<section class="service_teasers" id="store_for_'+store.id+'"><div class="service_teaser"><div class="row"><div class="service_photo col-sm-4 col-md-4"><a href="../stores/'+store.slug+'"> <figure style="background-image:url('+store.alt_store_front_url+')"></figure></a></div><div class="service_details col-sm-8 col-md-8"><h2 class="section_header skincolored"><b><a href="../stores/'+store.slug+'">'+store.name+'</a></b></h2><p>'+store.description+'</p><span><p class="pull-left"><i class="fa fa-phone"></i><a href="tel:'+store.phone+'">  '+store.phone+'</a></p><a href="../stores/'+store.slug+'" class="btn btn-primary pull-right">view detail</a></div></div></div></div></section>');    }

    loadMallData(renderAll);  


});

function show_cat(link, type){

    if (type == "all"){
        $("#store_list_container").show();
        $(".cat_list_div").hide();    
    } else {
        $("#store_list_container").hide();
        $(".cat_list_div").hide();
        $("#"+link.id).show();    
    }

    
}



// hide #back-top first
$("#back-top").hide();

// fade in #back-top
$(function () {
	$(window).scroll(function () {
	    if ($(this).scrollTop() > 300) {
			$('#back-top').fadeIn();
		} else {
			$('#back-top').fadeOut();
		}
	});

	// scroll body to 0px on click
	$('#back-top img').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});
});