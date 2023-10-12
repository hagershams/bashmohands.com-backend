const Response = (res, message = '', statusCode = 500, data = {}) => {
  const statusMessage =
    `${statusCode}`.startsWith(4) || `${statusCode}`.startsWith(5)
      ? 'fail'
      : 'success';
  return res.status(statusCode).json({
    status: statusMessage,
    length: data.length,
    message,
    data,
  });
};

export default Response;
