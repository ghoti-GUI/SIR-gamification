/**
 * @return {Map<string, function(): Map<string, number>>}
 * @description Map with the tp as key and a function as a value that returns a map with the progression level as key and the grade as value
 */

const getScrappingGrades = () => {
    const scrappingIndexGrades = new Map();
    scrappingIndexGrades.set("0", 0);
    scrappingIndexGrades.set("1", 7);
    scrappingIndexGrades.set("2", 12);
    scrappingIndexGrades.set("3", 15);
    scrappingIndexGrades.set("4", 18);
    return scrappingIndexGrades;
};

// const getKafkaGrades = () => {
//     const kafkaIndexGrades = new Map();
//     kafkaIndexGrades.set("0", 0);
//     kafkaIndexGrades.set("1", 7);
//     kafkaIndexGrades.set("2", 12);
//     kafkaIndexGrades.set("3", 15);
//     kafkaIndexGrades.set("4", 18);
//     return kafkaIndexGrades;
// };

export const getIndexGrades = () => {
    const indexGrades = new Map();
    indexGrades.set("scrapping", getScrappingGrades);
    // indexGrades.set("kafka", getKafkaGrades);
    return indexGrades;
};
