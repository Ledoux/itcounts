'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.setApisWithAppAndModel = setApisWithAppAndModel;

var _sAge = require('s-age');

var _sAge2 = _interopRequireDefault(_sAge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setApisWithAppAndModel(app, model) {
  // unpack
  var Deputes = model.Deputes;

  if (!Deputes) {
    return;
  }
  // safe
  function isDb(req, res, next) {
    if (!Deputes) {
      res.json({});
    } else {
      next();
    }
  }
  // routes
  app.get('/api/dataviz_bubble/groupBy/:groupBy', isDb, function (req, res) {
    var groupBy = req.params.groupBy.replace('-', '.');
    Deputes.aggregate([{
      $group: {
        _id: { "groupe": "$" + groupBy, "sexe": "$sexe" },
        count: { $sum: 1 }
      }
    }], function (err, deputeDetails) {
      if (err) {
        res.send(err);
      }
      res.json(deputeDetails // return all nerds in JSON format
      );
    });
  });
  app.get('/api/dataviz_bubble/age_range/:range', isDb, function (req, res) {
    var range = parseInt(req.params.range);
    Deputes.aggregate([{ $match: { "date_naissance": { $exists: true } } }, { $project: { "ageInMillis": { $subtract: [new Date(), "$date_naissance"] }, "sexe": 1 } }, { $project: { "age": { $divide: ["$ageInMillis", 31558464000] }, "sexe": 1 } }, { $project: { "age": { $subtract: ["$age", { $mod: ["$age", range] }] }, "sexe": 1 } }, { $project: { "age": { $substr: ["$age", 0, -1] }, "age2": { $substr: [{ $add: ['$age', range] }, 0, -1] }, "sexe": 1 } }, { $project: { "age": { $concat: ["$age", "-", "$age2", " ans"] }, "sexe": 1 } }, { $group: { _id: { "groupe": "$age", "sexe": "$sexe" }, count: { $sum: 1 } } }], function (err, deputeDetails) {
      if (err) {
        res.send(err);
      }
      res.json(deputeDetails // return all nerds in JSON format
      );
    });
  });
  app.get('/api/dataviz_bubble_V2', isDb, function (req, res) {
    Deputes.aggregate([{ $unwind: "$groupes_parlementaires" }, {
      $group: {
        _id: { "groupe": "$groupes_parlementaires.responsabilite.fonction", "sexe": "$sexe" },
        count: { $sum: 1 }
      }
    }], function (err, deputeDetails) {
      if (err) {
        res.send(err);
      }
      res.json(deputeDetails // return all nerds in JSON format
      );
    });
  });
  app.get('/api/hemicycle/form', isDb, function (req, res) {
    Deputes.aggregate([{ "$group": { "_id": { sigle: "$groupe_sigle", groupe: "$groupe.organisme" } } }, { "$sort": { "_id.groupe": 1 } }], function (err, groupes) {
      if (err) {
        res.send(err);
      }
      Deputes.aggregate([{ $group: { _id: 1, max: { $max: "$nb_mandats" },
          min: { $min: "$nb_mandats" } } }], function (err, nb_mandats) {
        if (err) {
          res.json(err);
        }
        Deputes.aggregate([{ $project: { "ageInMillis": { $subtract: [new Date(), "$date_naissance"] } } }, { $project: { "age": { $divide: ["$ageInMillis", 31558464000] } } }, { $project: { "age": { $subtract: ["$age", { $mod: ["$age", 1] }] } } }, { $group: { _id: 1, max: { $max: "$age" }, min: { $min: "$age" } } }], function (err, dates_naissance) {
          if (err) {
            res.json(err);
          }
          Deputes.aggregate([{ "$group": { "_id": { num: "$region.num", nom: "$region.nom" } } }, { "$sort": { "_id.nom": 1 } }], function (err, region) {
            if (err) {
              res.json(err);
            }
            res.render('formulaire_hemicycle', {
              political_group: groupes,
              region: region,
              minNbMandat: nb_mandats[0].min,
              maxNbMandat: nb_mandats[0].max,
              minAge: dates_naissance[0].min,
              maxAge: dates_naissance[0].max
            });
          });
        });
      });
    });
  });
  app.get('/api/hemicycle/view', isDb, function (req, res) {
    Deputes.aggregate([{ "$group": { "_id": { sigle: "$groupe_sigle", groupe: "$groupe.organisme" } } }, { "$sort": { "_id.groupe": 1 } }], function (err, groupes) {
      if (err) {
        res.send(err);
      }
      Deputes.aggregate([{ $group: { _id: 1, max: { $max: "$nb_mandats" },
          min: { $min: "$nb_mandats" } } }], function (err, nb_mandats) {
        if (err) {
          res.json(err);
        }
        Deputes.aggregate([{ $project: { "ageInMillis": { $subtract: [new Date(), "$date_naissance"] } } }, { $project: { "age": { $divide: ["$ageInMillis", 31558464000] } } }, { $project: { "age": { $subtract: ["$age", { $mod: ["$age", 1] }] } } }, { $group: { _id: 1, max: { $max: "$age" }, min: { $min: "$age" } } }], function (err, dates_naissance) {
          if (err) {
            res.json(err);
          }
          Deputes.aggregate([{ "$group": { "_id": { num: "$region.num", nom: "$region.nom" } } }, { "$sort": { "_id.nom": 1 } }], function (err, region) {
            if (err) {
              res.json(err);
            }
            res.render('hemicycle', {
              formData: {
                political_group: groupes,
                region: region,
                minNbMandat: nb_mandats[0].min,
                maxNbMandat: nb_mandats[0].max,
                minAge: dates_naissance[0].min,
                maxAge: dates_naissance[0].max
              }
            });
          });
        });
      });
    });
  });
  app.get('/api/hemicycle/search', isDb, function (req, res) {
    var criteres = req.query;
    var query = '';
    if (Object.keys(criteres).length > 0) {
      query = { $and: [] };
      Object.keys(criteres).forEach(function (key) {
        var subCondition;
        if (_typeof(criteres[key]) == 'object') {
          subCondition = { $or: [] };
          criteres[key].forEach(function (item) {
            subCondition.$or.push(getCondition(key, item));
          });
        } else {
          subCondition = getCondition(key, criteres[key]);
        }
        query.$and.push(subCondition);
      });
    }
    Deputes.find(query, { nom: 1, sexe: 1, place_en_hemicycle: 1, url_an: 1 }, function (err, cursor) {
      if (err) {
        res.json(err);
      }
      res.json(cursor);
    });
  });
}

function getCondition(key, value) {
  var modif = key == "region.num" ? function (v) {
    return v.toString();
  } : function (v) {
    return Number(v);
  };
  var condition = {};
  var arrayKey = key.split('-');
  if (arrayKey.length > 1) {
    var subCondition = {};
    if (arrayKey[0] == "date_naissance") {
      subCondition['$' + arrayKey[1]] = new Date(value);
    } else if (key == 'region.num') {
      subCondition['$' + arrayKey[1]] = value.toString();
    } else {
      subCondition['$' + arrayKey[1]] = Number(value);
    }
    condition[arrayKey[0]] = subCondition;
  } else {
    condition[key] = isNaN(value) ? value : modif(value);
  }
  return condition;
}