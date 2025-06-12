import { questionType } from "./config/type";

// === Utility Functions ===
function getRandomQuestions(questionsDB: questionType[]) {
  const easy = questionsDB.filter(q => q.difficulty === 'easy');
  const medium = questionsDB.filter(q => q.difficulty === 'medium');
  const hard = questionsDB.filter(q => q.difficulty === 'hard');
  const veryHard = questionsDB.filter(q => q.difficulty === 'very hard');

  const pick = (arr: any[], count: number) => arr.sort(() => 0.5 - Math.random()).slice(0, count);
  return [...pick(easy, 2), ...pick(medium, 2), ...pick(hard, 2), ...pick(veryHard, 2)].sort(() => 0.5 - Math.random());
}