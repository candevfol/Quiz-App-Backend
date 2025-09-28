import express from 'express';
import { create_quiz_schema } from "../utils/request_validators.js";
import { create_quiz, getall_quiz } from '../service/quiz.service.js';

const quizRouter = express.Router();

quizRouter.post('/', async(req, res, next) => {
    const validatedData = create_quiz_schema.safeParse(req.body);
    if(!validatedData.success){
        const errorMessages = validatedData.error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        return res.status(400).json({
            success: false, 
            message: "Validation failed",
            errors: errorMessages
        });
    } 

    try{
        const {title} = req.body;
        const quiz = await create_quiz(title);
        if(quiz) return res.status(201).json({success: true, message: "quiz created successfully", data: {quiz}});
        else return res.status(500).json({success: false, message: "something went wrong while saving in db"});
    }
    catch(err){
        next(err);
    }

});
quizRouter.get('/', async (req, res, next) => {
    try{
        const quiz = await getall_quiz();
        if(quiz) return res.status(201).json({success: true, data: {quiz}});
        else return res.status(500).json({success: false, message: "something went wrong while saving in db"});
    }
    catch(err){
        next(err);
    }
})

export default quizRouter;
