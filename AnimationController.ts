/*
    Nguyen, Nguyen

    December 15, 2019
*/

interface IMotion
{
    x: number;
    y: number;
    duration: number;
}

class AnimationController
{
    targets: [Shape2D, IMotion[]][];
    originalPoints: { x: number, y: number }[];
    startTimes: Date[];
    timer: any; // Interval Timer.
    status: number = 0 | 1; // 0: stop, 1: running
    onStart: EventHandler;
    onStop: EventHandler;

    constructor()
    {
        this.targets = [];
        this.originalPoints = [];
        this.startTimes = [];
        this.onStart = new EventHandler();
        this.onStop = new EventHandler();
    }

    /**
     * Get the status of the controller.
     * @return {number} 1 if the controller is running, return 0 otherwise.     
    */
    public getStatus()
    {
        return this.status;
    }

    /**
     * Add a linear motion to the queue
     * @param {Shape2D} target       The object to move
     * @param {IMotion[]} motions      An array of instructions of the motion
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
    public addLinearMotion(target: Shape2D, motions: IMotion[])
    {
        let index = this.targets.findIndex(e => e[0].id == target.id);

        if (index < 0)
        {
            this.targets.push([target, motions]);
            this.originalPoints.push({ x: target.x, y: target.y });
            this.startTimes.push(new Date());
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
    private getLineXYatPercent(startPt, endPt, percent)
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
    public start()
    {
        if (this.status == 0)
        {
            this.status = 1;
            this.onStart.raiseEvent();
            this.timer = setInterval(() => { this.onTimedEvent(); }, 1);
        }
    }

    /**
     * Stop the animation controller
    */
    public stop()
    {
        if (this.status != 0)
        {
            this.status = 0;
            clearInterval(this.timer);
        }
    }

    /**
     * Reset the animation controller
    */
    reset()
    {
        this.targets.length = 0;
        this.originalPoints.length = 0;
        this.startTimes.length = 0;
        this.onStart = new EventHandler();
        this.onStop = new EventHandler();
    }

    private onTimedEvent()
    {
        let i = 0;
        this.targets.forEach(e =>
        {
            let timePassed = new Date().valueOf() - this.startTimes[i].valueOf();
            if (e[1].length > 0)
            {
                let nextPoint = e[1][0];
                let progress = timePassed / nextPoint.duration;
                let newPos = this.getLineXYatPercent(this.originalPoints[i], nextPoint, progress);

                if (progress < 1)
                {
                    e[0].x = newPos.x;
                    e[0].y = newPos.y;
                }
                else
                {
                    e[0].x = newPos.x;
                    e[0].y = newPos.y;
                    this.originalPoints[i] = { x: nextPoint.x, y: nextPoint.y };
                    e[1].shift(); // pop
                    this.startTimes[i] = new Date();
                }
            }
            else
            {
                // Pop
                this.targets.splice(i, 1);
                this.originalPoints.splice(i, 1);
                this.startTimes.splice(i, 1);

                if (e[0].onAnimationEnd != null)
                {
                    e[0].onAnimationEnd.raiseEvent();
                }
            }
            ++i;
        });

        if (this.targets.length == 0)
        {
            clearInterval(this.timer);
            this.status = 0;
            this.onStop.raiseEvent();
        }
    }
}