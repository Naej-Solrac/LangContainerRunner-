const response = {
  success: (req, res, status, message, data) => {
    res.send(status || 200).json({
      message,
      data,
    });
  },


  //Responder en Json
  success_json: (req, res, status, data) => {
    res.sendStatus(status || 200).json({
      data,
    });
  },

  //Responder sin la variable data
  success_plain: (req, res, status, message) => {
    res.send(status || 200).send(message);
  },

  error: (req, res, status, message, error) => {
    console.log(error)
    res.sendStatus(status || 500).json({
      error: message,
    });
  },
};

module.exports  = response