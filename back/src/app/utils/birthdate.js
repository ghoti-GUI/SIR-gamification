import seedRandom from "seedrandom";

export const generateBirthDates = (count, seed) => {
    const dates = [];
    const rng = seedRandom(seed);
    for (let i = 0; i < count; i++) {
        dates.push(generateBirthDate(rng));
    }
    return dates;
};

export const generateBirthDate = (rng) => {
    const year = Math.floor(rng() * 50) + 1950;
    const month = Math.floor(rng() * 12);
    if (month === 1) {
        if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            const day = Math.floor(rng() * 29);
            return new Date(year, month, day);
        }
        const day = Math.floor(rng() * 28);
        return new Date(year, month, day);
    } else if (month === 3 || month === 5 || month === 8 || month === 10) {
        const day = Math.floor(rng() * 30);
        return new Date(year, month, day);
    }
    const day = Math.floor(rng() * 31);
    return new Date(year, month, day);
};
