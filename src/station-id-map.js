const [latitude, longitude] = process.env.SKY_LOCATION.split(',').map(v => parseFloat(v));
module.exports = {
    19: {
        davId: '0x1df62f291b2e969fb0849d99d9ce41e2f137006e',
        id: 19,
        name: 'Rosie',
        price: '22e16',
        location: {
            longitude: longitude,
            latitude: latitude,
        },
        max_charging_velocity: 30,
        status: 'Available',
    },
    18: {
        davId: '0xaca94ef8bd5ffee41947b4585a84bda5a3d3da6e',
        id: 18,
        name: 'Bender',
        price: '5e16',
        location: {
            longitude: longitude,
            latitude: latitude
        },
        max_charging_velocity: 30,
        status: 'Available',
    },
    3: {
        davId: '0xF0D5BC18421fa04D0a2A2ef540ba5A9f04014BE3',
        id: 17,
        name: 'Nairobi',
        price: '4e16',
        location: {
            longitude: longitude,
            latitude: latitude
        },
        max_charging_velocity: 30,
        status: 'Available',
    },
    4: {
        davId: '0x66FC63C2572bF3ADD0Fe5d44b97c2E614E35e9a3',
        id: 16,
        name: 'Rusty',
        price: '5e16',
        location: {
            longitude: longitude,
            latitude: latitude
        },
        max_charging_velocity: 30,
        status: 'Available',
    },
    5: {
        davId: '0xf408f04F9b7691f7174FA2bb73ad6d45fD5d3CBe',
        id: 15,
        name: 'Isumoid',
        price: '6e16',
        location: {
            longitude: longitude,
            latitude: latitude
        },
        max_charging_velocity: 30,
        status: 'Available',
    },
    6: {
        davId: '0x2F560290FEF1B3Ada194b6aA9c40aa71f8e95598',
        id: 14,
        name: 'Golem',
        price: '7e16',
        location: {
            longitude: longitude,
            latitude: latitude
        },
        max_charging_velocity: 30,
        status: 'Available',
    },
};