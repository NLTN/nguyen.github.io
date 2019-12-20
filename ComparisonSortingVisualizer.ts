/*
    Nguyen, Nguyen

    December 14, 2019
*/
/**
 * Create an instance of comparison sorting visualizer
 * @param {string} canvasID             The ID of the canvas
 * @param {string} numberOfElements     The number of elements
 * @param {string} algorithm            'BubbleSort' | 'QuickSort2' | 'QuickSort3' | 
 */
class ComparisonSortingVisualizer
{
    /***** Private Constants for the Layout *****/
    readonly MARGIN_TOP = 50;
    readonly MARGIN_LEFT = 10;
    readonly CELL_WIDTH = 50;
    readonly CELL_HEIGHT = 30;
    readonly CELL_SPACING = 5;

    /***** Private member variables *****/
    numbers: number[] = [];
    elements: Shape2D[] = [];
    speedRatio = 0.5;
    algorithm: string; //= 'BubbleSort' | 'QuickSort2' | 'QuickSort3' | ;
    pivotIndicator = new Rect(-30, this.MARGIN_TOP - 12, 20, 10, 'pivot', null, null, 'black');
    lowIndex = new Rect(-100, this.MARGIN_TOP - 30, this.CELL_WIDTH, 10, 'h ', null, null, 'blue');
    highIndex = new Rect(-100, this.MARGIN_TOP - 30, this.CELL_WIDTH, 10, ' k', null, null, 'blue');

    // Canvas / context
    canvas: any; // = document.getElementById(canvasID);
    ctx: any;

    // Animation
    currentAnimationFrame: number;
    lastAnimationFrame: number;
    animationScript: [string, any?, any?][] = [];
    animCtrl = new AnimationController();

    constructor(canvasID: string, numberOfElements: number, algorithm: string)
    {
        this.canvas = document.getElementById(canvasID);

        if (this.canvas == null)
        {
            console.log(`Canvas ${canvasID} not found.`);
        }
        else
        {
            this.ctx = this.canvas.getContext('2d');
            this.algorithm = algorithm;

            // Animation Controller
            this.currentAnimationFrame = 0;
            this.lastAnimationFrame = 0;
            this.animCtrl.onStart.addHandler(() => { this.startAnimationRequest() });

            // Pivot Object
            this.pivotIndicator.onAnimationEnd = new EventHandler();
            this.pivotIndicator.textColor = "black";
            this.pivotIndicator.fillColor = "white";
            this.pivotIndicator.borderColor = "white";
            this.pivotIndicator.setCanvas(this.ctx);

            // Low & High Index Indicator
            this.lowIndex.onAnimationEnd = new EventHandler();
            this.lowIndex.textAlign = 'end';
            this.lowIndex.setCanvas(this.ctx);

            this.highIndex.onAnimationEnd = new EventHandler();
            this.highIndex.textAlign = 'start';
            this.highIndex.setCanvas(this.ctx);

            // Auto stop the animationRequest
            setInterval(() => 
            {
                if (this.animationScript.length == 0 && this.animCtrl.getStatus() == 0)
                {
                    this.stopAnimation();
                }
            }, 1000);

            // Initialize
            this.init(numberOfElements);
        }
    }

    /****************************************/
    /*              Interface               */
    /****************************************/
    test(args)
    {
        this.animCtrl.addLinearMotion(this.elements[0], [
            { x: 300, y: 10, duration: 800 },
            { x: 10, y: 10, duration: 100 }
        ]);
        this.animCtrl.start();
    }

    test2(args)
    {
        console.log("function test2() -> " + "steps.length = " + this.animationScript.length +
            ", aniReq" + this.currentAnimationFrame);
    }

    /**
     * Generate random numbers
     * @param {number} n The quantity of random numbers
     */
    generateRadomNumbers(n: number)
    {
        let arr = [];
        for (let i = 0; i < n; ++i)
        {
            arr.push(Math.floor(Math.random() * 100) + 1);
        }

        this.createNumbers(arr);
        this.startAnimationRequest();
    }

