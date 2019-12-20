/*
    Nguyen, Nguyen

    December 14, 2019
*/

interface IDrawable
{
    draw(): void;
}

class Shape2D
{
    public id: number;// = Math.random();
    public x: number;
    public y: number;
    public text: any;
    public fillColor: string;
    public borderColor: string;
    public textColor: string;
    public hidden: boolean;
    public font: string;
    public textAlign: string;
    public onAnimationEnd: EventHandler; // Should be type of EventHandler
    protected ctx: any;
    [key: string]: any; // Additional properties from the derived class.

    constructor(x: number, y: number, text: any, fillColor: string,
        borderColor: string, textColor: string)
    {
        this.id = Math.random();
        this.x = x;
        this.y = y;
        this.text = text;
        this.fillColor = fillColor;
        this.borderColor = borderColor;
        this.textColor = textColor;
        this.hidden = false;
        this.font = "20px Arial";
        this.textAlign = 'center';

        //this.onAnimationEnd = new EventHandler();
    }

    /**
     * Set the canvas for drawing on
     * @param {string} canvas       name of the canvas.
     */
    setCanvas(context: any)
    {
        this.ctx = context;
    }

    //abstract draw(): void;
}

class Rect extends Shape2D implements IDrawable
{
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number,
        text: any, fillColor: string, borderColor: string, textColor: string)
    {
        super(x, y, text, fillColor, borderColor, textColor);
        this.width = width;
        this.height = height;
    }

    /**
    * Draw on canvas
    */
    public draw()
    {
        if (!this.hidden)
        {
            // Draw shape
            if (this.fillColor != null)
            {
                this.ctx.fillStyle = this.fillColor;
                this.ctx.fillRect(this.x, this.y, this.width, this.height);
            }

            if (this.borderColor != null)
            {
                this.ctx.strokeStyle = this.borderColor;
                this.ctx.strokeRect(this.x, this.y, this.width, this.height);
            }

            // Draw Text
            this.ctx.font = this.font;
            this.ctx.fillStyle = this.textColor;
            this.ctx.textAlign = this.textAlign;
            this.ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 1.5);
        }
    }
}

class Circle extends Shape2D implements IDrawable
{
    public radius: number;

    constructor(x: number, y: number, radius: number,
        text: any, fillColor: string, borderColor: string, textColor: string)
    {
        super(x, y, text, fillColor, borderColor, textColor);
        this.radius = radius;
    }

    /**
    * Draw on canvas
    */
    public draw()
    {
        if (!this.hidden)
        {
            // Draw shape
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            if (this.fillColor != null)
            {
                this.ctx.fillStyle = this.fillColor;
                this.ctx.fill();
            }

            if (this.borderColor != null)
            {
                this.ctx.strokeStyle = this.borderColor;
                this.ctx.stroke();
            }

            this.ctx.closePath();

            // Draw Text
            this.ctx.font = this.font;
            this.ctx.fillStyle = this.textColor;
            this.ctx.textAlign = this.textAlign;
            this.ctx.fillText(this.text, this.x, this.y + this.radius / 2);
        }
    }
}