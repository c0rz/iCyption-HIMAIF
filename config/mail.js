const nodemailer = require('nodemailer');
require('dotenv').config()
const { MAIL_PASS } = process.env

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'icyptionhimaiftelkom@gmail.com',
    pass: MAIL_PASS
  }
});


async function sendMail(receiver,nama, username, password) {
  const hasil = []
  for(let i = 0; i<receiver.length; i++) {
    const mailOptions = {
      from: `"Icyption HIMA IF Telkom University" <icyptionhimaiftelkom@gmail.com>`,
      to: receiver[i],
      subject: 'Pendafaran Icyption 2020',
      text: `
Haloo ${nama[i]} ...

Selamat, registrasi anda telah berhasil.

Berikut adalah username dan password yang akan digunakan nanti.

Username = ${username}
Password = ${password}

Simpan baik-baik username dan password kalian yaa :)

`
    };
 
    const response = await transporter.sendMail(mailOptions)
    hasil.push(response)
      // if (error) {  
      //   console.log(error);
      //   error
      // } else {
      //   console.log('Email sent: ' + info.response);
      // }
  }
  return hasil
}

module.exports = {
  sendMail
}

// sendMail(['alifnaufalyasin@gmail.com'],['Alif N'], 'usernameas', 'passwasd')