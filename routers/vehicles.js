const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getVehicles,
  addVehicle,
  deleteVehicle,
} = require('../controllers/vehicles');

router.get(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  auth,
  getVehicles,
);

router.delete(
  '/:id',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      id: Joi.string().hex().max(24),
    }),
  }),
  auth,
  deleteVehicle,
);

router.post(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      model: Joi.string().required(),
      manufacturer: Joi.string().required(),
      title: Joi.string().required(),
      comment: Joi.string(),
      type: Joi.string().required(),
      year: Joi.number().integer().min(1900).max(2040),
      image: Joi.string()
        .required()
      // eslint-disable-next-line no-useless-escape
        .pattern(/https?:\/\/[a-zA-Z0-9\/.\-]+\.+[a-zA-Z0-9\/.-]+#?/),
    }),
  }),
  auth,
  addVehicle,
);

module.exports = router;
