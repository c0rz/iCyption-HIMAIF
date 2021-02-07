const router = require('express-promise-router')()
const userController = require('../controllers/userController')
const upload = require('../helpers/upload')
// validation
const {validateBody} = require('../helpers/validator/validateBody')
const validator = require('../helpers/validator/userValidator')
const userSchemas = require('../schemas/userSchemas')
// jwt strategy
const passport = require('passport')
const authConfig = require('../helpers/auth')
const { sendMail } = require('../config/mail')

router.route('/')
    .get(passport.authenticate('jwt',{session : false}), userController.index)

router.route('/login')
    .post( 
        validateBody(userSchemas.loginSchema) , 
        userController.login
    )

router.route('/registerCp')
    .post(
        upload.fields([
            {name : "fotoId", maxCount : 1},
            {name : "logoSekolah" , maxCount : 1}
        ]),
        validateBody(userSchemas.registerCpSchema),
        validator.validateEmail(),
        validator.validateCaptcha(),
        userController.registerCp
    )

router.route('/registerCtf')
    .post(
        upload.fields([
            {name : "fotoId", maxCount : 3},
            {name : "logoSekolah" , maxCount : 1}
        ]),
        validator.parseDataPeserta(),
        validateBody(userSchemas.registerCtfSchema),
        validator.validateAllEmail(),
        validator.validateCaptcha(),
        userController.registerCtf
    )

router.route('/cekEmail/:email')
    .get(userController.cekEmail)

router.route('/cekUsername/:username')
    .get(userController.cekUsername)

router.route('/cekEmail')
    .get(async(req,res)=>{
        await sendMail(['alifnaufalyasin@gmail.com'],['Alif'],'usernamenih', 'passwordapaaja')
        // res.json({message : 'mail sent'})
    })


module.exports = router