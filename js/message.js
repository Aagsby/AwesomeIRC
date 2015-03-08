function Message(from, to, message){
	this.from = from;
	this.to = to;
	this.message = escapeHTML(message);
}

Message.prototype.createHtmlString = function(){
	return '<p>' + this.from + " said: " + this.message + '</p>';
}

function escapeHTML(msg) {
    return msg.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

module.exports = Message;