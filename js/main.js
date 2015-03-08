$ = require('jquery');

var irc = require('irc');
var client = null;

var users = [];

var messages = [];
var Message = require('./message');

$('#nameInput').on('submit',function(e){
	e.preventDefault();
	$('#submitName').trigger('click');
});

$('#submitName').on('click',function(){

	var name = $('#Nickname').val().toString();
	var url = 'chat.freenode.org';
	var opts = {
		channels: ['#schnitzelwirt'],
	};

	if(name.length > 0){
		client = new irc.Client(url, name, opts);
		addRegistrationHandler();

		$('#login').css('top','-100%');
		setTimeout(function(){
			$('#login').remove();
		},500);
	}	
});

function addRegistrationHandler(){
	client.on('registered',function(){

		client.on('error',function(e){
			console.log(e);
		});

		$('#Message').on('keypress',function(e){
			if(e.which == 13){
				sendMessage()
			} 
		});
		$('#sendMessage').on('click',function(){
			sendMessage()
		});
		addMessageHandler();
		addNamesHandler();

	});
}

function addNamesHandler(){

	client.on('join',function(channel,name){
		var joinMessage = name + ' has entered the channel ' + channel + '.';
		messages.push(new Message('Client','You',joinMessage));
		drawMessageList();

		users.push(name);
		drawNamesList();
	});

	client.on('quit',function(name,reason,channel){
		var quitMessage = name + ' has left the channel ' + channel + '.';
		messages.push(new Message('Client','You',quitMessage));
		drawMessageList();

		var index = users.indexOf(name);
		if(index > -1){
			users.splice(index,1);
		}		
		drawNamesList();
		
	});

	client.once('names#schnitzelwirt',function(nicks){
		users = [];
		for(var key in nicks){
			users.push(key);
		}
		drawNamesList();

		//This happens here, because after registering it takes
		//a while untill the names are loaded.
		$('#waiting').css('top','-100%');
		setTimeout(function(){
			$('#waiting').remove();
		},500);

	});
}

function addMessageHandler(){
	client.on('message', function (from, to, message) {
		messages.push(new Message(from,to,message));
		drawMessageList();
	});
}

function sendMessage(){
	message = $('#Message').val();
	if(message.length > 0){
		client.say('#schnitzelwirt',message);
		messages.push(new Message('You','#schnitzelwirt',message));
		drawMessageList();
		$('#Message').val('');
	}	
}

function drawNamesList(){
	$('#users').empty();
	users.forEach(function(u){
		$('#users').append('<p class="nickname">' + u + '</p>');
	});
}

function drawMessageList(){
	$('#messages').empty();
	messages.forEach(function(message){
		$('#messages').append(message.createHtmlString());
	});
}