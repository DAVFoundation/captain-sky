const [latitude, longitude] = process.env.SKY_LOCATION.split(',').map(v => parseFloat(v));
module.exports = {
    11: {
        davId: '0x59a469331ebc94e97b579e66de2f92578379777f',
        id: 11,
        name: 'Rosie',
        price: '22e16',
        location: {
            longitude: longitude,
            latitude: latitude,
        },
        max_charging_velocity: 30,
        status: 'Available',
        drone_types: ['mavic', 'matrice', 'phantom']
    },
    12: {
        davId: '0xd319031c21f05b576ce662057190e8c49fdb5836',
        id: 12,
        name: 'Bender',
        price: '5e16',
        location: {
            longitude: longitude,
            latitude: latitude
        },
        max_charging_velocity: 30,
        status: 'Available',
        drone_types: ['mavic', 'matrice', 'phantom']
    },
    13: {
        davId: '0x397776b35874f8c84ce288fedd9b684118774386',
        id: 13,
        name: 'Nairobi',
        price: '4e16',
        location: {
            longitude: longitude,
            latitude: latitude
        },
        max_charging_velocity: 30,
        status: 'Available',
        drone_types: ['mavic']
    },
    14: {
        davId: '0x680a0047b7b1af651d920722ea70cc0c055f4693',
        id: 14,
        name: 'Rusty',
        price: '5e16',
        location: {
            longitude: longitude,
            latitude: latitude
        },
        max_charging_velocity: 30,
        status: 'Available',
        drone_types: ['matrice', 'phantom']
    },
    15: {
        davId: '0xe71275245102f4b85092765aba7d29efdcb079cf',
        id: 15,
        name: 'Isumoid',
        price: '6e16',
        location: {
            longitude: longitude,
            latitude: latitude
        },
        max_charging_velocity: 30,
        status: 'Available',
        drone_types: ['mavic', 'phantom']
    },
    // 16: {
    //     davId: '0x2F560290FEF1B3Ada194b6aA9c40aa71f8e95598',
    //     id: 16,
    //     name: 'Golem',
    //     price: '7e16',
    //     location: {
    //         longitude: longitude,
    //         latitude: latitude
    //     },
    //     max_charging_velocity: 30,
    //     status: 'Available',
    //     drone_types: ['phantom']
    // },
};