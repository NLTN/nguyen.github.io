/*
    Nguyen, Nguyen

    December 14, 2019
*/

/**
 * Build a quick sort visualizer
 * @param {string} canvasID             The ID of the canvas
 * @param {string} numberOfElements     The number of elements
 * @param {string} partitionStyle       The partitioning style. Input 2 or 3
 */
function QuickSortVisualizer(canvasID, numberOfElements, partitionStyle)
{
    /***** Private Constants for the Layout *****/
    const MARGIN_TOP = 50;
    const MARGIN_LEFT = 10;
    const CELL_WIDTH = 50;
    const CELL_HEIGHT = 30;
    const CELL_SPACING = 5;

    /***** Private member variables *****/
    let numbers = []
    let elements = [];
    let animationScript = [];
    let speedRatio = 0.5;

    // Canvas's context
    let canvas = document.getElementById(canvasID);
    let ctx;
    if (canvas)
    {
        ctx = document.getElementById(canvasID).getContext('2d');
    }
    else
    {
        console.log(`Canvas ${canvasID} not found.`)
        return;
    }

    // Animation Frame
    let currentAnimationFrame = 0;
    let lastAnimationFrame = 0;

    // Animation Controller
    let animCtrl = new AnimationController();
    animCtrl.onStart.addHandler(() => { startAnimationRequest() });
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
    /*              Interface               */
    /****************************************/
    this.test = function (args)
    {
        console.log('test function called');
        animCtrl.addLinearMotion(elements[0], [
            { x: 300, y: 500, duration: 2000 }
        ]);
        animCtrl.start();
    }

    this.test2 = function (args)
    {
        console.log("function test2() -> " + "steps.length = " + animationScript.length + ", aniReq" + currentAnimationFrame);
    }

    this.createNumbersFromString = function (s)
    {
        this.clear();
        let arr = [];
        let temp = s.replace(/\s/g, '').split(',', 15);
        temp.forEach(e =>
        {
            if (!isNaN(e))
            {
                arr.push(parseInt(e));
            }
        });
        createNumbers(arr);
        startAnimationRequest();
    }

    /**
    * Perform sorting
    */
    this.sort = function ()
    {
        if (partitionStyle == 2)
        {
            quickSort2(numbers, 0, numbers.length - 1);
        }
        else
        {
            quickSort3(numbers, 0, numbers.length - 1);
        }
        startAnimationRequest();
        playNextScene();
    }

    this.clear = function ()
    {
        // Stop and reset AnimationController
        animCtrl.stop();
        animCtrl.reset();

        // Hid the indicators
        pivotIndicator.x = -100;
        lowIndex.x = - 100;
        highIndex.x = -100;

        // Empty the arrays
        numbers.length = 0;
        elements.length = 0;
        animationScript.length = 0;
    }

    /**
    * Reset everything
    */
    this.reset = function () 
    {
        this.clear();

        if (numbers.length == 0)
        {
            generateRadomNumbers();
        }

        // Re-init
        init(numberOfElements);
    }

    /****************************************/
    /*               Helpers                */
    /****************************************/
    let createNumbers = function (arr)
    {
        let numOfElems = arr.length;

        for (let i = 0; i < numOfElems; ++i)
        {
            numbers.push(arr[i]);

            let s = new Rect(MARGIN_LEFT + (CELL_WIDTH * i) + (CELL_SPACING * i), MARGIN_TOP, CELL_WIDTH, CELL_HEIGHT, arr[i], '#00796B', '5D4037', 'white');
            s.onAnimationEnd = new EventHandler();
            s.setCanvas(ctx);

            elements.push(s);
        }
    }

    let generateRadomNumbers = function (n)
    {
        let arr = [];
        for (let i = 0; i < n; ++i)
        {
            arr.push(Math.floor(Math.random() * 100) + 1);
        }

        createNumbers(arr);
    }

    /****************************************/
    /*             StoryBoard               */
    /****************************************/
    let playNextScene = function ()
    {
        if (animationScript.length > 0)
        {
            play(animationScript[0]);
            animationScript.shift();
        }
    }

    let play = function (args)
    {
        switch (args[0])
        {
            case "moveIndices":
                let x = (args[2] < elements.length) ? (elements[args[2]].x) : (elements[elements.length - 1].x + CELL_WIDTH + CELL_SPACING);
                animCtrl.addLinearMotion(args[1], [{ x: x, y: args[1].y, duration: 150 / speedRatio }])

                args[1].onAnimationEnd.addHandler(() =>
                {
                    args[1].onAnimationEnd.removeAllHandlers();
                    setTimeout(() => { playNextScene(); }, 100 / speedRatio);
                });
                animCtrl.start();
                break;

            case "changeIndex":
                args[1].x = elements[args[2]].x;
                setTimeout(() => { playNextScene(); }, 10 / speedRatio);
                break;

            case "swap":
                let x1 = elements[args[1]].x;
                let y1 = elements[args[1]].y;

                let x2 = elements[args[2]].x;
                let y2 = elements[args[2]].y;

                // Move both shapes down
                animCtrl.addLinearMotion(elements[args[1]], [{ x: x1, y: y1 + 50, duration: 400 / speedRatio }]);
                animCtrl.addLinearMotion(elements[args[2]], [{ x: x2, y: y2 + 50, duration: 400 / speedRatio }]);

                // Move both shape left/right
                animCtrl.addLinearMotion(elements[args[1]], [{ x: x2, y: y1 + 50, duration: 200 / speedRatio }]);
                animCtrl.addLinearMotion(elements[args[2]], [{ x: x1, y: y2 + 50, duration: 200 / speedRatio }]);

                // Move both shape up
                animCtrl.addLinearMotion(elements[args[1]], [{ x: x2, y: y2, duration: 400 / speedRatio }]);
                animCtrl.addLinearMotion(elements[args[2]], [{ x: x1, y: y1, duration: 400 / speedRatio }]);

                elements[args[2]].onAnimationEnd.addHandler(function () 
                {
                    elements[args[2]].onAnimationEnd.removeAllHandlers();
                    [elements[args[1]], elements[args[2]]] = [elements[args[2]], elements[args[1]]];
                    playNextScene();
                });
                animCtrl.start();
                break;

            case "setColor":
                elements[args[1]].fillColor = args[2];
                setTimeout(function () { playNextScene(); }, 100 / speedRatio);
                break;

            case "movePivot":
                let newX = elements[args[1]].x + (elements[args[1]].width - pivotIndicator.width) / 2;
                animCtrl.addLinearMotion(pivotIndicator, [{ x: newX, y: pivotIndicator.y, duration: 100 / speedRatio }])
                pivotIndicator.onAnimationEnd.addHandler(function () 
                {
                    pivotIndicator.onAnimationEnd.removeAllHandlers();
                    playNextScene();
                });
                animCtrl.start();
                break;

            case "setHidden":
                args[1].forEach(e => { e.target.hidden = e.value });
                setTimeout(function () { playNextScene(); }, 80 / speedRatio);
                break;

            case "delay":
                setTimeout(function () { playNextScene(); }, args[1] / speedRatio);
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
        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);
        resizeCanvas();

        generateRadomNumbers(numberOfElements);

        startAnimationRequest();
    }

    function resizeCanvas()
    {
        canvas.width = window.innerWidth * 0.99;
        startAnimationRequest();
    }

    function quickSort2(arr, h, k)
    {
        if (h < k)
        {
            let p = quickSort_partition2(arr, h, k);
            quickSort2(arr, h, p - 1);
            quickSort2(arr, p + 1, k);
        }
        else if (h < arr.length)
        {
            animationScript.push(['setColor', h, '#E64A19']);
        }
    }

    function quickSort3(arr, h, k)
    {
        if (h < k)
        {
            let p = quickSort_partition3(arr, h, k);
            quickSort3(arr, h, p - 1);
            quickSort3(arr, p + 1, k);
        }
        else if (h < arr.length)
        {
            animationScript.push(['setColor', h, '#E64A19']);
        }
    }

    function quickSort_partition2(arr, startIndex, endIndex)
    {
        let pivot = arr[startIndex];
        let h = startIndex + 1;
        let k = endIndex;

        animationScript.push(["movePivot", startIndex]);
        animationScript.push(["setColor", startIndex, '#0F0F0F']);
        animationScript.push(["changeIndex", lowIndex, h]);
        animationScript.push(["changeIndex", highIndex, k]);
        animationScript.push(["setHidden", [
            { target: pivotIndicator, value: false },
            { target: lowIndex, value: false },
            { target: highIndex, value: false },
        ]]);

        animationScript.push(["delay", 80]);

        while (h <= k)
        {
            while (h <= k && arr[h] <= pivot)
            {
                ++h;
                animationScript.push(["moveIndices", lowIndex, h]);
            }

            while (h <= k && arr[k] > pivot)
            {
                --k;
                animationScript.push(["moveIndices", highIndex, k]);
            }

            if (h < k)
            {
                animationScript.push(["swap", h, k]);
                [arr[h], arr[k]] = [arr[k], arr[h]];
            }
        }

        if (k != startIndex)
        {
            animationScript.push(["setHidden", [
                { target: pivotIndicator, value: true },
            ]]);
            animationScript.push(["swap", startIndex, k]);
            animationScript.push(["setHidden", [
                { target: lowIndex, value: true },
                { target: highIndex, value: true },
            ]]);

            [arr[startIndex], arr[k]] = [arr[k], arr[startIndex]];
            animationScript.push(["setColor", k, '#E64A19']);
        }

        return k;
    }

    function quickSort_partition3(arr, startIndex, endIndex)
    {
        let pivot = arr[startIndex];
        let h = startIndex;
        let k = startIndex + 1;

        animationScript.push(["movePivot", startIndex]);
        animationScript.push(["setColor", startIndex, '#0F0F0F']);
        animationScript.push(["changeIndex", lowIndex, h]);
        animationScript.push(["changeIndex", highIndex, k]);
        animationScript.push(["setHidden", [
            { target: pivotIndicator, value: false },
            { target: lowIndex, value: false },
            { target: highIndex, value: false },
        ]]);

        animationScript.push(["delay", 80]);

        for (k; k <= endIndex; ++k)
        {
            animationScript.push(["moveIndices", highIndex, k]);

            if (arr[k] <= pivot)
            {
                ++h;
                animationScript.push(["moveIndices", lowIndex, h]);
                if (h != k)
                {
                    animationScript.push(["swap", h, k]);

                    [arr[h], arr[k]] = [arr[k], arr[h]];
                }
            }
        }

        if (h != startIndex)
        {
            animationScript.push(["setHidden", [
                { target: pivotIndicator, value: true },
            ]]);
            animationScript.push(["swap", startIndex, h]);
            animationScript.push(["setHidden", [
                { target: lowIndex, value: true },
                { target: highIndex, value: true },
            ]]);

            [arr[startIndex], arr[h]] = [arr[h], arr[startIndex]];
            animationScript.push(["setColor", h, '#E64A19']);
        }

        return h;
    }

    /****************************************/
    /*          Animation Frame             */
    /****************************************/
    function animate()
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
        if (animationScript.length == 0 && animCtrl.getStatus() == 0)
        {
            stopAnimation();
        }
    }, 1000);

    // Init
    init(numberOfElements);
}