    /**
     * Create numbers from a string
     * @param {string} str A string of numbers separated by a comma
     * 
     * Example: "-1, -3, 42, 101, 16, -17, 72, -31, 9"
     */
    createNumbersFromString(str: any)
    {
        let arr = [];
        let temp = str.replace(/\s/g, '').split(',', 15);
        temp.forEach(e =>
        {
            if (!isNaN(e))
            {
                arr.push(parseInt(e));
            }
        });

        this.createNumbers(arr);
        this.startAnimationRequest();
    }

    /**
    * Perform sorting
    */
    sort()
    {
        switch (this.algorithm)
        {
            case 'BubbleSort':
                this.bubbleSort(this.numbers);
                break;

            case 'QuickSort2':
                this.quickSort2(this.numbers, 0, this.numbers.length - 1);
                break;

            case 'QuickSort3':
                this.quickSort3(this.numbers, 0, this.numbers.length - 1);
                break;
        }

        this.startAnimationRequest();
        this.playNextScene();
    }


    /****************************************/
    /*               Helpers                */
    /****************************************/
    clear()
    {
        // Stop and reset AnimationController
        this.animCtrl.stop();
        this.animCtrl.reset();

        // Hid the indicators
        this.pivotIndicator.x = -100;
        this.lowIndex.x = - 100;
        this.highIndex.x = -100;

        // Empty the arrays
        this.numbers.length = 0;
        this.elements.length = 0;
        this.animationScript.length = 0;
    }

    createNumbers(arr)
    {
        this.clear();
        let numOfElems = arr.length;

        for (let i = 0; i < numOfElems; ++i)
        {
            this.numbers.push(arr[i]);

            let s = new Rect(this.MARGIN_LEFT + (this.CELL_WIDTH * i) + (this.CELL_SPACING * i), this.MARGIN_TOP,
                this.CELL_WIDTH, this.CELL_HEIGHT, arr[i], '#00796B', '5D4037', 'white');
            s.onAnimationEnd = new EventHandler();
            s.setCanvas(this.ctx);

            this.elements.push(s);
        }
    }

    init(numberOfElements: number)
    {
        this.generateRadomNumbers(numberOfElements);

        window.addEventListener('resize', this.resizeCanvas.bind(this), false);
        window.addEventListener('orientationchange', this.resizeCanvas.bind(this), false);

        this.resizeCanvas();
    }

    resizeCanvas()
    {
        this.canvas.width = window.innerWidth - 20;
        this.startAnimationRequest();
    }
    /****************************************/
    /*             StoryBoard               */
    /****************************************/
    playNextScene()
    {
        if (this.animationScript.length > 0)
        {
            this.play(this.animationScript[0]);
            this.animationScript.shift();
        }
    }

