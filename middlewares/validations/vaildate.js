export const Validate = Schema => {
  return (req, res, next) => {
    let Inputs = { ...req.body, ...req.params, ...req.query };
    console.log(Inputs);
    let { error } = Schema.validate(Inputs, { abrotEarly: false });
    if (error) {
      let errors = error.details.map(detail => detail.message);
      res.status(406).json({ message: 'Not Valied Inputs', errors });
    } else {
      next();
    }
  };
};
