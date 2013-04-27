function Game() {
	this.level = new Level('prototype');
}

Game.prototype.tick = function(length) {
	this.level.tick(length);
	// this.hud.tick();
};

Game.prototype.draw = function() {
	this.level.draw();
	// this.hud.draw();
};