exports.errorHandler = (error, req, res, next) => {
  if (error.statusCode == 401 && error.message === "notLogin") {
    res.redirect("/panel/login");
  }
  if (error.statusCode == 401 && error.message === "userOrPassInCorrect") {
    res.status(401).send("username or password incorrect!");
  } else if (error.statusCode == 403 && error.message === "notAccessible") {
    res.render("panel/notAccessible");
  } else if (error.statusCode == 422) {
    return res.status(422).json({
      status: 422,
      message: error.message,
    });
  } else {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.end(`<pre>
        ${message}
        Error Status : ${status}
        =======================Error Data============================
        ${data}
        </pre>`);
  }
  //res.status(status).json({ message, data });
};
