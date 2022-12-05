const Vehicle = require('../models/vehicle');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getVehicles = (req, res, next) => {
  Vehicle.find({ owner: req.user._id })
    .then((vehicles) => res.send({ data: vehicles }))
    .catch(next);
};

module.exports.deleteVehicle = (req, res, next) => {
  Vehicle.findById(req.params.id)
    .populate('owner')
    .then((vehicle) => {
      if (!vehicle) {
        throw new NotFoundError('Транспортное средство не найдено');
      }
      if (vehicle.owner._id.toString() === req.user._id) {
        return Vehicle.findByIdAndRemove(req.params.id).then((a) => res.send({ data: a }));
      }
      throw new ForbiddenError('ТС принадлежит другому пользователю');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан некорректный идентификатор');
      }
      next(err);
    })
    .catch(next);
};

module.exports.addVehicle = (req, res, next) => {
  const {
    model, manufacturer, title, comment, type, year, image,
  } = req.body;
  const userId = req.user._id;
  Vehicle.create({
    model,
    manufacturer,
    title,
    comment,
    type,
    year,
    image,
    owner: userId,
  })
    .then((vehicle) => res.send({ data: vehicle }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          `Переданы некорректные данные: ${err.message}`,
        );
      }
    })
    .catch(next);
};
