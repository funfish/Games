window.onload = function(){
  //创建画布
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;;
  canvas.height = window.innerHeight;
  console.log(canvas.width, canvas.height);
  if (canvas.width > 400) canvas.width = 400;
  if (canvas.height > 700) canvas.height = 700;
  console.log(canvas.width, canvas.height);
  document.body.appendChild(canvas);
  //创建background图像对象
  var backgroundReady = false;
  var backgroundImg = new Image();
  backgroundImg.onload = function() {
    backgroundReady = true
  }
  backgroundImg.src = 'images/background.png';
  //创建enemy1图像对象
  var enemy1Img = [];
  var enemy1Ready = [];
  for (var i = 0; i < 5; i++) {
    enemy1Ready[i] = false;
    enemy1Img[i] = new Image();
    enemy1Img[i].onload = (function(a) {
      enemy1Ready[a] = true
    })(i);
    enemy1Img[i].src = 'images/enemy1_' + i + '.png';
  }
  //创建enemy2图像对象
  var enemy2Img = [];
  var enemy2Ready = [];
  for (var i = 0; i < 5; i++) {
    enemy2Ready[i] = false;
    enemy2Img[i] = new Image();
    enemy2Img[i].onload = (function(a) {
      enemy2Ready[a] = true
    })(i)
    enemy2Img[i].src = 'images/enemy2_' + i + '.png';
  }
  //创建hero图像对象
  var heroReady1 = false;
  var heroImg1 = new Image();
  heroImg1.onload = function() {
    heroReady1 = true
  }
  heroImg1.src = 'images/hero1.png';
  var heroReady2 = false;
  var heroImg2 = new Image();
  heroImg2.onload = function() {
    heroReady2 = true
  }
  heroImg2.src = 'images/hero2.png';
  //hero撞击时候的图像
  var heroImg = [];
  var heroReady = [];
  for (var i = 0; i < 4; i++) {
    heroReady[i] = false;
    heroImg[i] = new Image();
    heroImg[i].onload = (function(a) {
      heroReady[a] = true
    })(i)
    heroImg[i].src = 'images/hero1_' + i + '.png';
  }  
 //创建bullets图像对象
  var bulletReady = false;
  var bulletImg = new Image();
  bulletImg.onload = function() {
    bulletReady = true
  }
  bulletImg.src = 'images/bullet1.png';

  var background = {
    y1: 0,
    y2: -canvas.height
  };
  var hero = {
    x: Math.floor(canvas.width/2 - 50),
    y: canvas.height - 124,
    speed: 200,
    status: true,
    down: false,
    times: 0
  };
  //难度表
  var difficult = {
    a: 1,
    b: 0,
    c: 0,
  };
  //手机拖动偏差
  var offSet = {
    x: 0,
    y: 0,
  };
  //创建运动的对象原型
  var moveObject = {
    inUse: false,
    down: false,
    times: 0,
    init: function() {
      this.x = Math.floor(Math.random()*canvas.width);
      this.y = 0;
    },
    outRange: function() {
      if (this.y > canvas.height || this.y < 0 || this.x > canvas.width || this.x < 0) 
      return true
    },
    reset: function() {
      if (this.collison() || this.outRange()) {
        return true
      } else {
        return false
      }
    },
    clear: function() {
      this.inUse = false;
      this.x = Math.floor(Math.random()*550) - 50;
      this.y = 0;
    }
  };
  //enemy1的对象
  function Enemy1() {
    this.life = 2;
    this.collison = function() {
      if (this.y > hero.y - 36 && this.y < hero.y + 5
        && this.x > hero.x - 14 && this.x < hero.x + 64) {
        return true
      }
      if (this.y >= hero.y + 5 && this.y < hero.y + 124
        && this.x > hero.x - 49 && this.x < hero.x + 99) {
        return true
      }
    };
    this.clear = function() {
      this.inUse = false;
      this.x = Math.floor(Math.random()*550);
      this.y = 0;
      if (this.x > canvas.width - 50) this.x = canvas.width - 50;
    };
    if (this.x > canvas.width - 50) this.x = canvas.width - 50;    
  }
  Enemy1.prototype = moveObject;
  //enemy2的对象
  function Enemy2() {
    this.life = 7;
    this.collison = function() {
      if (this.y > hero.y - 88 && this.y < hero.y - 63
        && this.x >= hero.x - 11 && this.x <= hero.x + 42) {
        console.log(this.x,this.y,hero.x,hero.y)
        return true
      }
      if (this.y >= hero.y - 63 && this.y < hero.y - 20 
        && this.x > hero.x - 31 && this.x < hero.x + 64) {
        console.log(this.x,this.y,hero.x,hero.y)
        return true
      }
      if (this.y >= hero.y - 20 && this.y <= hero.y + 124
        && this.x > hero.x - 69 && this.x < hero.x + 99) {
        console.log(this.x,this.y,hero.x,hero.y)
        return true
      }
    };
    this.clear = function() {
      this.inUse = false;
      this.x = Math.floor(Math.random()*550);
      this.y = 0;
      if (this.x > canvas.width - 68) this.x = canvas.width - 68;
    }
    if (this.x > canvas.width - 68) this.x = canvas.width - 68;    
  }
  Enemy2.prototype = moveObject;
  //enemy2的对象
  function Bullet() {
    this.collison = function() {
    };
  }
  Bullet.prototype = moveObject;


  var keysDown, 
      timeNext,
      timeInterval,
      headle1,
      headle2,
      headleB,
      together;
  var timeStart = new Date();
  var callFlag1 = false;
  var callFlag2 = false;
  var callFlagB = false;
  var beginMove = false;
  var score = 0;
  //常用数字
  var enemy1Size = 20,
      enemy1Speed = 70,
      enemy2Size = 20,
      enemy2Speed = 50,
      bulletSize = 100,
      bulletSpeed = 200,
      enemy1 = [],
      enemy2 = [],
      bullets = [],
      explode = []; 
  var initGame = function() {
    //enemy1集合
    for (var i = 0; i < enemy1Size; i++) {
      enemy1[i] = new Enemy1();
      enemy1[i].x = Math.floor(Math.random()*550);
      enemy1[i].y = 0;
      enemy1[i].inUse = false;
      enemy1[i].down = false;
      enemy1[i].times = 0;
      enemy1[i].life = 2;
    };
    //enemy2集合
    for (var i = 0; i < enemy2Size; i++) {
      enemy2[i] = new Enemy2();
      enemy2[i].x = Math.floor(Math.random()*550);
      enemy2[i].y = 0;
      enemy2[i].inUse = false;
      enemy2[i].down = false;
      enemy2[i].times = 0;
      enemy2[i].life = 7;
    };
    //bullets集合
    for (var i = 0; i < bulletSize; i++) {
      bullets[i] = new Bullet();
      bullets[i].inUse = false;
    };
    hero = {
      x: Math.floor(canvas.width/2 - 50),
      y: canvas.height - 124,
      speed: 200,
      status: true,
      down: false,
      times: 0
    };  
    background = {
      y1: 0,
      y2: -canvas.height
    };
    difficult = {
      a: 1,
      b: 0,
      c: 0,
    };
    score = 0; 
    timeStart = new Date();
  }
  //监听事件
  window.addEventListener("keydown", function (e) {
      keysDown = e.keyCode;
  }, false);

  window.addEventListener("keyup", function (e) {
      keysDown = 0;
  }, false);
  window.addEventListener("resize", resizeCanvas, false);

  function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  }
  //开始触摸
  canvas.addEventListener('touchstart', function(e) {
      event.preventDefault();
    e = e.touches[0];
    if (e.clientX > hero.x && e.clientX < hero.x + 98 
      && e.clientY > hero.y && e.clientY < hero.y + 124) {
      beginMove = true;
      offSet.x = e.clientX - hero.x;
      offSet.y = e.clientY - hero.y;
    }
  });
  //移动中
  canvas.addEventListener('touchmove', function(e) {
    if (beginMove) {
      event.preventDefault();
      e = e.touches[0];
      hero.x = e.clientX - offSet.x;
      hero.y = e.clientY - offSet.y;
      if (hero.x < 0) hero.x = 0;
      if (hero.x > canvas.width - 69) hero.x = canvas.width - 69;
      if (hero.y < 0) hero.y = 0;
      if (hero.y > canvas.height - 124) hero.y = canvas.height - 124;
    }
  });
  //拖动结束
  canvas.addEventListener('touchend', function(e) {
    beginMove = false;
  })
  //初始化
  initGame();
  //更新状态
  var update = function(period) {
    switch (keysDown) {
      case 37:
        hero.x -= hero.speed*period;
        break;

      case 39:
        hero.x += hero.speed*period;
        break;

      case 38:
        hero.y -= hero.speed*period;
        break;

      case 40:
        hero.y += hero.speed*period;
        break;

      default:; 
    };
    if (hero.x > canvas.width - 70) hero.x = canvas.width - 70;
    if (hero.x < 0 ) hero.x = 0;
    if (hero.y < 0) hero.y = 0;
    if (hero.y > canvas.height - 124) hero.y = canvas.height;
    timeNext = new Date();
    timeInterval = (timeNext - timeStart)/1000;
    difficult.a = Math.floor((timeInterval/4)) + 1;
    if (difficult.a > 10) difficult.a = 10;
    difficult.b = Math.floor((timeInterval/8)) - 1;
    if (difficult.b < 0) difficult.b = 0;
    if (difficult.b > 5) difficult.b = 5;
    together =2;

    var nowNum1 = 0;
    var nowNum2 = 0;
    var nowNumB = 0;
    //enemy1超边和碰到飞机检查
    for (var i = 0, j = enemy1Size; i < j; i++) {
      if (enemy1[i].inUse) {
        if (enemy1[i].collison()) {
          enemy1[i].down = true;
          hero.down = true;
        }
        if (enemy1[i].outRange()) {
          enemy1[i].clear();
          enemy1.push(enemy1.splice(i, 1)[0]);
          i--;
          j--;
        };
      };
    }
    for (var i =0; i < enemy1Size; i++) {
      if (enemy1[i].inUse) nowNum1++;
    }
    if (callFlag1 === false) {
      if (nowNum1 < difficult.a) {
        headle1 = setInterval (function() {
          if (difficult.a - nowNum1 > together) {
            for (var i = 0; i < together; i++) {
              if (!enemy1[enemy1Size - 1].inUse) {
                enemy1[enemy1Size - 1].inUse = true;
                enemy1.unshift(enemy1.pop());
              }
            }
          } else {
            if (!enemy1[enemy1Size - 1].inUse) {
              enemy1[enemy1Size - 1].inUse = true;
              enemy1.unshift(enemy1.pop());
            }
          }
        }, 600);         
        callFlag1 = true;
      };
    };
    if(nowNum1 >= difficult.a) {
      callFlag1 = false;
      clearInterval(headle1);
    };

    //enemy2超边和碰到飞机检查
    for (var i = 0, j = enemy2Size; i < j; i++) {
      if (enemy2[i].inUse) {
        if (enemy2[i].collison()) {
          enemy2[i].down = true;
          hero.down = true;
        }
        if (enemy2[i].outRange()) {
          enemy2[i].clear();
          enemy2.push(enemy2.splice(i, 1)[0]);
          i--;
          j--;
        }
      }
    }
    for (var i =0; i < enemy2Size; i++) {
      if (enemy2[i].inUse) nowNum2++;
    }
    if (callFlag2 === false) {
      if (nowNum2 < difficult.b) {
        headle2 = setInterval (function() {
          if (difficult.b - nowNum2 > together) {
            for (var i = 0; i < together; i++) {
              if (!enemy2[enemy2Size - 1].inUse) {
                enemy2[enemy2Size - 1].inUse = true;
                enemy2.unshift(enemy2.pop());
              }
            }
          } else {
            if (!enemy2[enemy2Size - 1].inUse) {
              enemy2[enemy2Size - 1].inUse = true;
              enemy2.unshift(enemy2.pop());
            }
          }
        }, 600);         
        callFlag2 = true;
      };
    };
    if(nowNum2 >= difficult.b) {
      callFlag2 = false;
      clearInterval(headle2);
    };

    //bullets超边和射杀检查
    for (var i = 0, j = bulletSize; i < j; i++) {
      if (bullets[i].inUse) {
        if (bullets[i].outRange()) {
          bullets[i].clear();
          bullets.push(bullets.splice(i, 1)[0]);
          i--;
          j--;
        }
      }
    }
    //render
    for (var i =0; i < bulletSize; i++) {
      if (bullets[i].inUse) {
        nowNumB++;
      }
    }
    //检测子弹是否射到东西
    var nowNumBTemp = nowNumB;
    for (var j = 0; j < nowNumBTemp; j++){
      var flag = false;
      for (var i = 0; i < nowNum1; i++) {
        if (bullets[j].x > enemy1[i].x - 4 && bullets[j].x < enemy1[i].x + 50 
          && bullets[j].y > enemy1[i].y && bullets[j].y < enemy1[i].y + 36) {
          bullets[j].clear();
          bullets.push(bullets.splice(j, 1)[0]);
          enemy1[i].life--;
          if (enemy1[i].life <= 0) {
            enemy1[i].down = true;
            score++;
          }

  /*
            for (var k = 0; k < 4; k++) {
              (function(b, a){
                setTimeout(function(){
                  console.log(b,enemy1[a].x, enemy1[a].y);
                  if (enemy1Ready[b]) {
                    ctx.drawImage(enemy1Img[b], enemy1[a].x, enemy1[a].y);
                  }
                }, 2*(k+1))
              })(k, i);
            }
  */       
          j--;
          nowNumBTemp--;
          flag = true;
          break;
        }
      }
      if (!flag){
        for (var i = 0; i < nowNum2; i++) {
          if (bullets[j].x > enemy2[i].x - 4 && bullets[j].x < enemy2[i].x + 67 
            && bullets[j].y > enemy2[i].y && bullets[j].y < enemy2[i].y + 89) {
            bullets[j].clear();
            bullets.push(bullets.splice(j, 1)[0]);
            enemy2[i].life--;
            if (enemy2[i].life <= 0) {
              enemy2[i].down = true;
              score += 5;
            }
            j--;
            nowNumBTemp--;
            break;
          }
        }  
      } 
    }
    if (callFlagB === false) {
      setTimeout (function(){
        if (!bullets[bulletSize - 1].inUse) {
          bullets[bulletSize - 1].inUse = true;
          bullets.unshift(bullets.pop());
          bullets[0].x = hero.x + 47;
          bullets[0].y =hero.y - 20;
        }
        callFlagB = false;
      }, Math.floor(150)); 
      callFlagB = true;        
    }    
  };
  // requestAnimationFrame 的浏览器兼容性处理
  var w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
  //渲染
  var renderAll = function(period) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (backgroundReady) {
      background.y1 += 10*period;
      background.y2 += 10 *period;
      if (background.y1 > canvas.height)  background.y1 =  background.y2 - canvas.height;
      if (background.y2 > canvas.height)  background.y2 =  background.y1 - canvas.height;
      ctx.drawImage(backgroundImg, 0, background.y1, canvas.width, canvas.height);
      ctx.drawImage(backgroundImg, 0, background.y2, canvas.width, canvas.height);
    }

    if (!hero.down) {
      if (hero.status) {
        if (heroReady1) {
          ctx.drawImage(heroImg1, hero.x, hero.y);
        };
        hero.status = false;
      }else {
        hero.status = true;
        if (heroReady2) {
          ctx.drawImage(heroImg2, hero.x, hero.y);
        }; 
      }
    } else {
      if (heroReady[Math.floor(hero.times/2)]){
        ctx.drawImage(heroImg[Math.floor(hero.times/2)], hero.x, hero.y);
        hero.times++;
      }     
    }
    //render enemy1
    for (var i = 0; i < enemy1Size; i++) {
      if (enemy1[i].inUse) {
        if (!enemy1[i].down) {
          if (enemy1Ready[0]) {
            enemy1[i].y += enemy1Speed*period;
            ctx.drawImage(enemy1Img[0], enemy1[i].x, enemy1[i].y);            
          }
        }else {
          if (enemy1Ready[Math.floor(enemy1[i].times/2) + 1]){
            ctx.drawImage(enemy1Img[Math.floor(enemy1[i].times/2) + 1], enemy1[i].x, enemy1[i].y);
            if(enemy1[i].times++ > 6) {
              enemy1[i].times = 0;
              enemy1[i].down = false;
              enemy1[i].clear();
              enemy1[i].life = 2;
              enemy1.push(enemy1.splice(i, 1)[0]);   
            }            
          }
        }
      }
    }
    //render enemy2
    for (var i =0; i < enemy2Size; i++) {
      if (enemy2[i].inUse) {
        if (!enemy2[i].down) {
          if (enemy2Ready[0]) {
            enemy2[i].y += enemy2Speed*period;
            ctx.drawImage(enemy2Img[0], enemy2[i].x, enemy2[i].y);
          }
        } else {
          if (enemy2Ready[Math.floor(enemy2[i].times/2) + 1]){
            ctx.drawImage(enemy2Img[Math.floor(enemy2[i].times/2) + 1], enemy2[i].x, enemy2[i].y);
            if(enemy2[i].times++ > 6) {
              enemy2[i].times = 0;
              enemy2[i].down = false;
              enemy2[i].clear();
              enemy2[i].life = 7;
              enemy2.push(enemy2.splice(i, 1)[0]);   
            }            
          }
        }
      }
    }
    //render bullets
    for (var i =0; i < bulletSize; i++) {
      if (bullets[i].inUse) {
        if (bulletReady){
          bullets[i].y -= bulletSpeed*period;
          ctx.drawImage(bulletImg, bullets[i].x, bullets[i].y);
        }
      }
    }
    ctx.font = "bold italic 16px Courier";
    ctx.fillText("Your score: "+ score, canvas.width - 170, 20);
        if(hero.times > 7) {
          alert('Game over');
          initGame();
        }
  };
  //主函数
  var main = function() {
    var now = new Date();
    var period = (now - then)/1000;

    update(period);
    renderAll(period);

    then = now;
    requestAnimationFrame(main);
  };

  var then = new Date();
  main();
}