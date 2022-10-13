


const esAdmin = (req, res, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere válidar el role sin válidar el token pirmero.'
        });
    };

    const {rol, nombre} = req.usuario;

    if ( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto.`
        });
    };

    next();
};

const tieneRole = (...roles) => {

    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere válidar el role sin válidar el token pirmero.'
            });
        };

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        };

        next();
    };
};



module.exports = {
    esAdmin,
    tieneRole
}