const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

const Usuario = require('../models/usuario');


const validarJWT = async (req, res, next) => {

    const token = req.header('token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición.'
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.SECRET);

        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario inexistente.'
            });
        };

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado false.'
            });
        };

        req.usuario = usuario;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido.'
        })
    };

};



module.exports = {
    validarJWT
};