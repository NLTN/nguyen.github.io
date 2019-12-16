var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

var aniReq; // Animation Request
var c2D = canvas.getContext('2d');

var DX = 5;
var DY = 5;

// Circle object
function Circle(x, y, radius, canvas)
{
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = DX;
    this.dy = DY;

    //let ani_start = Date.now();

    this.draw = function()
    {
        c2D.beginPath();
        c2D.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        c2D.strokeStyle = 'blue';
        c2D.stroke();
    }

    this.update = function()
    {
        this.x += this.dx;
        this.y += this.dy;

        if(this.x + this.radius * 2 > innerWidth || this.x - this.radius < 0)
        {
            this.dx = -this.dx;
        }

        if(this.y + this.radius * 2 > innerHeight || this.y - this.radius < 0)
        {
            this.dy = -this.dy;
        }

        this.draw();
    }

    this.moveTo = function(x, y)
    {        
        this.x += this.dx;
        this.y += this.dy;

        aniReq= requestAnimationFrame(animate);
        c2D.clearRect(0, 0, innerWidth, innerHeight);
        
        this.draw();

        if(this.x == x && this.y == y)
        {
            cancelAnimationFrame(aniReq);
        }
    }
}

var circle1 = new Circle(100, 100, 30, canvas);
circle1.draw();

var circle2 = new Circle(50, 50, 30, canvas);

function insert(elem)
{    
    circle2.draw();
}

function move()
{
    circle2.moveTo(500, 500);
}

function animate()
{
    aniReq= requestAnimationFrame(animate);
    c2D.clearRect(0, 0, innerWidth, innerHeight);

    circle1.update();
    // circle2.update();
    //circle2.moveTo(150, 700);    
}

animate();

function stopAnimation()
{
    cancelAnimationFrame(aniReq);
    console.log("playing");
}