"use strict";

const assert = require('chai').assert,
    queryBuilder = require('../views/realestateaudience/browser/querybuilder.js');

describe('buildQuery', function () {

    it('shouldAllowWWWDomain', function () {
        const input = {wwwDomain: "www.tb.no"};
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "nested": {
                            "path": "bookings",
                            "filter": {
                                "and": {
                                    "filters": [{
                                        "term": {
                                            "bookings.publications": "www.tb.no"
                                        }
                                    }]
                                }
                            }
                        }
                    }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowGeography', function () {
        const input = {geography: "Norge/Akershus/Bærum", requirePrimaryImage: true};
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "match": {
                            "address.geography": "Norge/Akershus/Bærum"
                          }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowCategory', function () {
        const input = {category: "Tomannsbolig", requirePrimaryImage: true};
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "wildcard": {
                            "category": {
                                "value": "Eiendom/Tomannsbolig*"
                            }
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowSoldFalse', function () {
        const input = {sold: false, requirePrimaryImage: true};
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "missing":{
                            "field": "attributes.sold"
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowSoldTrue', function () {
        const input = {sold: true, requirePrimaryImage: true};
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "match":{
                            "attributes.sold": true
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowSoldFalseAsString', function () {
        const input = {sold: "FaLSe", requirePrimaryImage: true};
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "missing":{
                            "field": "attributes.sold"
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowMultipleCriteria', function () {
        const input = {category: "Leilighet", wwwDomain: "www.tb.no", requirePrimaryImage: true};
        const expected = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "wildcard": {
                                "category": {
                                    "value": "Eiendom/Leilighet*"
                                }
                            }
                        }, {
                            "nested": {
                                "path": "bookings",
                                "filter": {
                                    "and": {
                                        "filters": [{
                                            "term": {
                                                "bookings.publications": "www.tb.no"
                                            }
                                        }]
                                    }
                                }
                            }
                        },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowRangeCriteria', function () {
        const input = {
            primaryroomarea: {
                from: 1,
                to: 2
            },
            requirePrimaryImage: true
        };
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "range": {
                            "attributes.primaryroomarea": {
                                "gte": 1,
                                "lte": 2
                            }
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowPartialPriceCriteriaFrom', function () {
        const input = {
            price: {
                from: 1
            },
            requirePrimaryImage: true
        };
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "range": {
                            "attributes.price": {
                                "gte": 1
                            }
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowPartialPriceCriteriaTo', function () {
        const input = {
            price: {
                to: 2
            },
            requirePrimaryImage: true
        };
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "range": {
                            "attributes.price": {
                                "lte": 2
                            }
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowPartialPrimaryroomareaCriteriaFrom', function () {
        const input = {
            primaryroomarea: {
                from: 1
            },
            requirePrimaryImage: true
        };
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "range": {
                            "attributes.primaryroomarea": {
                                "gte": 1
                            }
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowPartialPrimaryroomareaCriteriaTo', function () {
        const input = {
            primaryroomarea: {
                to: 2
            },
            requirePrimaryImage: true
        };
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "range": {
                            "attributes.primaryroomarea": {
                                "lte": 2
                            }
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowPartialBedroomsCriteriaFrom', function () {
        const input = {
            bedrooms: {
                from: 1
            },
            requirePrimaryImage: true
        };
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "range": {
                            "attributes.bedrooms": {
                                "gte": 1
                            }
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowPartialBedroomsCriteriaTo', function () {
        const input = {
            bedrooms: {
                to: 2
            },
            requirePrimaryImage: true
        };
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "range": {
                            "attributes.bedrooms": {
                                "lte": 2
                            }
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldAllowCombo', function () {
        const input = {
            bedrooms: {
                from: 1,
                to: 2
            },
            price: {
                from: 100,
                to: 200
            },
            primaryroomarea: {
                from: 10,
                to: 20
            },
            category: 'Enebolig',
            geography: 'Norge/Oslo',
            wwwDomain: 'www.tb.no',
            propertytype: 'Leilighet',
            sold: false,
            requirePrimaryImage: true
        };
        const expected = {
            "query": {
                "bool": {
                    "must": [{
                        "range": {
                            "attributes.bedrooms": {
                                "gte": 1,
                                "lte": 2
                            }
                        }
                    }, {
                        "range": {
                            "attributes.price": {
                                "gte": 100,
                                "lte": 200
                            }
                        }
                    }, {
                        "range": {
                            "attributes.primaryroomarea": {
                                "gte": 10,
                                "lte": 20
                            }
                        }
                    }, {
                        "wildcard": {
                            "category": {
                                "value": "Eiendom/Enebolig*"
                            }
                        }
                    }, {
                        "match": {
                            "address.geography": "Norge/Oslo"
                        }
                    }, {
                        "nested": {
                            "path": "bookings",
                            "filter": {
                                "and": {
                                    "filters": [{
                                        "term": {
                                            "bookings.publications": "www.tb.no"
                                        }
                                    }]
                                }
                            }
                        }
                    }, {
                        "match": {
                            "attributes.propertytype": "Leilighet"
                        }
                    }, {
                        "missing":{
                            "field": "attributes.sold"
                        }
                    },
                        {
                            "exists":{
                                "field":"primary_image"
                            }
                        }
                    ]
                }
            }
        };


        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

    it('shouldNotAllowTest', function () {
        const input = {test: "test", requirePrimaryImage: true};
        const expected = {
            "query": {
                "bool":
                {
                    "must":[{
                        "exists":{
                            "field":"primary_image"
                        }
                    }
                    ]
                }
            }
        };

        assert.equal(JSON.stringify(expected), JSON.stringify(queryBuilder.buildQuery(input)));
    });

})
;