    play(args)
    {
        switch (args[0])
        {
            case "moveIndices":
                let x = (args[2] < this.elements.length) ? (this.elements[args[2]].x) : (this.elements[this.elements.length - 1].x + this.CELL_WIDTH + this.CELL_SPACING);
                this.animCtrl.addLinearMotion(args[1], [{ x: x, y: args[1].y, duration: 150 / this.speedRatio }])

                args[1].onAnimationEnd.addHandler(() =>
                {
                    args[1].onAnimationEnd.removeAllHandlers();
                    setTimeout(() => { this.playNextScene(); }, 100 / this.speedRatio);
                });
                this.animCtrl.start();
                break;

            case "changeIndex":
                args[1].x = this.elements[args[2]].x;
                setTimeout(() => { this.playNextScene(); }, 10 / this.speedRatio);
                break;

            case "swap":
                let x1 = this.elements[args[1]].x;
                let y1 = this.elements[args[1]].y;

                let x2 = this.elements[args[2]].x;
                let y2 = this.elements[args[2]].y;

                // Move both shapes down
                this.animCtrl.addLinearMotion(this.elements[args[1]], [{ x: x1, y: y1 + 50, duration: 400 / this.speedRatio }]);
                this.animCtrl.addLinearMotion(this.elements[args[2]], [{ x: x2, y: y2 + 50, duration: 400 / this.speedRatio }]);

                // Move both shape left/right
                this.animCtrl.addLinearMotion(this.elements[args[1]], [{ x: x2, y: y1 + 50, duration: 200 / this.speedRatio }]);
                this.animCtrl.addLinearMotion(this.elements[args[2]], [{ x: x1, y: y2 + 50, duration: 200 / this.speedRatio }]);

                // Move both shape up
                this.animCtrl.addLinearMotion(this.elements[args[1]], [{ x: x2, y: y2, duration: 400 / this.speedRatio }]);
                this.animCtrl.addLinearMotion(this.elements[args[2]], [{ x: x1, y: y1, duration: 400 / this.speedRatio }]);

                this.elements[args[2]].onAnimationEnd.addHandler(() =>
                {
                    this.elements[args[2]].onAnimationEnd.removeAllHandlers();
                    [this.elements[args[1]], this.elements[args[2]]] = [this.elements[args[2]], this.elements[args[1]]];
                    this.playNextScene();
                });
                this.animCtrl.start();
                break;

            case "setColor":
                this.elements[args[1]].fillColor = args[2];
                setTimeout(() => { this.playNextScene(); }, 100 / this.speedRatio);
                break;

            case "movePivot":
                let newX = this.elements[args[1]].x + (this.elements[args[1]].width - this.pivotIndicator.width) / 2;
                this.animCtrl.addLinearMotion(this.pivotIndicator, [{ x: newX, y: this.pivotIndicator.y, duration: 100 / this.speedRatio }])
                this.pivotIndicator.onAnimationEnd.addHandler(() =>
                {
                    this.pivotIndicator.onAnimationEnd.removeAllHandlers();
                    this.playNextScene();
                });
                this.animCtrl.start();
                break;

            case "setHidden":
                args[1].forEach(e => { e.target.hidden = e.value });
                setTimeout(() => { this.playNextScene(); }, 80 / this.speedRatio);
                break;

            case "delay":
                setTimeout(() => { this.playNextScene(); }, args[1] / this.speedRatio);
                break;
            default:
                //this.playNextScene();
                break;
        }
    }

