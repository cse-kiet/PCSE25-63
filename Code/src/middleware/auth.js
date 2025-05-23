const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
  };
  
  const restrictToUserType = (allowedUserTypes) => {
      return (req, res, next) => {
          const userType = req.session.userType;
          if (allowedUserTypes.includes(userType)) {
              next();
          } else {
              res.status(403).send(`You can't access this module because you're logged as a ${userType}`);
          }
      };
  };
  
  module.exports = { requireAuth, restrictToUserType };
  