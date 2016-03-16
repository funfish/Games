//常用函数
// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
	    element.className +=''+ newClassName;
};

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
	    element.className = element.className.replace(/oldClassName/,'')
};

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
	addNumber: function() {
		var nullArr = [], num = 0;
		var li = document.getElementsByTagName('li');

		for(var i = 0; i < li.length; i++) {
			if (li[i].innerHTML == '') {
				nullArr.push(li[i]);
				if (li[i].innerHTML == '2048') this.successFlag = 1;
			}
		};
		console.log(nullArr.length)
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
		if (this.failFlag == 1) alert('fail');
	},
	run: function() {
		var that = this;
		document.onkeydown = function(e) {
			e = e || window.event;
			var key = e.keyCode || e.charCode;
			switch (key) {
				case 37:
					that.left();
					that.addNumber();
					break;
				case 38:
					that.up();
					that.addNumber();
					break;
				case 39:
					that.right();
					that.addNumber();
					break;
				case 40:
					that.down();
					that.addNumber();
					break;
				default: console.log('Please select direction')
			}
			that.status();
		};
	},
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
	same: function(x, y) {
		if (x == y) return x + y
	},
	left: function() {
		var oValue = this.getValue();
		for(var i = 0; i < 4; i++) {
			var cValue = [];
			var successNum = 0;
			for(var j = 0; j < 4 ; j++) {
				var temp = oValue[i*4+j];
				if (temp > 0) {					
					cValue.push(temp);
				};
				document.getElementsByTagName('li')[i*5 + j + 1].innerHTML = '';
			};
			var site;
			for(j = 0; j < cValue.length; j++) {
				site = i*5 + j + 1 - successNum;
				if (cValue[j] == cValue[j + 1]) {
					document.getElementsByTagName('li')[site].innerHTML = parseInt(cValue[j]) + parseInt(cValue[j]);
					successNum++;
					j++;					
				} else {
					document.getElementsByTagName('li')[site].innerHTML = cValue[j];					
				}
			}
		}
	},
	up: function() {
		var oValue = this.getValue();		
		for(var i = 0; i < 4; i++) {
			var cValue = [];
			var successNum = 0;
			for(var j = 0; j < 4 ;j++) {
				var temp = oValue[j*4+i];
				if (temp > 0) {					
					cValue.push(temp);
				};
				document.getElementsByTagName('li')[j*5 + i + 1].innerHTML = '';
			};
			var site;
			for(j = 0; j < cValue.length; j++) {
				site = (j - successNum)*5 + i + 1;
				if (cValue[j] == cValue[j + 1]) {
					document.getElementsByTagName('li')[site].innerHTML = parseInt(cValue[j]) + parseInt(cValue[j]);
					successNum++;
					j++;					
				} else {
					document.getElementsByTagName('li')[site].innerHTML = cValue[j];					
				}
			}
		}
	},
	right: function() {
		var oValue = this.getValue();		
		for(var i = 0; i < 4; i++) {
			var cValue = [];
			var successNum = 0;
			for(var j = 0; j < 4 ;j++) {
				var temp = oValue[i*4+j];
				if (temp > 0) {					
					cValue.push(temp);
				};
				document.getElementsByTagName('li')[i*5 + j + 1].innerHTML = '';
			}
			var tempL = cValue.length, site;
			for(var j = tempL - 1; j >= 0; j--) {
				site = i*5 + j +5 - tempL + successNum;
				if (cValue[j] == cValue[j - 1]) {
					document.getElementsByTagName('li')[site].innerHTML = parseInt(cValue[j]) + parseInt(cValue[j]);
					successNum++;
					j--;					
				} else {
					document.getElementsByTagName('li')[site].innerHTML = cValue[j];
				}
			}
		}
	},
	down: function() {
		var oValue = this.getValue();
		for(var i = 0; i < 4; i++) {
			var cValue = [];
			var successNum = 0;
			for(var j = 0; j < 4 ;j++) {
				var temp = oValue[j*4+i];
				if (temp > 0) {					
					cValue.push(temp);
				};
				document.getElementsByTagName('li')[j*5 + i + 1].innerHTML = '';
			};
			var tempL = cValue.length, site;
			for(j = tempL - 1; j >= 0; j--) {
				site = (4 - cValue.length + j + successNum)*5 + i + 1;
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
}



window.onload = function() {
	var game2 = new game();
	game2.init()
}