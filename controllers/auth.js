const bcryptjs = require('bcryptjs');
const { json } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const Usuario = require('../models/usuario');


const login = async (req, res) => {

    const {correo, password} = req.body;

    try {

        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Correo no existen.'
            });
        };

        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Correo no existen. -- estado: false.'
            });
        };

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña incorrecta.'
            });
        };

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el admin'
        })
    }

};


const googleSign = async (req, res) => {
    const {id_token} = req.body;

    try {
        
        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});


        if (!usuario) {
            const data = {
                nombre, 
                correo,
                password: ':b',
                img,
                rol: "USER_ROLE",
                google: true
            };
            
            usuario = new Usuario(data);
            await usuario.save();
        };

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el admin, usuario bloqueado.'
            });
        };

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar.'
        })
    }

};




module.exports = {
    login,
    googleSign
};