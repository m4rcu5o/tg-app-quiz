import { questionType } from "./config/type";
// import { PublicKey } from '@solana/web3.js';
import { questionAmount, hardAmount, ultra } from "./config";

// === Utility Functions ===
export function getRandomQuestions(questionsDB: questionType[], is2x: boolean) {
  const easy = questionsDB.filter(q => q.difficulty === 'easy');
  const medium = questionsDB.filter(q => q.difficulty === 'medium');
  const hard = questionsDB.filter(q => q.difficulty === 'hard');
  const veryHard = questionsDB.filter(q => q.difficulty === 'very hard');

  const pick = (arr: any[], count: number) => arr.sort(() => 0.5 - Math.random()).slice(0, count);
  if (is2x) {
    return [...pick(hard, hardAmount), ...pick(veryHard, ultra)].sort(() => 0.5 - Math.random());
  }
  return [...pick(easy, questionAmount), ...pick(medium, questionAmount), ...pick(hard, questionAmount), ...pick(veryHard, questionAmount)].sort(() => 0.5 - Math.random());
}


// function isValidSolanaAddress(address: string): boolean {
//   try {
//     const key = new PublicKey(address);
//     return PublicKey.isOnCurve(key.toBytes());
//   } catch (e) {
//     return false;
//   }
// }