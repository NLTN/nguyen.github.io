/*
    Nguyen, Nguyen

    December 14, 2019
*/

class Shape2D
{
    constructor(x, y, text, fillColor, borderColor, textColor)
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

        // Events
        this.onAnimationEnd;
    }

    /**
     * Set the canvas for drawing on
     * @param {string} canvas       name of the canvas.
     */
    setCanvas(canvas)
    {
        this.ctx = canvas;
    }
}

class Rect extends Shape2D
{
    constructor(x, y, width, height, text, fillColor, borderColor, textColor)
    {
        super(x, y, text, fillColor, borderColor, textColor);
        this.width = width;
        this.height = height;
    }

    /**
    * Draw on canvas
    */
    draw()
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

class Circle extends Shape2D
{
    constructor(x, y, radius, text, fillColor, borderColor, textColor)
    {
        super(x, y, text, fillColor, borderColor, textColor);
        this.radius = radius;
    }

    /**
    * Draw on canvas
    */
    draw()
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
