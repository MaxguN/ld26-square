function Circle(x, y, level) {
	var self = this;

	this.level = level;

	this.tilewidth = level.tile.width;
	this.tileheight = level.tile.height;

	this.x = x * this.tilewidth;
	this.y = y * this.tileheight;
	this.speed = 128;

	this.forward = (Math.floor(Math.random()*2) === 0);

	this.loaded = false;

	load.image('images/circle.png', function (image) {self.init(image);})
}

Circle.prototype.init = function(image) {
	this.image = image;

	this.loaded = true;
};

Circle.prototype.collides = function(x, y, width, height) {
	var cx = this.x + this.tilewidth / 2;
	var cy = this.y + this.tileheight / 2;
	var point = {
		x : 0,
		y : 0
	}

	if (cx < x) {
		point.x = x;
	} else if (cx > x + width) {
		point.x = x + width;
	} else {
		point.x = cx;
	}

	if (cy < y) {
		point.y = y;
	} else if (cy > y + height) {
		point.y = y + height;
	} else {
		point.y = cy;
	}

	return (Math.sqrt(Math.pow(cx - point.x, 2) + Math.pow(cy - point.y, 2)) <= this.tilewidth / 2);
};

Circle.prototype.kill = function() {
	this.level.circles.some(function (circle, index) {
		if (circle === this) {
			this.level.circles.splice(index, 1);
			return true;
		}
	}, this)
};

Circle.prototype.tick = function(length) {
	if (this.loaded) {
		var x = this.x;
		var collisiondown;
		var collisionside;

		if (this.forward) {
			x += this.speed * length / 1000;
			collisiondown = this.level.collides(x + this.tilewidth, this.y + this.tileheight, {bottom : true});
			collisionside = this.level.collides(x + this.tilewidth, this.y, {right : true});
			
			if (!collisiondown.collides || collisionside.collides) {
				x = Math.floor(x / this.tilewidth) * this.tilewidth;
				this.forward = false;
			}
		} else {
			x -= this.speed * length / 1000;
			collisiondown = this.level.collides(x, this.y + this.tileheight, {bottom : true});
			collisionside = this.level.collides(x, this.y, {left : true});
			
			if (!collisiondown.collides || collisionside.collides) {
				x = Math.ceil(x / this.tilewidth) * this.tilewidth;
				this.forward = true;
			}
		}

		this.x = x;
	}
};

Circle.prototype.draw = function(gamewindow) {
	if (this.loaded) {
		context.drawImage(this.image, this.x - gamewindow.x, this.y - gamewindow.y);
	}
};