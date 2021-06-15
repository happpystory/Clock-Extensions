
var check;
var clicks = 0;
var subzone = [];
var timezone;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90
setInterval(drawClock, 1000);


function clearint() { 
  clearInterval(check)
}


function digtime(stz) { 
  var time = new Date()
  time.setHours(time.getUTCHours() + stz)
  var ustime = time.getHours()
  var usmin = time.getMinutes()
  usmin = ("0" + usmin).slice(-2);
  ustime = ("0" + ustime).slice(-2);
  $("#dig-time").text(ustime + ":" + usmin)

  if(ustime > 20 || ustime >= 00 && ustime < 06) { 
    $("#daynight").attr("src", "pics/moon.png")
  } else if(ustime > 05){ 
    $("#daynight").attr("src", "pics/sun.png")
  }
}

function generateTzones() { 
  $("#output").text("")
  for(var i = 0; i < subzone.length; i++) { 
    var newtz = document.createElement("div");
    var newtztxt = document.createTextNode(subzone[0])
    newtz.setAttribute("class", "tzone");
    newtz.setAttribute("id", "tzone"+i);
    newtz.appendChild(newtztxt)
    $("#output").append(newtz)
  }
  $(".tzone").each(function() { 
    $(this).parent().css("height", $(this).height())
  })
  $("#left-wrapper").css("display", "flex")
  $("#right-wrapper").css("display", "flex")
}

function refreshTime() { 
  $(".tzone").remove()
  subzone = []
  clicks = 0;
  $("#left-wrapper").css("display", "none")
  $("#right-wrapper").css("display", "none")
}


function slideTime(stz) { 
  digtime(stz)
  if($(".tzone").length != 0) { 
    for(var i = 0; i < $(".tzone").length; i++) { 
      var subzn = subzone[i]
      $("#tzone"+i).text(subzn)
    }
  }
 
  timezone = stz; 
  drawTime()
}

$("#us").click(function() { 
  refreshTime()
  subzone = ["United States (Pacific)", "United States (Mountain)", "United States (Central)", "United States (Eastern)"]
  generateTzones()
  clearint()
  check = setInterval(function() { 
      digtime((-7))
    }, 1000)
  slideTime((-7))
})


$("#bg").click(function() { 
  refreshTime();
  $("#output").text("Bulgaria")
  clearint()
  check = setInterval(function() { 
    digtime((+3))
  }, 1000)
  slideTime((+3))
})

$("#jp").click(function() { 
  refreshTime();
  $("#output").text("Japan")
  clearint()
  check = setInterval(function() { 
    digtime((+9))
  }, 1000)
  slideTime((+9))
})

$("#br").click(function() { 
   refreshTime();
   subzone = ["Brazil (Acre)", "Brazil (Amazon)", "Brazil (Brasilia)", "Brazil (Fernando de Noronha)"]
   generateTzones()
   clearint()
   check = setInterval(function() { 
    digtime((-5))
  }, 1000)
  slideTime((-5))

})

$("#aus").click(function() { 
   refreshTime();
   subzone = ["Australia (Western)", "Australia (Central)", "Australia (Eastern)"]
   generateTzones()
   clearint()
   check = setInterval(function() { 
    digtime((+8))
  }, 1000)
  slideTime((+8))
})


$("#right-wrapper").click(function() { 

  for(var i = 0; i<$(".tzone").length; i++) { 
    var zn = $(".tzone")[i]
    var newzn = zn.getAttribute("id")
    
    if($("#"+newzn).css("left") === "0px" && $("#"+newzn).next().text() != "") { 
      $("#"+newzn).css("left", "-100%")
      $("#"+newzn).next().css("left", "0")
      $("#"+newzn).css("transition", "0.5s")
      $("#"+newzn).next().css("transition", "0.5s")
      break;
    }
  }

  if(clicks < subzone.length-1) { 
    clicks++;
    timezone++;
    clearint()
    check = setInterval(function() { 
      digtime(timezone)
    }, 1000)
    digtime(timezone)
    drawTime()
  }
})


$("#left-wrapper").click(function() { 
  
  for(var i = 0; i<$(".tzone").length; i++) { 
    var zn = $(".tzone")[i]
    var newzn = zn.getAttribute("id")

    if($("#"+newzn).css("left") === "0px" && $("#"+newzn).prev().text() != "") { 
      $("#"+newzn).css("left", "100%")
      $("#"+newzn).prev().css("left", "0")
      break;
    }
  }

  if(clicks < subzone.length && clicks > 0) { 
    clicks--;
    timezone--;
    clearint()
    check = setInterval(function() { 
      digtime(timezone)
    }, 1000)
    digtime(timezone)
    drawTime()
  }

  if(clicks === 0) { 
    clicks = 0;
  }
})


function drawClock() {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#333');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#333');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius*0.15 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  for(num = 1; num < 13; num++){
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.85);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius){
    var now = new Date();
    if(!isNaN(timezone)) { 
      now.setHours(now.getUTCHours() + timezone)
    } else { 
      var localtime = now.getHours()
      var localmin = now.getMinutes()
      localmin = ("0" + localmin).slice(-2);
      localtime = ("0" + localtime).slice(-2);
      $("#dig-time").text(localtime + ":" + localmin)

      if(localtime > 20 || localtime >= 00 && localtime < 06) { 
        $("#daynight").attr("src", "pics/moon.png")
      } else if(localtime > 05){ 
        $("#daynight").attr("src", "pics/sun.png")
      }

      $("#output").text("Local Time")
    }
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    //hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
    drawHand(ctx, hour, radius*0.5, radius*0.07);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.8, radius*0.07);
    // second
    second=(second*Math.PI/30);
    drawHand(ctx, second, radius*0.9, radius*0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}






