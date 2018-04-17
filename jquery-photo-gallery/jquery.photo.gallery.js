/*
 * AppGo使用的 图片查看插件
 * Author : lufeng@bingosoft.net
 * Version: 1.0.0
 * Date : 2015/11/17
 */
(function($) {

var windowMargin = 8; //加多边距的宽高，使得图片看起来有边框效果
  
//图片查看器
$.fn.extend({
  	
	photoGallery: function(options) {

		var isFirefox = navigator.userAgent.indexOf("Firefox") > -1 ;
		var MOUSEWHEEL_EVENT = isFirefox ? "DOMMouseScroll" : "mousewheel";
		var defaults = {
      		//图片缩放倍率
 	 		ratio : 1.2, 
 	 		//右下角缩略图宽度
 	 		thumbnailsWidth : 180, 
			//右下角缩略图高度
 	 	 	thumbnailsHeight : 120, 
 	 	 	//HTML模版
 	 	 	template : {
	 	 	 	//操作工具
	 	 	 	OPERTATION : '<div class="oper">' +
								'<span class="prev"><i class="icon_tool-prev"></i></span>' +
								'<span class="next"><i class="icon_tool-next"></i></span>' +
							 '</div>' +
							 '<div class="tool">' +
							 	'<div class="toolct">' +
								 	'<span class="oper_fullscreen" title="查看全屏"><i class="icon_tool-fullscreen"></i></span>' +
									'<span class="oper_bigger" title="放大图片"><i class="icon_tool-bigger"></i></span>' +
									'<span class="oper_smaller" title="缩小图片"><i class="icon_tool-smaller"></i></span>' +
									'<span class="oper_rotate_left" title="向左旋转"><i class="icon_tool-rotate_left"></i></span>' +
                  '<span class="oper_rotate_right" title="向右旋转"><i class="icon_tool-rotate_right"></i></span>' +
				     				'<span class="oper_download" title="下载图片"><i class="icon_tool-download"></i></span>' +
								'</div>' +
							 '</div>',
				//缩略图
				THUMBNAILS : "<div class='thumbnails'>" +
				  		  	 	'<span class="thumbClose" title="关闭缩略图"><i class="icon_close-small"></i></span>' +
				  		  		'<img ondragstart="return false;"/>' +
				  		  		'<div class="thumbDrag"><span></span></div>' +
				  		 	 "</div>",
				//大图
				IMAGE : '<img class="image" ondragstart="return false;"/>' 	 	 	
 	 	 	}
		};
      
		var o = $.extend(defaults, options),
        	$gallery = $(this);
      	$gallery.append(o.template.OPERTATION).append(o.template.THUMBNAILS);    

      	var $tool = $(this).find(".tool"),
			$fullscreen = $(this).find(".oper_fullscreen"),
			$bigger = $(this).find(".oper_bigger"),
			$smaller =  $(this).find(".oper_smaller"),
			$rotate_left = $(this).find(".oper_rotate_left"),
      $rotate_right = $(this).find(".oper_rotate_right"),
			$download = $(this).find(".oper_download"),
			$prev = $(this).find(".prev"),
			$next = $(this).find(".next"),
			$thumbnails = $(this).find(".thumbnails"),
			$image,
			$thumbImg,
			imageWidth,
			imageHeight,
			imgRatio,
			dragX,
			dragY,
			cW,
			cH,
			w,h,isVertical,
			thumbX,
			thumbY;

		//上一张
		$prev.on('click',function(){
      		if(o.activeIndex > 0) o.activeIndex--;
  			toggleImage();	
      	}).on("mouseover",function(e){
      		if(o.activeIndex > 0)
  	   			$(this).addClass("active");
  	  	}).on("mouseout",function(e){
  			$(this).removeClass("active"); 
  	  	});	 
  	  
  	  	//下一张
      	$next.on('click',function(){
      		if(o.activeIndex < o.imgs.length -1) o.activeIndex++;
      		toggleImage();
      	}).on("mouseover",function(e){
      		if(o.activeIndex < o.imgs.length -1)
  	   			$(this).addClass("active");
  	 	}).on("mouseout",function(e){
  	  		$(this).removeClass("active"); 
  	  	});
       
  	  	//缩略图
      	$thumbnails.css({
			height: o.thumbnailsHeight,
			width : o.thumbnailsWidth
	  	}).on("mouseenter",function(e){
  			thumbX = -1;
  	 	}).on("mousedown",function(e){
  	 		thumbX=e.pageX || e.clientX;
			thumbY=e.pageY || e.clientY;

			cW = document.body.clientWidth;
			cH = document.body.clientHeight;
  	  		e.stopPropagation(); 
  		}).on("mousemove",function(e){
  	  		if(thumbX > 0){
	   	  		var nextDragX=e.pageX || e.clientX;
				var nextDragY=e.pageY || e.clientY;
				var $td= $(this).find(".thumbDrag"),
			    	imageWidth = $image.width(),
					imageHeight = $image.height(),
					thumbImgWidth = $thumbImg.width(),
					thumbImgHeight = $thumbImg.height(),
					left =parseFloat($td.css("left")) +  (nextDragX - thumbX),
					top =parseFloat($td.css("top")) + (nextDragY - thumbY),
					w = $td.width(),
					h = $td.height(),
					it,
					il,
					maxL,
					maxT;
			
				if(isVertical){
					thumbImgWidth = [thumbImgHeight, thumbImgHeight = thumbImgWidth][0];
					imageWidth = [imageHeight, imageHeight = imageWidth][0];
				}
				it = (o.thumbnailsHeight - thumbImgHeight) / 2 ,
				il = (o.thumbnailsWidth - thumbImgWidth) / 2,
				maxL = o.thumbnailsWidth - w - il - 2, //减去2像素边框部分
				maxT = o.thumbnailsHeight - h - it - 2;
				
				if(left < il ) left = il;
				else if(left > maxL) left = maxL;
			
				if(top < it ) top = it;
				else if(top > maxT) top = maxT;
				
				$td.css({
					left : left,
					top : top
				})
				thumbX=nextDragX;
				thumbY=nextDragY; 	  

				if(imageWidth < cW) left = (cW - imageWidth) / 2;
				else left = -imageWidth * (left-il) / thumbImgWidth;
			 
				if(imageHeight < cH ) top = (cH - imageHeight) / 2;
				else top = -imageHeight * (top-it) / thumbImgHeight;
			
				$image.offset({
					left : left,
					top : top
				});
  	  		}
  	 	}).on("mouseup",function(e){
  	  		thumbX = -1;
  	 	});
				  	 
	 	$thumbnails.find(".thumbClose").on("click",function(){
	  		$thumbnails.hide();
	  	});
    	  
      	//显示工具栏
  	  	$gallery.on("mouseover",function(e){
  	  		$tool.show();
  	  	
  	  	}).on("mouseenter",function(e){
			dragX = -1;
		}).on("mouseout",function(e){
			$tool.hide();
		}).on("mousedown",function(e){
  	 		dragX=e.pageX || e.clientX;
			dragY=e.pageY || e.clientY;

			cW = document.body.clientWidth;
			cH = document.body.clientHeight;
  	  		e.stopPropagation(); 
  	  	}).on("mousemove",function(e){
  	  		if(dragX > 0){
	   	  		var nextDragX=e.pageX || e.clientX;
				var nextDragY=e.pageY || e.clientY ;
				var o = $image.offset(),
					left =o.left +  (nextDragX - dragX),
					top =o.top + (nextDragY - dragY),
					w = $image.width(),
					h = $image.height();
			
				if(isVertical){
					w = [h, h = w][0];
				}
				if(w > cW){
					if(left > 0){
						left = 0 ;
					}
					else if(left < cW - w){
						left = cW - w;
					}
				}else{
					left = o.left;
				}
				if(h > cH){
					if(top > 0){
						top = 0 ;
					}
					else if(top < cH - h){
						top = cH - h;
					} 
				} else{
					top = o.top;
				}	
			
				$image.offset({
					left : left,
					top : top
				});
				dragX=nextDragX;
				dragY=nextDragY; 	  
				setThumbnails(); //缩略图拖拽点
  	  		}
  	 	}).on("mouseup",function(e){
  	  		dragX = -1;
  	  	});
  	    	  
  	  	//全屏
		var isMax,preWidth, preHeight, preTop, preLeft;
  	 	$fullscreen.on("click", function(){
			var parentD = window.parent.document,
				J = $(parentD.getElementById("J_pg"));
			if(!isMax){
				isMax = true;
				preWidth = document.body.clientWidth;
				preHeight = document.body.clientHeight;
				preTop = J.css("top");
				preLeft = J.css("left");
				J.css({
					top: 0,
					left : 0,
					width : parentD.body.clientWidth,
					height : parentD.body.clientHeight,
				});
			} else{
				isMax = false;
				J.css({
					top: preTop,
					left : preLeft,
					width : preWidth,
					height : preHeight
				});
			}
  	  	});
  	  
  	  	//放大图片
  	  	$bigger.on("click", function(){
  	  		biggerImage();
  	  	});
  	  
  	  	//缩小图片
  	 	$smaller.on("click", function(){
			smallerImage();
  	  	});
  	  
      //左旋转
      $rotate_left.on("click", function(){
        
        var rotateClass = $image.attr("class").match(/(rotate)(-?)(\d*)/);
        // 是否已经进行了旋转，是则计算周期，继续旋转
        if(rotateClass){
          // 如果不存在-号，则为右旋转转左旋转，要顺接右旋转状态
          if (!rotateClass[2]) {
            rotateClass[3] = parseInt(rotateClass[3]) + 180
          }
          var nextDeg = (rotateClass[3] * 1 + 90) % 360;
      $image.removeClass(rotateClass[0]).addClass("rotate-" + nextDeg);
          $thumbImg.removeClass(rotateClass[0]).addClass("rotate-" + nextDeg);
          resizeImage(nextDeg);
          resizeThumbImg(nextDeg);
          isVertical = nextDeg == 90 || nextDeg == 270;
        } else{   // 否则添加一个初始旋转的rotate
          $image.addClass("rotate-90");
          $thumbImg.addClass("rotate-90");
          resizeImage("90");
          resizeThumbImg("90");
          isVertical = true;
        }
      });

      //右旋转
      $rotate_right.on("click", function(){

        var rotateClass = $image.attr("class").match(/(rotate)(-?)(\d*)/);
        if(rotateClass){
          // 如果存在-号，则为左旋转转右旋转，要顺接左旋转状态
          if (rotateClass[2]) {
            rotateClass[3] -= 180 
          }
          var nextDeg = (rotateClass[3] * 1 + 90) % 360;
      $image.removeClass(rotateClass[0]).addClass("rotate" + nextDeg);
          $thumbImg.removeClass(rotateClass[0]).addClass("rotate" + nextDeg);
          // nextDeg取绝对值，防止左旋转然后右旋转顺接时， nextDeg为负数的情况
          nextDeg = Math.abs(nextDeg)
          resizeImage(nextDeg);
          resizeThumbImg(nextDeg);
          isVertical = nextDeg == 90 || nextDeg == 270;
        } else{
          $image.addClass("rotate90");
          $thumbImg.addClass("rotate90");
          resizeImage("90");
          resizeThumbImg("90");
          isVertical = true;
        }
      });


  	  	//下载
  	 	$download.on("click", function(){
  	  		var imgUrl = $image.attr("src");
  	   		if(!imgUrl) return;
			alert("没有找到兼容所有浏览器方法，所以暂不实现");
  	  	});
  	  
	  	$(window).on("resize",function(){
	  		setImagePosition();
	  	});
		
		if(document.attachEvent){
			document.attachEvent("on"+MOUSEWHEEL_EVENT, function(e){
				mouseWheelScroll(e);
			});
		} else if(document.addEventListener){
			document.addEventListener(MOUSEWHEEL_EVENT, function(e){
				mouseWheelScroll(e);
			}, false);
		}	
		
		function mouseWheelScroll(e){
			var _delta = parseInt(e.wheelDelta || -e.detail);
	    	//向上滚动
	  		if (_delta > 0) {
        		biggerImage();
        	}
        	//向下滚动
        	else {
            	smallerImage();
        	}
		}
		
	  	//键盘左右键
	  	document.onkeydown = function(e){

	  		e = e || window.event;
	  		if (e.keyCode) {
			   	if(e.keyCode == 37 ){ //left
			    	if(o.activeIndex > 0) o.activeIndex--;
			  		toggleImage();	
			   	}
		  	   	if(e.keyCode == 39 ){ //right
		        	if(o.activeIndex < o.imgs.length -1) o.activeIndex++;
	      			toggleImage();
			   	}
			}
	 	};
		
	  	function init(){
  	    	toggleImage();
  	    
  	    	$(o.imgs).each(function(i, img){
	  	    	$(o.template.IMAGE)
	  	    		.appendTo($gallery)
	  	    		.attr("src", img.url)
	  	    		.attr("index", i)
	  	    		.css({
				  	 	width : img.imgWidth,
				  	 	height : img.imgHeight,
				  	 	left : (cW - img.imgWidth)/2,
				  	 	top: (cH - img.imgHeight)/2
			  	}).on("dblclick", function(){
				  	app.window.close();
				}); ;
	  	    });
  	    	$image = $(".image[index='"+o.activeIndex+"']", $gallery).addClass("active");
	  	}
	  
	  	function toggleImage(){
	    	imageWidth = o.imgs[o.activeIndex].imgWidth;
       		imageHeight = o.imgs[o.activeIndex].imgHeight;
       		imgRatio = imageWidth/ imageHeight;
        	cW = document.body.clientWidth;
			cH = document.body.clientHeight;
			$(".image", $gallery).removeClass("active");
			$image = $(".image[index='"+o.activeIndex+"']", $gallery).addClass("active").css({
				width : imageWidth,
				height : imageHeight
			}).removeClass("rotate0 rotate90 rotate180 rotate270");
	  		$thumbImg = $thumbnails.find("img").attr("src", o.imgs[o.activeIndex].url);	
	  		$thumbnails.find("img").removeAttr("class").removeAttr("style");
	  		isVertical = false;
	  		$thumbnails.hide();
	  		$prev.removeClass("active");
	  		$next.removeClass("active");
	  		setImagePosition();
	  	}	
	  
	 
	  	function biggerImage(){
  			var w = $image.width(),
  	  	 		h = $image.height(),
  	  	 		nextW = w * o.ratio,
  	  	 		nextH = h * o.ratio;
		 	if(nextW - w < 1) nextW = Math.ceil(nextW);
  	  	 	var percent =  (nextW / imageWidth * 100).toFixed(0) ;
  	  	 	if(percent > 90 && percent < 110){
  	  	 		percent = 100;
  	  	 		nextW = imageWidth;
  	  	 		nextH = imageHeight;
  	  		}
  	  	 	else if(percent > 1600) {
  	  	 		percent = 1600;
  	  	 		nextW = imageWidth * 16;
  	  	 		nextH = imageHeight * 16; 
  	  	 	}

  	  	 	$image.width(nextW).height(nextH);
  	  	 	setImagePosition();
  	  	 	showPercentTip(percent);
  	  	 	showThumbnails(nextW, nextH);
	  	}
	  
	  	function smallerImage(){
	  		var w = $image.width(),
  	  	 		h = $image.height(),
  	  	 		nextW,
  	  	 		nextH;
  	  	 	var percent =  (w / o.ratio / imageWidth * 100).toFixed(0) ;
  	  	 	if(percent < 5) {
  	 			percent = 5;
  	  	 		nextW = imageWidth / 20;
  	  	 		nextH = imageHeight / 20;
  	  	 	}
  	  	 	else if(percent > 90 && percent < 110){
  	  	 		percent = 100;
   	  	 		nextW = imageWidth;
  	  	 		nextH = imageHeight;
  	  	 	} else{
  	  	 		nextW = w / o.ratio;
  	  	 		nextH = h / o.ratio; 
  	  	 	}
  	  	 
  	  	 	$image.width(nextW).height(nextH);
  	  	 	setImagePosition();
  	  	 	showPercentTip(percent);
  	  	 	showThumbnails(nextW, nextH);
	  	}
	  
	  	//显示缩略图
	  	function showThumbnails(width, height){
	  		if(isVertical) width = [height, height = width][0];
	  		if(width > document.body.clientWidth || height > document.body.clientHeight){
	  			$thumbnails.show();
	  			setThumbnails();
	  		} else{
	  			$thumbnails.hide();
	  		}	  
	  	}
	  
	  	//重置图片宽高
	  	function resizeImage(rotateDeg){
	  	
	  		var mH = document.body.clientHeight - windowMargin,
  	  			mW = document.body.clientWidth - windowMargin;
	  		if(rotateDeg == '90' || rotateDeg == '270'){
	  			mW = [mH, mH = mW][0];
	  		}

	  		var width, height;
	  		width = Math.min(imageWidth, mW);
	  		height = Math.min(imageHeight, mH);
		
	  		if(width / height > imgRatio){
	  			width = height * imgRatio;
	  		} else{
	  			height = width / imgRatio;
	  		}

	  		$image.css({
				width:width,
				height:height
  			});
  			setImagePosition();
	  	}
	  
	  	function resizeThumbImg(rotateDeg){
	  		var maxW = o.thumbnailsWidth, maxH = o.thumbnailsHeight;
	  		if(rotateDeg == '90' || rotateDeg == '270'){
	  			maxW = [maxH, maxH = maxW][0];
	  		}
	  		$thumbImg.css({
	  			maxWidth : maxW,
	  			maxHeight : maxH
	  		});
	  		$thumbnails.hide();
	  	}
	  
	  	//显示百分比提示
	  	function showPercentTip(percent){
	    	$gallery.find(".percentTip").remove();
	  		$("<div class='percentTip'><span>"+percent+"%</span></div>").appendTo($gallery).fadeOut(1500);
	  	}
	  
  	  	//设置图片位置
	  	function setImagePosition(){
	  		var w = $image.width(),
	  	    	h = $image.height(),
  	  			cW = document.body.clientWidth,
  	  			cH = document.body.clientHeight;

  	  		var left = (cW - w)/2,
				top = (cH - h)/2;

  			$image.css("left", left +"px").css("top", top+"px");
	  	}
	  
	  	//设置缩略图拖拽区域
	  	function setThumbnails(){
	  		var $img = $thumbnails.find("img"),
  				sW = $img.width(),
  				sH = $img.height(),
  				w = $image.width(),
  				h =  $image.height(),
  				imf = $image.offset(),
  				imfl = imf.left,
  				imft = imf.top,
  				cW = document.body.clientWidth,
				cH = document.body.clientHeight,
				tW,
				tH,
				tl,
				tt;
	
			if(isVertical){
				sW = [sH, sH = sW][0];
				w = [h, h = w][0];
			}

			tW = sW / (w / cW);
			if(w < cW) tW = sW;
			tH = sH / (h / cH);
			if(h < cH) tH = sH;
			tl = (o.thumbnailsWidth - sW)/2 + -imfl/w * sW ;
			if(w < cW) tl = (o.thumbnailsWidth - sW)/2;
			tt = (o.thumbnailsHeight - sH)/2 + -imft/h * sH ;
			if(h < cH) tt = (o.thumbnailsHeight - sH)/2;
			$thumbnails.find(".thumbDrag").css({
				width: tW,
				height: tH,
				left: tl,
				top: tt
			});
	  	}
	  
  	  	init();
		return this;
	}
});
  
$.extend({
	//打开图片查看器
	openPhotoGallery : function(obj){

		var $img = $(obj),
  			imgUrl = $img[0].src;
		if(!imgUrl) return;

		//HTML5提供了一个新属性naturalWidth/naturalHeight可以直接获取图片的原始宽高
		var img = $img[0],
			imgHeight = img.naturalHeight,
			imgWidth = img.naturalWidth,
			ratio  = imgWidth / imgHeight,
			wH = 415,
			wW = 615,
			winHeight,
			winWidth,
			maxHeight = document.body.clientHeight - windowMargin * 2,
			maxWidth = document.body.clientWidth- windowMargin;
	
		winWidth = Math.max(wW, imgWidth);
		winHeight = Math.max(wH, imgHeight);

		if(winWidth > maxWidth) {
			winWidth = maxWidth;
			winHeight =Math.max(wH, Math.ceil(winWidth / ratio));
			if(imgWidth > winWidth) {
				imgWidth = winWidth;
				imgHeight = Math.ceil(imgWidth / ratio);
			}				
		}
		
		if(winHeight > maxHeight) {
			winHeight = maxHeight;
			winWidth = Math.max(wW, Math.ceil(winHeight * ratio));
			if(imgHeight > winHeight) {
				imgHeight = winHeight;
				imgWidth = Math.ceil(imgHeight * ratio);
			}		 
		}

		var $gallerys = $(obj).closest(".gallerys"),
			activeIndex=0,
			imgs = [];
		$gallerys.find(".gallery-pic").each(function(i, elem){
			var url = this.src,
				img = $(this)[0],
				nH = img.naturalHeight,
				nW = img.naturalWidth,
				ratio  = nW / nH,
				w = nW,
				h = nH;
			if(url == imgUrl){
				activeIndex = i;
				w = imgWidth;
				h = imgHeight;
			} 
			else{
				if(nW > winWidth) {
					w = winWidth;
					nH = h = Math.ceil(w / ratio);
					if( h > winHeight){
						nH = h = winHeight;
						w = Math.ceil(h * ratio);
					}
				}	
				if(nH > winHeight) {
					h = winHeight;
					w = Math.ceil(h * ratio);
					if( w > winWidth){
						w = winWidth;
						h = Math.ceil(w / ratio);
					}
				}	
			}
			imgs.push({
				url: url, 
				imgHeight : h,
				imgWidth : w
			});
		});
		
		localStorage["photoGalleryImgs"] = JSON.stringify(imgs); //因为此字符串可能是base64字符，appgo无法传
		localStorage["photoGalleryActiveIndex"] = activeIndex; 
		
		$("#J_pg").remove();
		$("<iframe></iframe").appendTo("body")
			.attr("id", "J_pg")
			.attr("src", "jquery-photo-gallery/gallery.html")
			.css({
				position : "absolute",
				left : (document.body.clientWidth - winWidth) /2,
				top : (document.body.clientHeight - winHeight) /2,
				width : winWidth,
				height : winHeight,
				background: 'rgba(177, 178, 179, 0.6)',
				border: '1px solid #6D6D6D',
				'border-radius': '4px'
			});
	},
	//做初始化
	initGallery : function(){
 
        var activeIndex = localStorage["photoGalleryActiveIndex"],
        	imgs = JSON.parse(localStorage["photoGalleryImgs"]);
        
		localStorage.removeItem("photoGalleryActiveIndex");
		localStorage.removeItem("photoGalleryImgs");
       
		$(".gallery").photoGallery({
			imgs : imgs,
			activeIndex:activeIndex
		});
		  
		$(".closeWin").click(function(){
			var _parent =  window.parent || window.top,
				_jg = _parent.document.getElementById("J_pg");
				
			$(_jg).remove();
		});
	}
});
  
})(jQuery);
