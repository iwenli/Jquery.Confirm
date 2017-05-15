/**
 * User:iwenli
 * Date: 2017年5月15日10:31:21
 * 信息提示框插件，依赖Jquery
 */

if (typeof jQuery === 'undefined') {
    throw new Error('jquery-confirm requires jQuery');
}

var jconfirm, Jconfirm;
(function($){
	
	$.alert = function (options) {
		if (typeof options === 'undefined') options = {};
		if (typeof options === 'string') {
            options = {
                content: options
            };
        }
		
	    options['buttons'] = {
            ok: {
            	text: '确定',
                action: function () {
                }
            }
        };
        debugger
	    return jconfirm(options);
    },
   
    $.confirm = function (options) {
		if (typeof options === 'undefined') options = {};
		if (typeof options === 'string') {
            options = {
                content: options
            };
        }

        options = $.extend({}, jconfirm.pluginDefaults, options);
		if (typeof options['buttons'] != 'object')
                options['buttons'] = {};
           
        if (Object.keys(options['buttons']).length == 0) {
            var buttons = {};
            options['buttons'] = $.extend({}, jconfirm.pluginDefaults.defaultButtons);
        }
        return jconfirm(options);
    },
   
    jconfirm = function (options) {
        if (typeof options === 'undefined') options = {};
        options = $.extend({}, jconfirm.pluginDefaults, options);
        var instance = new Jconfirm(options);
        jconfirm.instances.push(instance);
        return instance;
    },
   
	Jconfirm = function(options) {
		$.extend(this, options);
        this._init();
	},
    
    Jconfirm.prototype = {
        _init:function(){
        	var that = this;
        	this._id = Math.round(Math.random() * 99999);
        	that.open();
            /* setTimeout(function () {
                that.open();
            }, 0);*/
        },
        
        open:function(){
        	this._buildHTML();
        	this.setTitle();
        	this.setContent();
        	this._setButtons();
        	this._bindEvents();
        },
        
    	/*创建弹出窗口*/
    	_buildHTML:function() {
    		var that = this;
    		
    		/*初始化之前移除其他弹出框*/
    		$('.dialog-main-div,.dialog-mask-div').remove();
    		
    	    if ($('.dialog-mask-div').length == 0) {
	            that._buildMainDiv();
	        } else {
	            $('.dialog-main-div,.dialog-mask-div').show();
	        }
    	},
    	
	    _buildMainDiv:function () {
	    	$('body').append($('<div class="dialog-mask-div"></div>'))
	    	    .append($('<div class="dialog-main-div"><div class="modal-inner"></div></div>'));
	    	   
	    	/*禁用遮罩层点击事件*/
        	$('.dialog_mask_div').on('touchstart touchmove mousedown mouseout',function(e){
				e.preventDefault();
			});
	    },
    	
	    /*标题显示层*/
	    setTitle:function () {
	        var $title = $('<div class="dialog-title">' + this.title + '</div>');
	        $('.modal-inner').append($title);
	    },
	    
    	/*内容展示层*/
	    setContent:function () {
	        var $content = $('<div class="dialog-content">' + this.content + '</div>');
	        $('.modal-inner').append($content);
	    },
	    
	    /*设置消息提示框按钮*/
	    _setButtons:function () {
	    	var that = this;
            var $mainDiv = $('.dialog-main-div');
            
            var total_buttons = 0;
            var button_index = 0;

            $.each(this.buttons, function (key, button) {
            	total_buttons += 1;
            });
            
            var _buttons = $('<div class="modal-buttons"></div>');

            $.each(this.buttons, function (key, button) {
            	button_index += 1;
            	
                if (typeof button === 'function') {
                    that.buttons[key] = button = {
                        action: button
                    };
                }
                
                that.buttons[key].text = button.text || key;
                that.buttons[key].action = button.action || function () {};
                var button_class_name = (button_index == total_buttons ? 'dialog-button dialog-button-normal' : 'dialog-button');
            	var button_element = $('<span class="' + button_class_name + '">' + that.buttons[key].text + '</span>').click(function (e) {
	                e.preventDefault();
	                var res = that.buttons[key].action.apply(that);
	                that.onAction(key);
	                if (typeof res === 'undefined' || res)
	                    that.close();
		        });
	
		        _buttons.append(button_element);
            });
            
            $mainDiv.append(_buttons);
	    },
	    
	    /*关闭事件*/
	    close: function () {
            var that = this;

            if (typeof that.onClose === 'function')
                that.onClose();

            $('.dialog-main-div,.dialog-mask-div').each(function (index, item) {
	            $(item).empty().hide();
	        });
        },
	 
	     /*事件绑定*/
        _bindEvents:function () {
        	
	    }
    }
    
    jconfirm.instances = [];
    jconfirm.pluginDefaults = {
    	title: '温馨提示',
    	content: 'Are you sure to continue?',
    	buttons: {},
    	bgOpacity: 0.9,
    	animation: 'zoom',
        closeAnimation: 'scale',
        animationSpeed: 400,
        animationBounce: 1.2,
        boxWidth: '50%',
        flag: false,
    	defaultButtons: {
            close: {
            	text: '取消',
                action: function () {
                }
            },
            ok: {
            	text: '确定',
                action: function () {
                }
            },
        },
    	onContentReady: function () {

        },
        onOpenBefore: function () {

        },
        onOpen: function () {

        },
        onClose: function () {

        },
        onDestroy: function () {

        },
        onAction: function () {

        }
    }
})(jQuery);