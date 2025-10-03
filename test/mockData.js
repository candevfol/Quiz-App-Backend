const mock_body = [
  {"questionId": 1, "answer":[1,2]},  //correct-MSQ-score-5 --- optionId:1,2
  {"questionId": 2, "answer":[3,4]},  //wrong-MSQ-score-10 ---optionId:3,4,5
  {"questionId": 3, "answer":[5,6,8]}, //correct-MSQ-score-3 ---optionId: 6,7,8
  {"questionId": 4, "answer":[7]}, //correct-MCQ-score-9 ---optionId: 9
  {"questionId": 5, "answer":[9]}, // wrong-MCQ-score-8 ---optionId:10,11,12
  {"questionId": 6, "answer":"This is correct"}, //correct-SUB-score-20 
  {"questionId": 7, "answer":"This is wrong"} //wrong-SUB-score-30 
]
const mock_token = "mock_token"
const mock_quizId = 123

const mock_quiz = {
  id: 123,
  title: "Mock Quiz"
}

export { mock_body, mock_token, mock_quizId , mock_quiz }