const [latitude, longitude] = process.env.SKY_LOCATION.split(',').map(v => parseFloat(v));
module.exports = {
  11: {
    davId: '0x1df62f291b2e969fb0849d99d9ce41e2f137006e',
    id: 11,
    name: 'Rosie',
    price: '22e12',
    location: {
      longitude: longitude,
      latitude: latitude,
    },
    max_charging_velocity: 30,
    status: 'Available',
    drone_types: ['phantom3','phantom4']
  },
  12: {
    davId: '0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e',
    id: 12,
    name: 'Bender',
    price: '5e12',
    location: {
      longitude: longitude,
      latitude: latitude
    },
    max_charging_velocity: 30,
    status: 'Available',
    drone_types: ['phantom3','phantom4']
  },
  13: {
    davId: '0x397776b35874f8c84ce288fedd9b684118774386',
    id: 13,
    name: 'Nairobi',
    price: '4e12',
    location: {
      longitude: longitude,
      latitude: latitude
    },
    max_charging_velocity: 30,
    status: 'Available',
    drone_types: ['matrice100']
  },
  14: {
    davId: '0x680a0047b7b1af651d920722ea70cc0c055f4693',
    id: 14,
    name: 'Rusty',
    price: '5e12',
    location: {
      longitude: longitude,
      latitude: latitude
    },
    max_charging_velocity: 30,
    status: 'Available',
    drone_types: ['matrice200','matrice210','matrice210rtk']
  },
  15: {
    davId: '0xe71275245102f4b85092765aba7d29efdcb079cf',
    id: 15,
    name: 'Isumoid',
    price: '6e12',
    location: {
      longitude: longitude,
      latitude: latitude
    },
    max_charging_velocity: 30,
    status: 'Available',
    drone_types: ['yuneecTyphoon','yuneecH920','yuneecH520']
  },
//   16: {
//     davId: '0x2F560290FEF1B3Ada194b6aA9c40aa71f8e95598',
//     id: 16,
//     name: 'Golem',
//     price: '7e16',
//     location: {
//       longitude: longitude,
//       latitude: latitude
//     },
//     max_charging_velocity: 30,
//     status: 'Available',
//     drone_types: ['phantom']
//   },
};