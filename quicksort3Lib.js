const MARGIN_TOP = 150;
const MARGIN_LEFT = 10;
const CELL_WIDTH = 50;
const CELL_HEIGHT = 30;
const CELL_SPACING = 5;

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

let aniReq; // Animation Request
let ctx = canvas.getContext('2d');

let numbers = []
let elements = [];
let steps = [];
let speed = 0.5;
let pivotIndicator = new Rect(-30, MARGIN_TOP - 12, 20, 10, "pivot");
pivotIndicator.onAnimationEnd = new EventHandler();
pivotIndicator.textColor = "black";
pivotIndicator.fillColor = "white";
pivotIndicator.borderColor = "white";

let aniCtrl = new AnimationController();
aniCtrl.onStart.addHandler(function () { animate() });
aniCtrl.onStop.addHandler(function () 
{
    if (steps.length == 0)
    {
        stopAnimation();
    }
});

// Low & High Index Indicator
let lowIndex = new Rect(-100, MARGIN_TOP - 30, CELL_WIDTH, 10, 'h ', null, null, 'blue');
lowIndex.onAnimationEnd = new EventHandler();
lowIndex.textAlign = 'end';

let highIndex = new Rect(-100, MARGIN_TOP - 30, CELL_WIDTH, 10, ' k', null, null, 'blue');
highIndex.onAnimationEnd = new EventHandler();
highIndex.textAlign = 'start';

function init()
{
    for (let i = 0; i < 10; ++i)
    {
        let num = Math.floor(Math.random() * 100) + 1;
        numbers.push(num);

        let s = new Rect(MARGIN_LEFT + (CELL_WIDTH * i) + (CELL_SPACING * i), MARGIN_TOP, CELL_WIDTH, CELL_HEIGHT, num, '#00796B', '5D4037', 'white');
        s.onAnimationEnd = new EventHandler();
        s.setCanvas('canvas');

        elements.push(s);
    }
}

function playStoryboard()
{
    if (steps.length > 0)
    {
        play(steps[0]);
        steps.shift();
    }
}

function play(args)
{
    switch (args[0])
    {
        case "move lowIndex":
            aniCtrl.addLinearMotion(lowIndex, [{ x: elements[args[1]].x, y: lowIndex.y, duration: 150 / speed }])

            lowIndex.onAnimationEnd.addHandler(function () 
            {
                lowIndex.onAnimationEnd.removeAllHandlers();
                setTimeout(function () { playStoryboard(); }, 100 / speed);
            });
            aniCtrl.start();
            break;

        case "move highIndex":
            aniCtrl.addLinearMotion(highIndex, [{ x: elements[args[1]].x, y: highIndex.y, duration: 150 / speed }])

            highIndex.onAnimationEnd.addHandler(function () 
            {
                highIndex.onAnimationEnd.removeAllHandlers();
                setTimeout(function () { playStoryboard(); }, 100 / speed);
            });
            aniCtrl.start();
            break;

        case "swap":
            let x1 = elements[args[1]].x;
            let y1 = elements[args[1]].y;

            let x2 = elements[args[2]].x;
            let y2 = elements[args[2]].y;

            // Move both shapes down
            aniCtrl.addLinearMotion(elements[args[1]], [{ x: x1, y: y1 + 50, duration: 400 / speed }]);
            aniCtrl.addLinearMotion(elements[args[2]], [{ x: x2, y: y2 + 50, duration: 400 / speed }]);

            // Move both shape left/right
            aniCtrl.addLinearMotion(elements[args[1]], [{ x: x2, y: y1 + 50, duration: 200 / speed }]);
            aniCtrl.addLinearMotion(elements[args[2]], [{ x: x1, y: y2 + 50, duration: 200 / speed }]);

            // Move both shape up
            aniCtrl.addLinearMotion(elements[args[1]], [{ x: x2, y: y2, duration: 400 / speed }]);
            aniCtrl.addLinearMotion(elements[args[2]], [{ x: x1, y: y1, duration: 400 / speed }]);

            elements[args[2]].onAnimationEnd.addHandler(function () 
            {
                elements[args[2]].onAnimationEnd.removeAllHandlers();
                [elements[args[1]], elements[args[2]]] = [elements[args[2]], elements[args[1]]];
                playStoryboard();
            });
            aniCtrl.start();
            break;

        case "setColor":
            elements[args[1]].fillColor = args[2];
            setTimeout(function () { playStoryboard(); }, 100 / speed);
            break;

        case "pivot":
            let newX = elements[args[1]].x + (elements[args[1]].width - pivotIndicator.width) / 2;
            aniCtrl.addLinearMotion(pivotIndicator, [{ x: newX, y: pivotIndicator.y, duration: 100 / speed }])
            pivotIndicator.onAnimationEnd.addHandler(function () 
            {
                pivotIndicator.onAnimationEnd.removeAllHandlers();
                playStoryboard();
            });
            aniCtrl.start();
            break;

        case "hide pivot":
            pivotIndicator.hidden = args[1];
            setTimeout(function () { playStoryboard(); }, 80/speed);
            break;

        default:
            break;
    }
}

function animate()
{
    aniReq = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    elements.forEach(obj => { obj.draw(); });
    lowIndex.draw();
    highIndex.draw();
    pivotIndicator.draw();
    // The belows are trash
}

function stopAnimation()
{
    cancelAnimationFrame(aniReq);
}

// Quick Sort 3
function quickSort3(arr, h, k)
{
    if (h < k)
    {
        let p = quickSort3_partition(arr, h, k);
        quickSort3(arr, h, p - 1);
        quickSort3(arr, p + 1, k);
    }
    else if (h < arr.length)
    {
        steps.push(['setColor', h, '#E64A19']);
    }
}

function quickSort3_partition(arr, startIndex, endIndex)
{
    let pivot = arr[startIndex];
    let h = startIndex;
    let k = startIndex + 1;

    steps.push(["pivot", startIndex]);
    steps.push(["setColor", startIndex, '#0F0F0F']);
    steps.push(["hide pivot", false]);
    steps.push(["move lowIndex", h]);
    steps.push(["move highIndex", k]);

    for (k; k <= endIndex; ++k)
    {
        steps.push(["move highIndex", k]);

        if (arr[k] <= pivot)
        {
            ++h;
            steps.push(["move lowIndex", h]);
            if (h != k)
            {
                steps.push(["swap", h, k]);

                [arr[h], arr[k]] = [arr[k], arr[h]];
            }
        }
    }

    if (h != startIndex)
    {
        steps.push(["hide pivot", true]);
        steps.push(["swap", startIndex, h]);
        [arr[startIndex], arr[h]] = [arr[h], arr[startIndex]];
        steps.push(["setColor", h, '#E64A19']);
    }

    return h;
}

animate();
init();