export const formatScore = (score: number): string => {
    return Number.isInteger(score) ? score.toString() : score.toFixed(2);
};