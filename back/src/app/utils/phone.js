import seedRandom from "seedrandom";

export const generatePhoneNumbers = (count, seed) => {
    const phoneNumbers = [];
    const rng = new seedRandom(seed);
    for (let i = 0; i < count; i++) {
        let phone = generatePhoneNumber(rng);
        while (phoneNumbers.includes(phone)) {
            phone = generatePhoneNumber(rng);
        }
        phoneNumbers.push(phone);
    }
    return phoneNumbers;
};

export const generatePhoneNumber = (rng) => {
    let phoneNumber = [];
    phoneNumber.push(0);
    if (rng() > 0.5) {
        phoneNumber.push(7);
    } else {
        phoneNumber.push(6);
    }
    for (let i = 0; i < 8; i++) {
        phoneNumber.push(Math.floor(rng() * 10));
    }
    return phoneNumber.join("");
};
