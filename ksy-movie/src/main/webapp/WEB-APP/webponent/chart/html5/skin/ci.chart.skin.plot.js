	DrawPlotSkin = function (_ctx) {
		var _this = this;
		var ctx = _ctx;
		// 사각형
		this.rect = function(_data, _styles, _sctCtx){
			if(_sctCtx) ctx = _sctCtx;
			/*var width = (_data.width - 1 <= 1) ? 1 : (_styles.strokewidth > 0) ? _data.width - 1 : _data.width;
			var x = _data.x, y = _data.y, w = _data.x + width, h = (_styles.strokewidth > 0) ? _data.y + _data.height - 1 : _data.y + _data.height;*/
			var width, x, y, w, h;
			if(_styles.strokewidth > 0) { // Stroke가 사용된경우
				width = _data.width - 1;
				x = _data.x, y = _data.y, w = _data.x + width, h = _data.y + _data.height - 1;
			} else {
				width = _data.width;
				x = Math.floor(_data.x), y = Math.floor(_data.y), w = x + width, h = y + _data.height;
			}
			if(width - 1 <= 1) width = 1;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(w + 1, y);
			ctx.lineTo(w, y);
			ctx.lineTo(w, h);
			ctx.lineTo(w+1, h);
			ctx.lineTo(x, h);
			ctx.lineTo(x, y);
			ctx.fill();
			if(_styles.strokewidth > 0) ctx.stroke();
			ctx.closePath();
			
		};
		// 원형
		this.dot = function(_data, _styles, _sctCtx){
			if(_sctCtx) ctx = _sctCtx;
			var x = _data.x + (_data.width/2), y = _data.y + (_data.height/2);
			var radius = _styles.radius; // 반지름
			ctx.beginPath();
			ctx.moveTo(x +radius, y);
			ctx.arc(x, y, radius, 0, _styles.PI, false);
			ctx.fill();
			if(_styles.strokewidth > 0) ctx.stroke();
			ctx.closePath();
		};
		// 삼각형
		this.triangle = function(_data, _styles, _sctCtx){
			if(_sctCtx) ctx = _sctCtx;
			var x = _data.x + (_data.width/2), y = _data.y + (_data.height/2);
			var radius = Math.round(_styles.radius * 0.8); // 반지름
			ctx.beginPath();
			ctx.moveTo(x			 , y - radius);
			ctx.lineTo(x + radius	 , y + radius);
			ctx.lineTo((x+1) + radius, y + radius);
			ctx.lineTo(x - radius	 , y + radius);
			ctx.lineTo((x-1) - radius, y + radius);
			ctx.lineTo(x			 , y-radius);
			ctx.fill();
			if(_styles.strokewidth > 0) ctx.stroke();
			ctx.closePath();
		};
		// 마름모형
		this.rhom = function(_data, _styles, _sctCtx){
			if(_sctCtx) ctx = _sctCtx;
			var x = _data.x + (_data.width/2), y = _data.y + (_data.height/2);
			var radius = Math.round(_styles.radius * 0.8); // 반지름
			ctx.beginPath();
			ctx.moveTo(x-radius, y);
			ctx.lineTo(x, y+radius);
			ctx.lineTo(x+radius, y);
			ctx.lineTo(x+radius+1, y+1);
			ctx.lineTo(x, y-radius);
			ctx.lineTo(x-radius, y);
			ctx.fill();
			if(_styles.strokewidth > 0) ctx.stroke();
			ctx.closePath();
		};
		// 별형
		this.star = function(_data, _styles, _sctCtx){
			if(_sctCtx) ctx = _sctCtx;
			var x = _data.x + (_data.width/2), y = _data.y + (_data.height/2);
			var radius = Math.round(_styles.radius * 0.8); // 반지름
			ctx.beginPath();
			ctx.moveTo(x, y-radius);
			ctx.lineTo(x-radius*0.7, y+radius*1.2);
			ctx.lineTo(x+radius, y-radius*0.1);
			ctx.lineTo(x-radius, y-radius*0.1);
			ctx.lineTo(x+radius*0.7, y+radius*1.2);
			ctx.lineTo(x, y-radius);
			ctx.fill();
			if(_styles.strokewidth > 0) ctx.stroke();
			ctx.closePath();
		};
		
		return _this;
	};
