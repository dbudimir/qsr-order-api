secretKey = makeid = () => {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   // return result;
}

// console.log(makeid());

module.exports = {
   jwtSecret: 'secretKey',
   jwtSession: {
      session: false
   }
}

// module.exports = {
//    jwtSecret: 'JwtS3cr3tK3Y',
//    jwtSession: {
//       session: false
//    }
// }