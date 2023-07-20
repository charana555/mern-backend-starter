const notFoundMiddleware = (req, res) =>
  res.status(404).send("Route doesn't Exists");

export default notFoundMiddleware;
