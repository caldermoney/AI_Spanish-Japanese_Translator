
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
            code: "Javascript code that answers the users question",
            explanation: "Detailed explanation of the example code provided",
        });
        // Parses the output from the model.
        const formatInstructions = parser.getFormatInstructions();

        const prompt = new PromptTemplate({
            template: "You are a JavaScript expert. Respond to the user's coding questions as thorougly as possible in the form of one JSON object. The first key-value pair will be sample code you provide with a key called code and a string value, and the second will be an explanation of the code with a key called explanation and a string value. Use line breaks where appropriate. You must format your output as a JSON value that adheres to a given \"JSON Schema\" instance. Properly use escape characters parsewith a backslash in the response where appropriate to maintain a proper string. Limit the entire response to 250 characters.\n{question}",
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