    /****************************************/
    /*              Algorithms               */
    /****************************************/
    bubbleSort(arr: any[])
    {
        let n = arr.length;
        for (let i = 0; i < n - 1; ++i)
        {
            this.animationScript.push(["moveIndices", this.lowIndex, i]);
            for (var j = 0; j < n - i - 1; ++j)
            {
                this.animationScript.push(["moveIndices", this.highIndex, j]);
                if (arr[j] > arr[j + 1])
                {
                    this.animationScript.push(["swap", j, j + 1]);
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
            this.animationScript.push(['setColor', j, '#E64A19']);
        }
        this.animationScript.push(['setColor', 0, '#E64A19']);
    }

    quickSort2(arr: any, h: number, k: number)
    {
        if (h < k)
        {
            let p = this.quickSort_partition2(arr, h, k);
            this.quickSort2(arr, h, p - 1);
            this.quickSort2(arr, p + 1, k);
        }
        else if (h < arr.length)
        {
            this.animationScript.push(['setColor', h, '#E64A19']);
        }
    }

    quickSort3(arr: any, h: number, k: number)
    {
        if (h < k)
        {
            let p = this.quickSort_partition3(arr, h, k);
            this.quickSort3(arr, h, p - 1);
            this.quickSort3(arr, p + 1, k);
        }
        else if (h < arr.length)
        {
            this.animationScript.push(['setColor', h, '#E64A19']);
        }
    }

    quickSort_partition2(arr: any, startIndex: number, endIndex: number)
    {
        let pivot = arr[startIndex];
        let h = startIndex + 1;
        let k = endIndex;

        this.animationScript.push(["movePivot", startIndex]);
        this.animationScript.push(["setColor", startIndex, '#0F0F0F']);
        this.animationScript.push(["changeIndex", this.lowIndex, h]);
        this.animationScript.push(["changeIndex", this.highIndex, k]);
        this.animationScript.push(["setHidden", [
            { target: this.pivotIndicator, value: false },
            { target: this.lowIndex, value: false },
            { target: this.highIndex, value: false },
        ]]);

        this.animationScript.push(["delay", 80]);

        while (h <= k)
        {
            while (h <= k && arr[h] <= pivot)
            {
                ++h;
                this.animationScript.push(["moveIndices", this.lowIndex, h]);
            }

            while (h <= k && arr[k] > pivot)
            {
                --k;
                this.animationScript.push(["moveIndices", this.highIndex, k]);
            }

            if (h < k)
            {
                this.animationScript.push(["swap", h, k]);
                [arr[h], arr[k]] = [arr[k], arr[h]];
            }
        }

        if (k != startIndex)
        {
            this.animationScript.push(["setHidden", [
                { target: this.pivotIndicator, value: true },
            ]]);
            this.animationScript.push(["swap", startIndex, k]);
            this.animationScript.push(["setHidden", [
                { target: this.lowIndex, value: true },
                { target: this.highIndex, value: true },
            ]]);

            [arr[startIndex], arr[k]] = [arr[k], arr[startIndex]];
            this.animationScript.push(["setColor", k, '#E64A19']);
        }

        return k;
    }

    quickSort_partition3(arr: any, startIndex: number, endIndex: number)
    {
        let pivot = arr[startIndex];
        let h = startIndex;
        let k = startIndex + 1;

        this.animationScript.push(["movePivot", startIndex]);
        this.animationScript.push(["setColor", startIndex, '#0F0F0F']);
        this.animationScript.push(["changeIndex", this.lowIndex, h]);
        this.animationScript.push(["changeIndex", this.highIndex, k]);
        this.animationScript.push(["setHidden", [
            { target: this.pivotIndicator, value: false },
            { target: this.lowIndex, value: false },
            { target: this.highIndex, value: false },
        ]]);

        this.animationScript.push(["delay", 80]);

        for (k; k <= endIndex; ++k)
        {
            this.animationScript.push(["moveIndices", this.highIndex, k]);

            if (arr[k] <= pivot)
            {
                ++h;
                this.animationScript.push(["moveIndices", this.lowIndex, h]);
                if (h != k)
                {
                    this.animationScript.push(["swap", h, k]);

                    [arr[h], arr[k]] = [arr[k], arr[h]];
                }
            }
        }

        if (h != startIndex)
        {
            this.animationScript.push(["setHidden", [
                { target: this.pivotIndicator, value: true },
            ]]);
            this.animationScript.push(["swap", startIndex, h]);
            this.animationScript.push(["setHidden", [
                { target: this.lowIndex, value: true },
                { target: this.highIndex, value: true },
            ]]);

            [arr[startIndex], arr[h]] = [arr[h], arr[startIndex]];
            this.animationScript.push(["setColor", h, '#E64A19']);
        }

        return h;
    }

    /****************************************/
    /*          Animation Frame             */
    /****************************************/
    render()
    {
        this.lastAnimationFrame = this.currentAnimationFrame;
        this.currentAnimationFrame = requestAnimationFrame(this.render.bind(this)); //requestAnimationFrame(() => this.animate);

        this.ctx.clearRect(0, 0, innerWidth, innerHeight);
        this.elements.forEach(obj => { obj.draw(); });

        this.lowIndex.draw();
        this.highIndex.draw();
        this.pivotIndicator.draw();
    }

    startAnimationRequest()
    {
        if (this.currentAnimationFrame == this.lastAnimationFrame)
        {
            this.render();
        }
    }

    stopAnimation()
    {
        cancelAnimationFrame(this.currentAnimationFrame);
        this.lastAnimationFrame = this.currentAnimationFrame;
    }
}