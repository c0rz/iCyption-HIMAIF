const multer = require('multer')

const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg' ||file.mimetype === 'image/gif' || file.mimetype === 'image/png') {
        cb(null,true)
    }else {
        const err = new Error('Terdapat Extensi gambar yang tidak sesuai, silahkan cek kembali kelengkapan informasi')
        err.status = 422 
        cb(err, false)
    }
}

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        let folderName = "Icyption2020/"
        if (file.fieldname == 'logoSekolah') folderName += "logo"
        else folderName += "fotoId"
        cb(null,folderName) 
    },
    filename : (req,file,cb) => {
        console.log(file)
        let name = Date.now() + "_" + file.originalname
        cb(null,name)
    }
})

const upload = multer({
    storage,
    limits : {
        fileSize : 1024*1024*5
    },
    fileFilter
})

module.exports = upload