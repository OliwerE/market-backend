/**
 * Module represents the question and answer controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

// import { Listing } from '../models/listing-model.js'

/**
 * Class represents a controller used to render pages for users.
 */
export class QuestionAnswerController {
  /**
   * Responds with all questions and answers.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - Next function.
   */
  getQuestionAndAnswer (req, res, next) {
    const questions = [ // Dessa frågor ska hämtas från mongodb??
      {
        id: 1,
        title: 'Fråga 1',
        answer: 'Detta är ett svar på fråga 1 som ska visas när användaren klickar på frågan. Flera frågor kan öppnas samtidigt.'
      },
      {
        id: 2,
        title: 'Fråga 2',
        answer: 'Detta är ett svar på fråga 2 som ska visas när användaren klickar på frågan. Flera frågor kan öppnas samtidigt.'
      },
      {
        id: 3,
        title: 'Fråga 3',
        answer: 'Detta är ett svar på fråga 3 som ska visas när användaren klickar på frågan. Flera frågor kan öppnas samtidigt.'
      },
      {
        id: 4,
        title: 'Fråga 4',
        answer: 'Detta är ett svar på fråga 4 som ska visas när användaren klickar på frågan. Flera frågor kan öppnas samtidigt.'
      },
      {
        id: 5,
        title: 'Fråga 5',
        answer: 'Detta är ett svar på fråga 5 som ska visas när användaren klickar på frågan. Flera frågor kan öppnas samtidigt.'
      }]

    res.json(questions)
  }
}
