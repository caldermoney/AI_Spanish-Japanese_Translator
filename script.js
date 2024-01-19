
// Dependencies
const { OpenAI } = require('langchain/llms/openai');
const inquirer = require('inquirer');
const { PromptTemplate } = require('langchain/prompts');
const { StructuredOutputParser } = require('langchain/output_parsers');
require('dotenv').config();


// Creates and stores wrapper for the OpenAI package along with basic configuration
const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    model: 'gpt-3.5-turbo',
});



// Calling the model
const promptFunc = async (input) => {
    try {
        // Structures the output from the model, parses it, and returns it to the user.
        const parser = StructuredOutputParser.fromNamesAndDescriptions({
            translation: "The translated text in standard english pronunciation text",
            hiragana_katakana: "The translation written in a mix of Hiragana and Katakana characters",
        });
        // Parses the output from the model.
        const formatInstructions = parser.getFormatInstructions();

        const prompt = new PromptTemplate({
            template: "You are a JavaScript expert with knowledge of language translation. Respond to the user's request by providing a translation from Spanish to Japanese. The response should be formatted as a JSON object with two key-value pairs. The first key, 'translation', should contain the translated text in standard english pronunciation. The second key, 'hiragana_katakana', should contain the translation written in a mix of Hiragana and Katakana characters. Format the output to comply with a given 'JSON Schema' instance. Use escape characters appropriately to ensure valid JSON string formatting. Limit the entire response to 250 characters.\n{question}",
            inputVariables: ["question"],
            partialVariables: { format_instructions: formatInstructions }
        });
        
        const promptInput = await prompt.format({
            question: input
        });
        const res = await model.call(promptInput);
        console.log(await parser.parse(res));
    }
    catch (err) {
        console.error(err);
    }
};



// Initialization function that uses inquirer to prompt the user and returns a promise. It takes the user input and passes it through the call method
const init = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Ask a coding question:'
        },
    ]).then((inquirerResponse) => {
        promptFunc(inquirerResponse.name);
    });
};

// Calls the initialization function and starts the script
init();


