/*
    Nguyen, Nguyen

    December 14, 2019
*/

function QuickSortVisualizer(canvas, numberOfElements)
{
    const MARGIN_TOP = 50;
    const MARGIN_LEFT = 10;
    const CELL_WIDTH = 50;
    const CELL_HEIGHT = 30;
    const CELL_SPACING = 5;

    let numbers = []
    let elements = [];
    let steps = [];
    let speed = 0.5;

    // Canvas's context
    let ctx = document.getElementById(canvas).getContext('2d');

    // Animation Frame
    let currentAnimationFrame = 0;
    let lastAnimationFrame = 0;

    // Animation Controller
    let aniCtrl = new AnimationController();
    aniCtrl.onStart.addHandler(() => { startAnimationRequest() });
    //aniCtrl.onStop.addHandler(() => { });

    let pivotIndicator = new Rect(-30, MARGIN_TOP - 12, 20, 10, "pivot");
    pivotIndicator.onAnimationEnd = new EventHandler();
    pivotIndicator.textColor = "black";
    pivotIndicator.fillColor = "white";
    pivotIndicator.borderColor = "white";
    pivotIndicator.setCanvas(ctx);

    // Low & High Index Indicator
    let lowIndex = new Rect(-100, MARGIN_TOP - 30, CELL_WIDTH, 10, 'h ', null, null, 'blue');
    lowIndex.onAnimationEnd = new EventHandler();
    lowIndex.textAlign = 'end';
    lowIndex.setCanvas(ctx);

    let highIndex = new Rect(-100, MARGIN_TOP - 30, CELL_WIDTH, 10, ' k', null, null, 'blue');
    highIndex.onAnimationEnd = new EventHandler();
    highIndex.textAlign = 'start';
    highIndex.setCanvas(ctx);

    /****************************************/
    /*          Interface Methods           */
    /****************************************/
    this.test = function (args)
    {
        console.log('test function called');
        aniCtrl.addLinearMotion(elements[0], [
            { x: 300, y: 500, duration: 2000 }
        ]);
        aniCtrl.start();
    }

    this.test2 = function (args)
    {
        console.log("function test2() -> " + "steps.length = " + steps.length + ", aniReq" + currentAnimationFrame);
    }

    /**
    * Perform sorting
    */
    this.sort = function ()
    {
        quickSort3(numbers, 0, numbers.length - 1);
        startAnimationRequest();
        playStoryboard();
    }

    /**
    * Reset everything
    */
    this.reset = function () 
    {
        // Stop and reset AnimationController
        aniCtrl.stop();
        aniCtrl.reset();

        // Hid the indicators
        pivotIndicator.x = -100;
        lowIndex.x = - 100;
        highIndex.x = -100;

        // Empty the arrays
        numbers.length = 0;
        elements.length = 0;
        steps.length = 0;

        // Re-init
        init(numberOfElements);
    }

    /****************************************/
    /*             StoryBoard               */
    /****************************************/
    let playStoryboard = function ()
    {
        if (steps.length > 0)
        {
            play(steps[0]);
            steps.shift();
        }
    }

    let play = function (args)
    {
        switch (args[0])
        {
            case "move lowIndex":
                aniCtrl.addLinearMotion(lowIndex, [{ x: elements[args[1]].x, y: lowIndex.y, duration: 150 / speed }])

                lowIndex.onAnimationEnd.addHandler(() =>
                {
                    lowIndex.onAnimationEnd.removeAllHandlers();
                    setTimeout(() => { playStoryboard(); }, 100 / speed);
                });
                aniCtrl.start();
                break;

            case "move highIndex":
                aniCtrl.addLinearMotion(highIndex, [{ x: elements[args[1]].x, y: highIndex.y, duration: 150 / speed }])

                highIndex.onAnimationEnd.addHandler(() =>
                {
                    highIndex.onAnimationEnd.removeAllHandlers();
                    setTimeout(() => { playStoryboard(); }, 100 / speed);
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
                setTimeout(function () { playStoryboard(); }, 80 / speed);
                break;

            default:
                break;
        }
    }

    /****************************************/
    /*              Algorithm               */
    /****************************************/
    function init(numberOfElements)
    {
        for (let i = 0; i < numberOfElements; ++i)
        {
            let num = Math.floor(Math.random() * 100) + 1;
            numbers.push(num);

            let s = new Rect(MARGIN_LEFT + (CELL_WIDTH * i) + (CELL_SPACING * i), MARGIN_TOP, CELL_WIDTH, CELL_HEIGHT, num, '#00796B', '5D4037', 'white');
            s.onAnimationEnd = new EventHandler();
            s.setCanvas(ctx);

            elements.push(s);
        }

        startAnimationRequest();
    }

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

    /****************************************/
    /*          Animation Frame             */
    /****************************************/
    let animate = function ()
    {
        lastAnimationFrame = currentAnimationFrame;
        currentAnimationFrame = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        elements.forEach(obj => { obj.draw(); });

        lowIndex.draw();
        highIndex.draw();
        pivotIndicator.draw();
    }

    function startAnimationRequest()
    {
        if (currentAnimationFrame == lastAnimationFrame)
        {
            animate();
        }
    }

    function stopAnimation()
    {
        cancelAnimationFrame(currentAnimationFrame);
        lastAnimationFrame = currentAnimationFrame;
    }

    // Auto stop the animationRequest
    setInterval(() => 
    {
        if (steps.length == 0 && aniCtrl.getStatus() == 0)
        {
            stopAnimation();
        }
    }, 1000);

    // Init
    init(numberOfElements);
}