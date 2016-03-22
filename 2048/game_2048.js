var game = function () {
	this.a=1;
	this.failFlag = 0;
	this.successFlag = 0;
}
game.prototype = {
	init: function() {
		//初始化数字
		this.addNumber();
		//游戏开始标识职位
		this.run();
	},
	//每操作一步之后增加1个棋子同时初始化增加两个棋子，并同时检查胜负
	addNumber: function() {
		var nullArr = [], num = 0;
		var li = document.getElementsByTagName('li');

		for(var i = 0; i < li.length; i++) {
			if (li[i].innerHTML == '') {
				nullArr.push(li[i]);
				if (li[i].innerHTML == '2048') this.successFlag = 1;
			}
		};
		var select = Math.floor((Math.random()*nullArr.length));
		if (nullArr.length < 16 && nullArr.length > 0) {
			nullArr[select].innerHTML = 2;
		} else if(nullArr.length == 0) {
			this.failFlag = 1;
		} else {
			nullArr[select].innerHTML = 2;
			nullArr[select] = 0;
			while(num < 1) {
				select = Math.floor((Math.random()*nullArr.length));
				if (nullArr[select] != 0) {
					nullArr[select].innerHTML = 2;
					num++;
				}
			}
		}
	},
	status: function() {
		if (this.successFlag == 1) alert('win');
		if (this.failFlag == 1) {
			alert('Game over');
			this.reset()
		}
	},
	run: function() {
		var that = this;
		document.onkeydown = function(e) {
			e = e || window.event;
			var key = e.keyCode || e.charCode;
			switch (key) {
				case 37:
					that.calc(5, 1, true);
					that.addNumber();
					break;
				case 38:
					that.calc(1, 5, true);
					that.addNumber();
					break;
				case 39:
					that.calc(5, 1, false);
					that.addNumber();
					break;
				case 40:
					that.calc(1, 5, false);
					that.addNumber();
					break;
				default: console.log('Please select direction')
			}
			that.status();
		};
	},
	//获取游戏中的，每个格子的数据，从做到右
	getValue: function() {
		var li = document.getElementsByTagName('li');
		var value = [];
		for(var i = 0; i < li.length; i++) {
			if (li[i].innerHTML > 0 || li[i].innerHTML == '') {
				value.push(li[i].innerHTML);
			}
		};
		return value
	},
	//通过a,b，dir，来判断上下左右键
	calc: function(a, b, dir) {
		var oValue = this.getValue();
		for(var i = 0; i < 4; i++) {
			var cValue = [];
			var successNum = 0;
			for(var j = 0; j < 4 ; j++) {
				var temp = a > b ? oValue[i*4+j] : oValue[i+j*4];
				if (temp > 0) {					
					cValue.push(temp);
				};
				document.getElementsByTagName('li')[i*a + j*b + 1].innerHTML = '';
			};
			if (dir) {
				var site;
				for(j = 0; j < cValue.length; j++) {
					site = i*a + (j - successNum)*b + 1;
					if (cValue[j] == cValue[j + 1]) {
						document.getElementsByTagName('li')[site].innerHTML = parseInt(cValue[j]) + parseInt(cValue[j]);
						successNum++;
						j++;					
					} else {
						document.getElementsByTagName('li')[site].innerHTML = cValue[j];					
					}
				}			
			} else {
				var tempL = cValue.length, site;
				for(var j = tempL - 1; j >= 0; j--) {
					site = i*a + (j + successNum - tempL + 4)*b +1;
					if (cValue[j] == cValue[j - 1]) {
						document.getElementsByTagName('li')[site].innerHTML = parseInt(cValue[j]) + parseInt(cValue[j]);
						successNum++;
						j--;					
					} else {
						document.getElementsByTagName('li')[site].innerHTML = cValue[j];
					}
				}			
			}
		}
	},
	//重新初始化
	reset: function() {
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4 ; j++) {
				document.getElementsByTagName('li')[i*5 + j + 1].innerHTML = '';
			};
		}
		this.addNumber();
	}
}

window.onload = function() {
	var game2048 = new game();
	game2048.init()
}