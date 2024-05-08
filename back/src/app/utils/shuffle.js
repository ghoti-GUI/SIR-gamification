import seedRandom from "seedrandom";

export const shuffleArraySeeded = (array, randomSeed) => {
    let rng = new seedRandom(randomSeed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};
