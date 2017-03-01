import { Deputes } from './models'

export default function (app) {

  app.get('/api/dataviz_bubble/groupBy/:groupBy', (req, res) => {
    const groupBy = req.params.groupBy.replace('-','.')
    Deputes.aggregate([
        {
            $group: {
                _id: { "groupe": "$" + groupBy, "sexe": "$sexe" },
                count: {$sum: 1}
            }
        }
    ], (err, deputeDetails) => {
      if (err) { res.send(err) }
      res.json(deputeDetails) // return all nerds in JSON format
    })
  })

  app.get('/api/dataviz_bubble/age_range/:range', (req, res) => {
    const range = parseInt(req.params.range)
    Deputes.aggregate([
        { $match : { "date_naissance" : { $exists : true} } },
        { $project : {"ageInMillis" : {$subtract : [new Date(), "$date_naissance"] }, "sexe":1} },
        { $project : {"age" : {$divide : ["$ageInMillis", 31558464000] }, "sexe":1}},
        { $project : {"age" : {$subtract : ["$age", {$mod : ["$age",range]}]}, "sexe":1}},
        { $project : {"age" : {$substr: ["$age",0,-1]},"age2":{$substr: [{$add:['$age',range]} ,0,-1]}, "sexe":1}},
        { $project : {"age" : {$concat : ["$age","-", "$age2"," ans"]}, "sexe":1}},
        { $group : { _id : {"groupe":"$age","sexe":"$sexe"}, count : { $sum : 1} } }
    ], (err, deputeDetails) => {
      if (err) { res.send(err) }
      res.json(deputeDetails) // return all nerds in JSON format
    })
  })
}