---
Stack: Node

---

# RWR
playground

## Quick Start
Make sure your npm is correctly set up. 

Then run: 
```
$ npm install
$ npm run dev
```

## Creating a helloworld component
Create a folder  **views/helloworld/** then create a file **views/helloworld/index.hbs** and insert:
```
<rwr-helloworld>Hello World!</rwr-helloworld>
```

Then create **views/helloworld/component.js** and insert the code below.
```
'use strict';

module.exports = {
    name: 'helloworld',
    description: 'Shows helloworld.',
    route: '/helloworld',
    controller: (req, res) => {
        res.render('helloworld/index');
    }
};
```

All **done!** You may find your component listed at [http://localhost:9670/api/rwr](http://localhost:9670/api/rwr).

### Adding Javascript/CSS (Optional)
Start by creating a folder **views/helloworld/browser**. Inside this folder, create the files: **index.js** and/or **styles.less**. 

**Congratulations!** The assets will automatically attach to your component.  

#### Guidelines for index.js
You may want to write code in the following fashion:
```
/*jslint browser:true */
"use strict";

const helloWorldPrototype = Object.create(HTMLElement.prototype);

helloWorldPrototype.attachedCallback = function() {
    console.log('Hello world from Javascript');
};
document.registerElement('tivoli-helloworld', {
    prototype: helloWorldPrototype
});
```

### Adding images and SVG (Optional)
These files should go into a folder named **views/helloworld/browser/img**. Any file inserted there will be accessible at http://localhost:9670/api/rwr/assets/helloworld/img/ + the name of your file.
 
### Adding documentation (Optional)
To add documentation for your component, add a file named **README.md** to you component folder. A link to the documentation will automatically be inserted on the index page. 
The documentation is written in [markdown](https://guides.github.com/features/mastering-markdown/) 

## Testing
The tests are in the test folder. The tests can be run from the project folder by typing:
```
$ npm test
```

## Component Skeleton
```
module.exports = {
    name: '<component name>',
    description: '<component description>',
    route: '/{publication}/example/{edition}',
    pathParameters: [{
        name: 'publication',
        examples: ['www.tb.no']
    },
    {
        name: 'edition',
        examples: ['desktop', 'mobile']
    }],
    queryParameters: [{
        name: 'geography',
        examples: ['Norge/Buskerud'],
        optional : true
    }],    
    controller: (req, res, error) => { 
        if(someError) {
            error('<some error message>')
        } else {
            res.render('<component name>/index', {});
        }        
    }
};
```

## Real world examples
### Jobcarousel with Gaia and error handling
```
'use strict';

const gaia = require('../../lib/gaia');

const customModel = function(edition, data) {
    return {
        pub : data.pub,
        prop : data.prop,
        custom : {
            height: edition === 'mobile' ? '260px' : '300px'
        }
    };
};

module.exports = {
    name: 'jobcarousel',
    description: 'Shows the job carousel in either mobile or desktop version.',
    route: '/{publication}/jobcarousel/{edition}',
    pathParameters: [{
        name: 'publication',
        examples: ['www.tb.no']
    },
    {
        name: 'edition',
        examples: ['desktop', 'mobile']
    }],
    controller: (req, res, error) => {
        gaia.config(req.params.publication).then(function (data) {
            res.render('jobcarousel/index.hbs', customModel(req.params.edition, data));
        }, function(errorMsg) {
            error(errorMsg)
        });
    }
};
```