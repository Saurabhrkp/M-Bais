dburl = 'mongodb://localhost:27017/mbais';
// dburl =
//   'mongodb+srv://gymdb:password21@gymdb-paqxb.mongodb.net/dharvesh?retryWrites=true&w=majority';

const config = {
  region: 'ap-south-1',
  apiVersion: '2006-03-01',
  accessKeyId: 'AKIAJFFATXF22VKAFGPA',
  secretAccessKey: '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',
};

module.exports = {
  mongoURI: dburl,
  config: config,
};
