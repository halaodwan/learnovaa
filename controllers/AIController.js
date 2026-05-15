const Groq = require("groq-sdk");

const groq = new Groq({

  apiKey: process.env.GROQ_API_KEY

});

const generateFlashcards = async (req, res) => {

  try {

    const { topic } = req.body;

    const completion =

      await groq.chat.completions.create({

        messages: [

          {

            role: "user",

            content: `

Create 5 flashcards about ${topic}.

Return ONLY valid JSON like this:

[

  {

    "question": "",

    "answer": ""

  }

]

`

          }

        ],

        model: "llama-3.1-8b-instant"

      });

   const text=
      completion.choices[0].message.content;
    const response=JSON.parse(text);
      
    res.json({

      success: true,

      data: response

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: "AI Error"

    });

  }

};

module.exports = {

  generateFlashcards

};