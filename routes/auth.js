const {check} = require('express-validator');
const {Router} = require('express');

const { login, googleSign } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio.').isEmail(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'El id_token es necesario.').not().isEmpty(),
    validarCampos
], googleSign);



module.exports = router;