function Menu() {
	var self = this;

	context.font = '100px Arial';
	var playwidth = context.measureText('PLAY').width;

	this.play = {
		left : (canvas.width - playwidth) / 2,
		top : 220,
		right : (canvas.width + playwidth) / 2,
		bottom : 220 + 100,
		over : false
	}
	this.instructions = new Image();

	this.loaded = false;

	load.image('images/instructions.png', function (image) {self.init(image);});
}

Menu.prototype.init = function(image) {
	this.instructions = image;
	this.bind();

	this.loaded = true;
};

Menu.prototype.bind = function() {
	var self = this;

	mouse.on('mousedown', function (event) {
		if (mouse.left && self.play.over) {
			self.play.over = false;
			current = game;
			game.startlevel();
		}
	});
};

Menu.prototype.tick = function(length) {
	if (mouse.x >= this.play.left && mouse.x <= this.play.right &&
			mouse.y >= this.play.top && mouse.y <= this.play.bottom) {
		this.play.over = true;
		canvas.style.cursor = 'pointer';
	} else {
		this.play.over = false;
		canvas.style.cursor = 'auto';
	}

	this.draw()
};

Menu.prototype.draw = function() {
	context.font = '100px Arial';
	context.fillStyle = '#000000';
	context.strokeStyle = '#000000';
	context.textAlign = 'center';
	context.textBaseline = 'top';
	context.lineWidth = 10;

	context.fillText('²', canvas.width / 2, 20);
	context.strokeRect((canvas.width - 120) / 2, 20, 120, 120);
	context.drawImage(this.instructions, 0, canvas.height - 150);

	if (this.play.over) {
		context.fillStyle = '#666666';
	}
	context.fillText('PLAY', canvas.width / 2, 220)
};