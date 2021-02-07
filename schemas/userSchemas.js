const Joi = require('joi')

const loginSchema = Joi.object().keys({
    email : Joi.string().email().required(),
    password : Joi.string().required().min(6),
})

const registerCpSchema = Joi.object().keys({
    token : Joi.string().required(),
    nama : Joi.string().min(3).required(),
    namaSekolah : Joi.string().required(),
    email : Joi.string().email().required(),
    notelp : Joi.string().min(6).required(),
    logoSekolah : Joi.any(),
    fotoId : Joi.any(),
})

const registerCtfSchema = Joi.object().keys({
    token : Joi.string().required(),
    namaTeam : Joi.string().min(3).required(),
    daerah : Joi.string().required(),
    namaSekolah : Joi.string().required(),
    logoSekolah : Joi.any(),
    dataPeserta : Joi.array().items(
        Joi.object({
            nama : Joi.string().min(3).required(),
            email : Joi.string().email().required(),
            notelp : Joi.string().min(6).required(),
            status : Joi.string().required()
        })
    )
})

const teamSchema = Joi.object().keys({
    nama : Joi.string().required(),
    kotaProvinsi : Joi.string().required(),
    leader : Joi.number().required(),
    member1 : Joi.number().required(),
    member2 : Joi.number().required()
})

module.exports = {
    loginSchema,
    teamSchema,
    registerCpSchema,
    registerCtfSchema
}