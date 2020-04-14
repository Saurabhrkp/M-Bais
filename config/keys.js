// dburl = 'mongodb+srv://gymdb:S@urabh1997@gymdb-paqxb.mongodb.net/test?retryWrites=true&w=majority';
dburl = 'mongodb://localhost:27017/mbais';
// dburl =
//   'mongodb+srv://gymdb:password21@gymdb-paqxb.mongodb.net/dharvesh?retryWrites=true&w=majority';

bucketUrl = 'mech-bais.appspot.com';

module.exports = {
  mongoURI: dburl,
  bucketURI: bucketUrl,
};
