'use strict';

const cowslist = {
    name: 'kuerliste',
    description: 'Noen kuer',
    route: '/kuerliste',
    pathParameters: [],
    controller: (req, res, error) => {
            res.render('list/index.hbs');
    }
  };

module.exports = cowslist;