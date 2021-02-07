const Joi = require('joi')
const {response} = require('../wrapper')
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

const deleteFoto = async req => {
    if (req.files) {
        if (req.files['fotoId'].length >= 0) {
            req.files['fotoId'].map(async item => {
                try {
                    await unlinkAsync(item.path)
                } catch (error) {
                    console.log(error)
                }
            })
        } 
        if (req.files['logoSekolah'][0]){
            try {
                await unlinkAsync(req.files['logoSekolah'][0].path)
            } catch (error) {
                console.log(error)
            }
        }
        console.log('All Photo has been deleted')
    }else if (req.file) {
        await unlinkAsync(req.file.path)
    }
}

const validateBody = schema => {
    return async (req,res,next) => {
        const result = Joi.validate(req.body,schema,{abortEarly : false})
        if (result.error) {
            let errorData = []
            result.error.details.map(item => {
                let error = {
                    path : item.path[0],
                    message : item.message
                }
                errorData.push(error)
            })
            await deleteFoto(req)
            return response(res,false,errorData,'Validasi gagal',422)
        }
        next()
    }
}

module.exports = {
    validateBody,
    deleteFoto
}