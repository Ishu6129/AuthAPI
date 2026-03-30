import { schemas } from "../validators/auth.validator.js";

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    // If schema not found for the given name, return error
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: `Validation schema '${schemaName}' not found`,
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true, // remove unwanted fields
    });

    //If Validation failed
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((err) => err.message),
      });
    }

    //req.body with cleaned data
    req.body = value;

    next();
  };
};

export default validate;