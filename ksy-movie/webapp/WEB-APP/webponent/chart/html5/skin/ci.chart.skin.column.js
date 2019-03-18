	DrawColumnSkin = function (_ctx) {
		var _this = this;
		var ctx = _ctx;
		this.basic = function(_data, _styles, _form, _sctCtx){
			var $ctx = ctx;
			if(_sctCtx) {
				$ctx = _sctCtx;
			}
			var width = _data.width - 1 <= 1 ? 1 : _data.width - 1;
			var x = _data.x, y = _data.y, w = _data.x + width, h = _data.y + _data.height;
			if(_form == "updown" && (_data.comp == "down" && _styles.downstrokewidth > 0)){
				h = h - 1;
			}
			$ctx.beginPath();
			$ctx.moveTo(x, y);
			$ctx.lineTo(w, y);
			$ctx.lineTo(w, h);
			$ctx.lineTo(x, h);
			$ctx.fill();
			$ctx.closePath();
			
			if(_sctCtx) {
				if((_form != "updown" && _styles.strokewidth > 0) || 
						(_form == "updown" && 
								((_data.comp == "up"   && _styles.overupstrokewidth > 0) || 
								(_data.comp == "down" && _styles.overdownstrokewidth > 0)))){
					$ctx.strokeRect(x, y, width, _data.height - 1);
				}
			} else {
				if((_form != "updown" && _styles.strokewidth > 0) || 
						(_form == "updown" && 
								((_data.comp == "up"   && _styles.upstrokewidth > 0) || 
								(_data.comp == "down" && _styles.downstrokewidth > 0)))){
					$ctx.strokeRect(x, y, width, _data.height - 1);
				}
			}
		};
		
		this.ox = function(_data, _styles, _form, _sctCtx){
			var $ctx = ctx;
			if(_sctCtx) {
				$ctx = _sctCtx;
			}
			var w = (_styles.strokewidth) ? Number(_styles.strokewidth) / 2 : 0;
			var rc = new Object();
			rc.left = w;
			rc.top = w;
			rc.right = _data.width - 2 * w;// + adjustedRadius * 2;
			rc.bottom = _data.height - 2 * w;// + adjustedRadius * 2;
			
			var len = Math.round((rc.bottom - rc.top) / _data.nNum), hLen = Math.round(len/2);
			if(_data.nPosition == 1){
				$ctx.strokeStyle = "#c42c1c";
				for(var i = 0; i < _data.nNum; i++) {
					$ctx.beginPath();
					$ctx.arc(_data.x + hLen, _data.y+i*len+hLen, hLen, 0, Math.PI * 2, false);
					$ctx.stroke();
					$ctx.closePath();
				}
			} else {
				$ctx.beginPath();
				$ctx.strokeStyle = "#2e80cc";
				for(var i = 0; i < _data.nNum; i++) {
					$ctx.moveTo(_data.x, _data.y+i*len+hLen);
					$ctx.lineTo(_data.x + len, _data.y+(i+1)*len+hLen);
					$ctx.moveTo(_data.x + len, _data.y+i*len+hLen);
					$ctx.lineTo(_data.x, _data.y+(i+1)*len+hLen);
				}
				$ctx.stroke();
				$ctx.closePath();
			}
		};
		
		this.candlecolor = function(_data, _styles, _form, _sctCtx){
			var $ctx = ctx, $fills = _styles.fillcolors, $strokes = _styles.strokecolors;
			if(_sctCtx) {
				$ctx = _sctCtx;
				$fills = _styles.overfillcolors;
				$strokes = _styles.overstrokecolors;
			}
			var width = _data.width - 1 <= 1 ? 1 : _data.width - 1;
			var x = _data.x, y = _data.y, w = _data.x + width, h = _data.y + _data.height;
			$ctx.beginPath();
			if(_data.open > _data.close){
				$ctx.fillStyle = $fills[1];
				$ctx.strokeStyle = $strokes[1];
			} else if(_data.open < _data.close){
				$ctx.fillStyle = $fills[0];
				$ctx.strokeStyle = $strokes[0];
			} else {
				$ctx.fillStyle = $fills[2];
				$ctx.strokeStyle = $strokes[2];
			}
			$ctx.moveTo(x, y);
			$ctx.lineTo(w, y);
			$ctx.lineTo(w, h);
			$ctx.lineTo(x, h);
			$ctx.fill();
			$ctx.closePath();
			
			
			if((_form != "updown" && _styles.strokewidth > 0) || 
					(_form == "updown" && 
							((_data.comp == "up"   && _styles.upstrokewidth > 0) || 
							(_data.comp == "down" && _styles.downstrokewidth > 0)))){
				$ctx.strokeRect(x, y, width, _data.height - 1);
			}
		};
		
		return _this;
	};
