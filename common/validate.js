const validate = { 
    arguments(args) {
        args.forEach(({ name, value, type, notEmpty, optional }) => { 
            if (value != undefined) { 
                if (type === 'object') if (value.constructor !== Object) throw TypeError(`${name} is not an object`)
                if (type === 'array') if (value.constructor !== Array) throw TypeError(`${name} is not an array`)
                
                if ((typeof value !== 'object') && (typeof value !== type)) throw TypeError(`${name} ${value} is not a ${type}`) 
     
                if (notEmpty) if (type === 'string') if (!value.trim().length) throw new Error(`${name} is empty`) 
            } else if (!optional) throw new Error(`${name} is not optional`) 
        }) 
    }, 
 
    email(email) { 
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
 
        if (!re.test(String(email))) throw new Error(`${email} is not an e-mail`) 
    }, 
 
    url(url) { 
        const re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ 
 
        if (!re.test(String(url))) throw new Error(`${url} is not a url`) 
    }, 
 
    compare(a, b) { 
        if (a.type !== b.type) throw TypeError(`${a.name} and ${b.name} should have the same type to compare`) 
 
        switch (a.type) { 
            case 'string':  
                if (a.value.trim() !== b.value.trim()) throw new Error(`${a.name} and ${b.name} are differents`) 
                break 
            default: 
                throw Error(`we can not compare ${a.type} yet!`) 
        } 
         
    } 
} 
 
module.exports = validate