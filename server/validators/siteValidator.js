import Joi from 'joi';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const sanitizeHtml = (dirty) => {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href']
  });
};

const createSiteSchema = Joi.object({
  familyName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Nome da família é obrigatório',
      'string.min': 'Nome da família deve ter pelo menos 2 caracteres',
      'string.max': 'Nome da família deve ter no máximo 100 caracteres'
    }),
  message: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'Mensagem é obrigatória',
      'string.min': 'Mensagem deve ter pelo menos 10 caracteres',
      'string.max': 'Mensagem deve ter no máximo 2000 caracteres'
    }),
  photoUrl: Joi.string()
    .uri()
    .required()
    .messages({
      'string.empty': 'URL da foto é obrigatória',
      'string.uri': 'URL da foto deve ser válida'
    })
});

export const validateCreateSite = (req, res, next) => {
  const { error, value } = createSiteSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors
    });
  }

  if (value.message) {
    value.message = sanitizeHtml(value.message);
  }

  if (value.familyName) {
    value.familyName = sanitizeHtml(value.familyName);
  }

  req.validatedData = value;
  next();
};

export { createSiteSchema };

