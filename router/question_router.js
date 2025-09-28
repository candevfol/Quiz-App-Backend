import express from 'express';
import { create_question_schema } from '../utils/request_validators.js';
import { create_question, getAllQuestions } from '../service/question.service.js';

const questionRouter = express.Router();

questionRouter.post('/:id', async (req, res, next) => {
    const validatedData = create_question_schema.safeParse(req.body);
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
    const id = parseInt(req.params.id, 10);
    try{
        const question_response = await create_question(id, req.body);

        if(!question_response.success) return res.status(401).json({success: false, message: question_response.data });
        
        return res.status(201).json({success: true, message: question_response.data});
    }
    catch(err){
        next(err);
    }
    }

);
questionRouter.get('/:id', async (req, res, next) => {
    const quizId = parseInt(req.params.id, 10);
    try{
        const question_response = await getAllQuestions(quizId);
        if(!question_response.success) return res.status(401).json({success: false, message: question_response.data });
        
        return res.status(200).json({success: true, questions: question_response.data});
    }
    catch(err){
        next(err)
    }
})

export default questionRouter;
