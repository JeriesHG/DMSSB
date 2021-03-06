let Business = require('../models/Business');
let Department = require('../models/Department');

module.exports.readAll = function(req, res, next) {
  Business.find({}, function(error, business) {
    if (error) {
      res.status(500);
      next(error);
      return res.send(error);
    }

    res.json(business);
  });
}

module.exports.create = function(req, res, next) {
  let business = new Business(req.body);

  business.save(function(error, business) {
    if (error) {
      res.status(500);
      next(error);
      return res.send(error);
    }

    res.json(business);
  });
}

module.exports.update = function(req, res, next) {
  Business.findOne({
    _id: req.params.id
  }, function(error, business) {
    if (error) {
      res.status(500);
      next(error);
      return res.send(error);
    }

    let prevBusiness = business.business;

    for (prop in req.body) {
      business[prop] = req.body[prop];
    }

    business.save(function(error) {
      if (error) {
        res.status(500);
        next(error);
        return res.send(error);
      }

      Department.update({
          business: prevBusiness
        }, {
          $set: {
            "business.$": business.business
          }
        }, {
          "multi": true
        },
        function(error, result) {
          if (error) {
            res.status(500);
            next(error);
            return res.send(error);
          }
        });

      res.json(business);
    });
  });
}

module.exports.delete = function(req, res, next) {
  Business.remove({
    _id: req.params.id
  }, function(error, business) {
    if (error) {
      res.status(500);
      next(error);
      return res.send(error);
    }

    res.json(business);
  });
}

module.exports.find = function(req, res, next) {
  Business.findOne({
    _id: req.params.id
  }, function(error, business) {
    if (error) {
      res.status(500);
      next(error);
      return res.send(error);
    }

    res.json(business);
  });
}
