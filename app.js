AudioContext = window.AudioContext || window.webkitAudioContext;
SpaceDrum = {
	audioContext: new AudioContext(),
	sounds: {},
	parent: null,
	log: [],
	recording: false,
	start_time: null,
	load: function() {
		this.notes = [];
		var that = this;
		$.each(that.parent.find('button'), function(key,value){
			that.notes.push( $(value).attr('id') );
		});
		this.loadSounds(this.audioContext);
		this.parent.find('button').mouseenter(function(){
			that.playNote($(this).attr('id'));
		});
		$('#record').click(function(){
			(function () {
				if (that.recording == true) {
					that.recording = false;
					var log = JSON.stringify(that.log);
					$('.circle').removeClass('recording');
					$('#log').val(log);
				}
				else {
					that.log = [];
					that.recording = true;
					console.log($('.circle'));
					$('.circle').addClass('recording');
					that.start_time = Date.now();
				}
			}).call();
		});
		$('#play').click(function(){
			var log = $('#log').val();
			var obj = new Function('return '+log)();
			var dfd = new $.Deferred();
			for (note in obj) {
				(function () {
					var sound = obj[note];
					setTimeout(function(){
						that.playNote(sound[0]);
					}, sound[1]);
				}).call();
			};
		})
		document.onkeydown = function(e)  {
			kc = e.keyCode;
			if(kc in that.keyBindings) {
				that.playNote( that.keyBindings[kc] );
			}
		}
	},
	loadSound: function (audioContext, key, url) {
	    var request = new XMLHttpRequest(),
	    	dfd = $.Deferred();
	    request.open("get", url);
	    request.responseType = "arraybuffer";
	    request.onload = (function () {
	      this.audioContext.decodeAudioData(request.response, (function (buffer) {
	        this.sounds[key] = buffer;
	        dfd.resolve();
	      }).bind(this));
	    }).bind(this);
	    request.send();
	    return dfd;
	},
	loadSounds: function (audioContext) {
	    var dfds = [],
	    	that = this,
	    	masterDfd = $.Deferred();
	    for (var key in this.notes) {
	    	var note = this.notes[key];
	        dfds.push(
	       	  this.loadSound(audioContext,
			     note,
			     that.path+note+'.mp3'
		      )
		    );
	    }

	    $.when.apply($, dfds).then(function () {
	      masterDfd.resolve();
	    });

	    return masterDfd;
	},
	playNote: function(sound) {
		var element = $('#'+sound);
		element.css('opacity', '0.5');
		if (this.recording) {
			this.log.push([sound, Math.abs(Date.now()-this.start_time)]);
		}
		element.animate({opacity: 0}, 'fast');
		this.playSound(sound);
		
	},
	playSound: function(sound) {
	    var source = this.audioContext.createBufferSource();
	    source.buffer = this.sounds[sound];
	    source.connect(this.audioContext.destination);
	    source.start(0);
	}
};

var SpaceDrum6 = $.extend({
	keyBindings: {
		'90': 'C4V4',
		'65': 'F4V4',
		'68': 'G4V4',
		'88': 'D4V4',
		'87': 'Bb4V4',
		'83': 'Bb3V4',
	},
	path: 'sounds/6notes'
}, SpaceDrum);
var SpaceDrum8 = $.extend({
	keyBindings: {
		'51': 'V4A4',
		'87': 'V4F4',
		'69': 'V4G4',
		'68': 'V4E4',
		'88': 'V4C4',
		'90': 'V4B3',
		'65': 'V4D4',
		'83': 'V4A3',
	},
	path: 'sounds/8notesDiatoAm'
}, SpaceDrum);
var SpaceDrum13 = $.extend({
	keyBindings: {
		"67":'o1C4',
		"52":'o2Cd4',
		"88":'o3D4',
		"87":'o4Eb4',
		"70":'o5E4',
		"90":'o6F4',
		"51":'o7Fd4',
		"84":'o8G4',
		"65":'omaGd4',
		"68":'o10A4',
		"69":'o11Bb4',
		"82":'o12B4',
		"83":'o13C5',
	},
	path: 'sounds/Chr'
}, SpaceDrum);

SpaceDrum6.parent = $('.spacedrum6');
SpaceDrum8.parent = $('.spacedrum8');
SpaceDrum13.parent = $('.spacedrum13');
SpaceDrum6.load();

$('.list-spacedrum6').click(function(){
	SpaceDrum6.load();
	$('body').animate({opacity: 0}, 'slow', function() {
		$('img.keyboard').attr('src', 'images/keyboard6.png');
		$('.spacedrum').hide();
        $(this).
        	css({'background-image': 'url(images/sunset.jpg)'}).
            animate({opacity: 1});
        $('.spacedrum6').show();
        
    });
});

$('.list-spacedrum8').click(function(){
	SpaceDrum8.load();
	$('body').animate({opacity: 0}, 'slow', function() {
		$('img.keyboard').attr('src', 'images/keyboard8.png');
		$('.spacedrum').hide();
        $(this).
        	css({'background-image': 'url(images/magnaen.jpg)'}).
            animate({opacity: 1});
        $('.spacedrum8').show();

    });
});

$('.list-spacedrum13').click(function(){
	SpaceDrum13.load();
	$('body').animate({opacity: 0}, 'slow', function() {
		$('.spacedrum').hide();
		$('img.keyboard').attr('src', 'images/keyboard13.png');
        $(this).
        	css({'background-image': 'url(images/hands.jpg)'}).
            animate({opacity: 1});
        $('.spacedrum13').show();
        
    });
});

// $.each($('button'), function(){
// 	var $this = $(this);
// 	$this.text( $this.attr('id') );
// })