/**
 * Module represents the question and answer controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

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
    const questions = [ // Temporary solution until admin page has been created.
      {
        id: 1,
        title: 'Hur skapar gör man för att skapa ett konto?',
        answer: 'Tryck på knappen registrera uppe till höger på sidan. Fyll sedan i formuläret och tryck på knappen "Skapa Konto". Om inget felmeddelande visas så öppnas inloggningsfönstret automatiskt, vilket innebär att ditt konto har skapats.'
      },
      {
        id: 2,
        title: 'Hur gör man för att återställa lösenordet',
        answer: 'För att återställa ditt lösenord behöver du kontakta oss. Det gör du enklast genom att använda formuläret till höger. Vi kommer att skicka ett nytt lösenord till din e-post som du kan använda för att logga in och skapa ett nytt eget lösenord.'
      },
      {
        id: 3,
        title: 'Hur hanterar ni GDPR?',
        answer: 'För att läsa hur vi hanterar GDPR se länken "Information om GDPR" i sidfoten.'
      },
      {
        id: 4,
        title: 'Hur hanterar ni kakor?',
        answer: 'För att läsa hur vi hanterar kakor se länken "Information om cookies" i sidfoten.'
      },
      {
        id: 5,
        title: 'Har webbplatsen några regler?',
        answer: 'Ja! Reglerna hittas enklast genom att trycka på länken "Information om villkor" i sidfoten.'
      },
      {
        id: 6,
        title: 'Har ni ett telefonnummer?',
        answer: 'Nej. Enklaste sättet att kontakta oss är genom kontaktformuläret till höger.'
      },
      {
        id: 7,
        title: 'Hur lång tid tar det att få svar via kontaktformuläret?',
        answer: 'Normalt svarar vi inom 24 timmar.'
      }]

    res.json(questions)
  }
}
