'use strict';

const cows = {
    name: 'kuer',
    description: 'Noen kuer',
    route: '/kuer',
    pathParameters: [],
    controller: (req, res, error) => {
            res.render('ku/index.hbs');
    }
  };

module.exports = cows;