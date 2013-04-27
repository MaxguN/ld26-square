function Square(x, y, level) {
	var self = this;

	this.level = level;

	this.tilewidth = level.tile.width;
	this.tileheight = level.tile.height;

	this.x = x * this.tilewidth + this.tilewidth / 2;
	this.y = y * this.tileheight + this.tileheight / 2;

	this.animations = {};
	this.currentanimation = '';
	this.currentframe = 0;
	this.mirror = false;
	this.animationrunning = false;
	this.animationtimer = 0;
	this.framelength = 0;
	this.tilesets = [];
	this.tiles = {};

	this.state = states.standing;

	this.loaded = false;

	load.json('animations/square.json', function (data) {self.init(data);});
}

Square.prototype.init = function(data) {
	var self = this;

	this.animations = data.animations;
	this.currentanimation = this.animations[data.default];

	data.tilesets.forEach(function (tileset, index) {
		this.tilesets[index] = {
			image : new Image(),
			width : tileset.tilewidth,
			height : tileset.tileheight
		}

		load.image('images/' + tileset.file, function (image) {
			self.tilesets[index].image = image;
		});

		for (var i = 0; i < tileset.imageheight; i += tileset.tileheight) {
			for (var j = 0; j < tileset.imagewidth; j += tileset.tilewidth) {
				this.tiles[tileset.firstgid + i / tileset.tileheight * (tileset.imagewidth / tileset.tilewidth) + j / tileset.tilewidth] = {
					x : j,
					y : i,
					set : index
				};
			}
		}

	}, this);

	load.ready(function () {
		self.loaded = true;
	});
};

Square.prototype.switchtoanim = function(state) {
	var canswitch = false;

	if (state === states.running) {
		canswitch = (this.state === states.standing);
	} else if (state === states.standing) {
		canswitch = true;
	} else if (state === states.jumping) {
		canswitch = true;
	} else if (state === states.falling) {
		state = states.standing;
		canswitch = true;
	}

	if (canswitch) {
		this.state = state;
		this.currentanimation = this.animations[state];
		this.currentframe = 0;
		this.animationtimer = 0;
		this.framelength = 1000 / this.currentanimation.speed;
		this.animationrunning = true;
	}
};

Square.prototype.tick = function(length) {
	if (this.loaded) {
		this.animationtimer += length;

		if (keydown[keys.right]) {
			this.switchtoanim(states.running);
		} else if (keydown[keys.left]) {
			this.mirror = true;
			this.switchtoanim(states.running);
		} else if (keydown[keys.x]) {
			this.switchtoanim(states.jumping);
		} else if (keydown[keys.c]) {
			this.switchtoanim(states.attacking);
		}

		if (this.animationrunning) {
			if (this.animationtimer >= this.framelength) {
				this.animationtimer = 0;
				this.currentframe += 1;

				if (this.currentframe >= this.currentanimation.frames.length) {
					if (this.currentanimation.loop) {
						this.currentframe = this.currentanimation.loopto;
					} else {
						this.currentframe -= 1;
						this.animationrunning = false;
					}
				}

				if (this.state === states.running) {
					if (this.mirror) {
						this.x -= this.tilewidth / this.currentanimation.frames.length;
					} else {
						this.x += this.tilewidth / this.currentanimation.frames.length;
					}
	
					if (!this.animationrunning) {
						this.mirror = false;
						this.switchtoanim(states.standing);
					}
				} else if (this.state === states.jumping) {
					this.y -= this.tileheight / this.currentanimation.frames.length;

					if (!this.animationrunning) {
						this.switchtoanim(states.falling);
					}
				} else if (this.state === states.falling) {
					this.y -= 
				}
			}
		}


		this.level.updatecamera(this.x, this.y);
	}
};

Square.prototype.draw = function(gamewindow) {
	if (this.loaded) {
		var frame = this.currentanimation.frames[this.currentframe];
		var tile = this.tiles[frame.tile];
		var tileset = this.tilesets[tile.set];
		var width = tileset.width;
		var height = tileset.height;
		var x = this.x - frame.points[0].x - gamewindow.x;
		var y = this.y - frame.points[0].y - gamewindow.y;

		if (this.mirror) {
			context.save();
			context.scale(-1, 1);
			x = -x - 1.5 * this.tilewidth;
		}

		context.drawImage(tileset.image, tile.x, tile.y, width, height, x, y, width, height);

		if (this.mirror) {
			context.restore();
		}
	}
};