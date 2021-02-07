const {response,customError} = require('../helpers/wrapper')
const {hashPassword,comparePassword} = require('../helpers/hash')
const jwt = require('jsonwebtoken')
const {User} = require('../models/user')
const {Team} = require('../models/team')
const {deleteFoto} = require('../helpers/validator/validateBody')
const { sendMail } = require('../config/mail')

const signToken = user => {
    return token = jwt.sign({
        iss : 'icryption',
        sub : user.id,
        iat : Date.now()
    } , process.env.API_KEY , {expiresIn : '24h'})
}

const generateUserPass = (team) => {
    const username = 'icyption' + team.id
    const password = Password(10);
    return {username,password}
}

const Password = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const index = async (req,res,next) => {
    const user = await User.findAll({})
    response(res,true,user,'Semua data sudah ditampilkan',200)
}

const login = async (req,res,next) => {
    const {email,password} = req.body
    const user = await User.findOne({where : {email}})
    // cek email valid atau tidak
    if (!user) return next(customError('Email yang dimasukan tidak benar',401))
    const result = comparePassword(password,user.password)
    // cek password
    if (!result) return next(customError('Password yang dimasukan tidak benar',401))
    // sign token
    const token = signToken(user)
    response(res,true,{token},'Login berhasil',200)
}

const registerCp = async (req,res,next) => {
    if (!req.files || req.files.success == false) return response(res,false,null,'Foto yang anda upload gagal atau kosong',422)
    // create user
    const namaSekolah = req.body.namaSekolah
    delete req.body.namaSekolah
    const user = new User(req.body)
    user.fotoId = req.files['fotoId'][0].filename
    const logoSekolah = req.files['logoSekolah'][0].filename
    console.log(namaSekolah)
    user.status = 'Leader'
    await user.save()
    // create team 
    const team = await Team.create(
        {
            namaSekolah : namaSekolah,
            logoSekolah : logoSekolah,
            status : 'CP'
        }
    )
    // assign username and password team
    const {username,password} = generateUserPass(team)
    team.username = username
    team.password = hashPassword(password)
    await team.save()
    // tambahkan relasi
    await user.setTeam(team)
    //send email
    const responseMail = await sendMail([user.email],[user.nama], username, password)
    // response(res,true,responseMail,'test',201)
    response(res,true,{user,team},'Berhasil melakukan registrasi lomba CP, silahkan cek kembali email yang sudah anda daftarkan untuk melihat username dan password yang anda dapatkan',201)
}

const registerCtf = async (req,res,next) => {
    if (!req.files) return response(res,false,null,'Photo is null',422)
    const {namaTeam, daerah,dataPeserta} = req.body
    const {files} = req
    const namaSekolah = req.body.namaSekolah
    delete req.body.namaSekolah
    let pesertaArr = []
    
    if (dataPeserta.length !== files.fotoId.length) {
        await deleteFoto(req)
        return response(res,false,null,'Tidak dapat memproses data yang kurang, silahkan lengkapi data (foto id atau logo sekolah) atau hubungi panitia',422)
    }
    // create team
    const team = await Team.create({
        namaTeam ,
        daerah,
        namaSekolah : namaSekolah,
        logoSekolah : files['logoSekolah'][0].filename,
        status : 'CTF',
    })
    // assign username and password
    const {username,password} = generateUserPass(team)
    team.username = username
    team.password = hashPassword(password)
    await team.save()
    // create user
    let userEmail = []
    let userNama = []
    for (let i = 0; i < dataPeserta.length; i++) {
        let {nama,email,notelp,status} = dataPeserta[i]
        let index = pesertaArr.length
        let user = await User.create({
            nama,email,notelp,status,
            fotoId : files['fotoId'][index].filename
        })
        pesertaArr.push(user)
        userEmail.push(user.email)
        userNama.push(user.nama)
        await user.setTeam(team)
    }
    //send email
    await sendMail(userEmail,userNama, username, password)
    response(res,true,{team,pesertaArr},'Berhasil melakukan registrasi lomba CTF, silahkan cek kembali email yang sudah anda daftarkan untuk melihat username dan password yang anda dapatkan',201)
}

const cekEmail = async (req,res,next) => {
    const email = req.params.email
    const user = await User.findOne({where : {email}})
    if (user) return response(res,false,null,'Email sudah digunakan',400)
    response(res,true,null,'Email tersedia',200)
}

const cekUsername = async (req,res,next) => {
    const username = req.params.username
    const team = await Team.findOne({where : {username}})
    if (team) return response(res,false,null,'Username sudah digunakan',400)
    response(res,true,null,'Username tersedia',200)
}

module.exports = {
    index,
    login,
    registerCp,
    registerCtf,
    cekEmail,
    cekUsername
}