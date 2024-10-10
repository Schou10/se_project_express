const err400 ={
  message: "Invalid ID",
  status: 400
}
const err404 ={
  message: "No user/item found",
  status: 404
}

const err500 = {
  message: "An error has occurred on the server.",
  status: 500,
};


module.exports = {err400, err404, err500}