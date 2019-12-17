/*
    Nguyen, Nguyen

    December 15, 2019
*/

function EventHandler()
{
    let handlers = [];
    
    this.addHandler = function(handler)
    {
        if(handlers.indexOf(handler) < 0)
        {
            handlers = [handler];
        }
        else
        {
            handlers.push(handler);
        }
    }   
    
    this.removeHandler = function(handler)
    {
        let index = handlers.indexOf(handler);
        
        if(index >= 0)
        {
            handlers.splice(index, 1);
        }
    }
    
    this.removeAllHandlers = function()
    {
        handlers.length = 0;
    }

    this.raiseEvent = function(args)
    {
        if (!args || !args.length)
            args = [];

        handlers.forEach(e => {
            e.apply(this, args);
        });
    }
}