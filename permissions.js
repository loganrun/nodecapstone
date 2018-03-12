const permit = (...allowed) => {
  const isAllowed = role => allowed.includes(role);

  return (req, res, next) => {
    if(req.user && isAllowed(req.user.role)){
      next();
    }else{
      res.status(403).json({
        message: "You are not allowed to see this"
      })
    }
  }
}

module.exports = permit;