"use strict";

module.exports.createWildcardCriteria = function (name, value) {
    var obj = {};
    obj[name] = {"value": value};

    return {
        "wildcard": obj
    }
};

module.exports.createMatchCriteria = function (field, value) {
    var obj = {};
    obj[field] = value;

    return {
        "match": obj
    }
};

module.exports.createTermCriteria = function (field, value) {
    var obj = {};
    obj[field] = value;

    return {
        "term": obj
    }
};

module.exports.createMissingCriteria = function (field) {
    return {
        "missing": {
            "field": field
        }
    }
};

module.exports.createExistsCriteria = function (field) {
    return {
        "exists": {
            "field": field
        }
    }
};

module.exports.createRangeCriteria = function (field, gte, lte) {
    var obj = {};
    obj[field] = {};

    if (gte !== undefined) {
        obj[field]["gte"] = gte;
    }
    if (lte !== undefined) {
        obj[field]["lte"] = lte;
    }

    return {
        "range": obj
    }
};

module.exports.createMultiMatchCriteria = function (query, fields) {
    return {
        "multi_match": {
            "query": query,
            "operator": "and",
            "fields": fields,
            "lenient": true,
            "type": "phrase_prefix"
        }
    }
};

module.exports.createPublicationCriteria = function (domain) {
    return {
        nested: {
            "path": "bookings",
            "filter": {
                "and": {
                    "filters": [
                        {
                            "term": {
                                "bookings.publications": domain
                            }
                        }
                    ]
                }
            }
        }
    }
};

module.exports.createOrContainerCriteria = function (matches) {
    return {
        "bool": {
            "should": matches
        }
    }
};

module.exports.createAndContainerCriteria = function (matches) {
    return {
        "bool": {
            "must": matches
        }
    }
};

module.exports.createMustNotContainerCriteria = function (matches) {
    return {
        "bool": {
            "must_not": matches
        }
    }
};