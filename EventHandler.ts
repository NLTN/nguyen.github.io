/*
    Nguyen, Nguyen

    December 15, 2019
*/

class EventHandler
{
    handlers: any[];

    constructor()
    {
        this.handlers = [];
    }

    public addHandler(handler: any)
    {        
        if (this.handlers.indexOf(handler) < 0)
        {
            this.handlers = [handler];
        }
        else
        {
            this.handlers.push(handler);
        }
    }

    public removeHandler(handler: any)
    {
        let index = this.handlers.indexOf(handler);

        if (index >= 0)
        {
            this.handlers.splice(index, 1);
        }
    }

    public removeAllHandlers()
    {
        this.handlers.length = 0;
    }

    public raiseEvent(args?)
    {        
        if (!args || !args.length)
            args = [];

        this.handlers.forEach(e =>
        {
            e.apply(this, args);
        });
    }
}