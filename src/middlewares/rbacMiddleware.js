const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ erro: 'Acesso negado. Permissão insuficiente.' });
    }

    return next();
  };
};

module.exports = { authorize };
