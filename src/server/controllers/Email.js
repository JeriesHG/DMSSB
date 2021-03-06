let nodemailer = require('nodemailer');
let Client = require('../models/Client');
let Document = require('../models/Document');
var ObjectId = require('mongoose').Types.ObjectId;
var log = require('../../../logger');

var _0x9478 = ["\x6D\x61\x69\x6C\x2E\x74\x65\x72\x72\x61\x2D\x65\x6E\x65\x72\x67\x69\x61\x2E\x63\x6F\x6D", "\x61\x64\x6D\x69\x6E\x2E\x63\x64\x40\x74\x65\x72\x72\x61\x2D\x65\x6E\x65\x72\x67\x69\x61\x2E\x63\x6F\x6D", "\x43\x44\x2E\x61\x64\x6D\x24\x32\x30\x31\x37"];

var transporter = nodemailer.createTransport({
  port: 587,
  host: _0x9478[0],
  auth: {
    user: _0x9478[1],
    pass: _0x9478[2]
  }
});
var _0xfe93 = ["\x61\x64\x6D\x69\x6E\x2E\x63\x64\x40\x74\x65\x72\x72\x61\x2D\x65\x6E\x65\x72\x67\x69\x61\x2E\x63\x6F\x6D"];
var sender = _0xfe93[0]

module.exports.sendRejectedDocument = function(req, res, next) {
  Document.findOne({
    _id: req.params.docId
  }, (error, doc) => {
    if (error) {
      res.status(500);
      next(error);
      return res.send(error);
    }
    if (doc.createdBy && doc.createdBy._id) {
      Client.findOne({
        _id: doc.createdBy._id
      }, (error, client) => {
        if (error) {
          res.status(500);
          next(error);
          return res.send(error);
        }

        if (client.email) {
          let newEmail = {
            from: sender,
            subject: `Documento ${doc.name} fue rechazado`,
            to: client.email,
            html: `El documento ${doc.name} ha sido ${doc.type.blueprint ? 'rechazado' : doc.status.toLowerCase()} por ${req.params.clientName}. Por favor revise los comentarios escritos dentro del documento. `
          };


          transporter.sendMail(newEmail, (error, info) => {
            if (error) {
              next(error);
              return res.send(error);
            }

            log.info(`Email sent to ${client.email} for ${doc.name}`);
            res.send("OK");
          });
        } else {
          res.send("El usuario no tiene correo electronico");
        }
      });
    }
  });
}

module.exports.expiredDocumentCheck = function() {
  Document.find({
    expiredDate: {
      $ne: null
    },
    "flow.published": true
  }, (error, docs) => {
    if (error) {
      log.crit(error);
      return error;
    }

    let aboutToExpireDocs = docs.filter((doc) => {
      let expiredDate = new Date(doc.expiredDate);
      let today = new Date();

      var utc1 = Date.UTC(expiredDate.getFullYear(), expiredDate.getMonth(), expiredDate.getDate());
      var utc2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

      let difference = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));

      return differencesssss <= 60;
    });

    aboutToExpireDocs.forEach((doc) => {
      if (doc.createdBy && doc.createdBy._id) {
        Client.findOne({
          _id: doc.createdBy._id
        }, (error, client) => {
          if (error) {
            log.crit(error);
            return error;
          }

          if (client.email) {
            let newEmail = {
              from: sender,
              subject: `Documento ${doc.name} esta por expirar!`,
              to: client.email,
              html: `El documento ${doc.name} vence el ${doc.expiredDate.toISOString().substring(0, 10)}. Por favor realice una revision al documento.`
            };


            transporter.sendMail(newEmail, (error, info) => {
              if (error) {
                log.crit(error);
                return error;
              }

              log.info(`Email sent to ${client.email} for ${doc.name}`);
            });
          } else {
            log.info("El usuario no tiene correo electronico");
          }
        });
      } else {
        log.info("No tiene solicitante");
      }
    });
  });
}

module.exports.sendDocumentReminder = function(req, res, next) {
  Document.findOne({
    _id: req.params.docId
  }, (error, doc) => {
    if (error) {
      res.status(500);
      next(error);
      return res.send(error);
    }

    let users = req.body.users;
    let promises = [];

    if (!users || users.length === 0) {
      promises.push(
        Client.find({
          documentaryCenterAdmin: true
        }).exec()
      );
    } else {
      let ids = users.map(e => ObjectId(e));

      promises.push(
        Client.find({
          _id: {
            $in: ids
          }
        }).exec()
      );
    }

    Promise.all(promises).then(values => {
      let emails = [];
      values.forEach(value => {
        emails.push(value.filter(e => e.email !== undefined).map(e => e.email));
      });

      if (emails.length > 0) {
        let newEmail = {
          from: sender,
          subject: `Revision pendiente de ${doc.name}`,
          to: emails.join(", "),
          html: `Usted tiene una revision pendiente para el documento ${doc.name}. Por favor ingresar a la aplicacion web y en la seccion de pendientes se mostrara el documento disponible.`
        };

        transporter.sendMail(newEmail, (error, info) => {
          if (error) {
            next(error);
            return res.send(error);
          }

          log.info(`Email sent to ${emails.join(", ")} for ${doc.name}`);
          res.send("OK");
        });
      } else {
        log.info(`No se encontraron correos electronicos para el documento ${doc.name}`);
        res.status(204).send("No Emails found");
      }
    });
  });
}
