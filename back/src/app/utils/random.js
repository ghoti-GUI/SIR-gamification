import seedRandom from "seedrandom";

export const getIntFromRange = (min, max, seed) => {
    const rng = new seedRandom(seed);
    return Math.floor(rng() * (max - min + 1)) + min;
};

export const getIntsFromRange = (min, max, count, seed) => {
    const rng = new seedRandom(seed);
    const ints = [];
    for (let i = 0; i < count; i++) {
        ints.push(Math.floor(rng() * (max - min + 1)) + min);
    }
    return ints;
};

export const getUniqueIntsFromRange = (min, max, count, seed) => {
    const rng = new seedRandom(seed);
    const ints = [];
    while (ints.length < count) {
        const int = Math.floor(rng() * (max - min + 1)) + min;
        if (!ints.includes(int)) {
            ints.push(int);
        }
    }
    return ints;
};

export const getRandomBytes = (length, seed) => {
    const rng = new seedRandom(seed);
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = Math.floor(rng() * 256);
    }
    return bytes;
};
