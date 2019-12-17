/*
    Nguyen, Nguyen

    December 15, 2019
*/

function AnimationController()
{
    this.targets = [];
    let originalPoints = [];
    let startTimes = [];
    let timer; // Interval Timer.
    let status = 0; // 0: stop, 1: running
    this.onStart = new EventHandler();
    this.onStop = new EventHandler();

    /**
     * Get the status of the controller.
     * @return {number} 1 if the controller is running, return 0 otherwise.     
    */
    this.getStatus = function ()
    {
        return status;
    }

    /**
     * Add a linear motion to the queue
     * @param {string} target       The object to move
     * @param {string} motions      An array of instructions of the motion
     * 
     * Example: 
     * 
     * aniCtrl.addLinearMotion(circle, [
     * 
     *           { x: 300, y: 500, duration: 2000 },
     * 
     *           { x: 700, y: 500, duration: 2000 }
     * 
     *       ]);
     */
    this.addLinearMotion = function (target, motions)
    {
        let index = this.targets.findIndex(e => e[0].id == target.id);

        if (index < 0)
        {
            this.targets.push([target, motions]);
            originalPoints.push({ x: target.x, y: target.y });
            startTimes.push(new Date());
        }
        else
        {
            this.targets[index][1].push(...motions);
        }
    }

    /**
     * Calculate the position of an object.....
     * @return {struct} A struct {x, y}
     */
    function getLineXYatPercent(startPt, endPt, percent)
    {
        let dx = endPt.x - startPt.x;
        let dy = endPt.y - startPt.y;
        let X = startPt.x + dx * percent;
        let Y = startPt.y + dy * percent;
        return ({ x: X, y: Y });
    }
    /**
     * Start the animation controller
    */
    this.start = function ()
    {
        if (status == 0)
        {
            status = 1;
            this.onStart.raiseEvent();
            timer = setInterval(() => { this.onTimedEvent(); }, 1);
        }
    }

    /**
     * Stop the animation controller
    */
    this.stop = function ()
    {
        if (status != 0)
        {
            status = 0;
            clearInterval(timer);
        }
    }

    /**
     * Reset the animation controller
    */
    this.reset = function ()
    {
        this.targets.length = 0;
        originalPoints.length = 0;
        startTimes.length = 0;
        this.onStart = new EventHandler();
        this.onStop = new EventHandler();
    }

    this.onTimedEvent = function ()
    {
        let i = 0;
        this.targets.forEach(e =>
        {
            let timePassed = new Date().valueOf() - startTimes[i].valueOf();
            if (e[1].length > 0)
            {
                let nextPoint = e[1][0];
                let progress = timePassed / nextPoint.duration;
                let newPos = getLineXYatPercent(originalPoints[i], nextPoint, progress);

                if (progress < 1)
                {
                    e[0].x = newPos.x;
                    e[0].y = newPos.y;
                }
                else
                {
                    e[0].x = newPos.x;
                    e[0].y = newPos.y;
                    originalPoints[i] = { x: nextPoint.x, y: nextPoint.y };
                    e[1].shift();
                    startTimes[i] = new Date();
                }
            }
            else
            {
                // Pop
                this.targets.splice(i, 1);
                originalPoints.splice(i, 1);
                startTimes.splice(i, 1);

                if (e[0].onAnimationEnd != null)
                {
                    e[0].onAnimationEnd.raiseEvent();
                }
            }
            ++i;
        });

        if (this.targets.length == 0)
        {
            clearInterval(timer);
            status = 0;
            this.onStop.raiseEvent();
        }
    }
}