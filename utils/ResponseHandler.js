import Response from "./Response.js";

const responseMiddleware = (req, res, next) => {
  res.ok = (message = "Success", data = null) => {
    return res.status(200).json(new Response(message, data));
  };

  res.created = (message = "Resource created", data = null) => {
    return res.status(201).json(new Response(message, data));
  };

  res.bad_request = (message = "Validation error", data = null) => {
    return res.status(400).json(new Response(message, data));
  };

  res.not_found = (message = "Resource not found", data = null) => {
    return res.status(404).json(new Response(message, data));
  };

  res.server_error = (message = "Something went wrong", data = null) => {
    return res.status(500).json(new Response(message, data));
  };

  next();
};

export default responseMiddleware;
