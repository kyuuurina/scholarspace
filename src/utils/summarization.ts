/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// summarization.ts
import { Infer } from '@huggingface/inference';
const model = new Infer('t5-base');
const input = 'This is an example sentence.';
const output = await model.generate(input);
console.log(output);


import { HuggingFace } from '@vercel/edge-functions-ui';
const hf = new HuggingFace(process.env.HF_API_KEY);
const input = 'This is an example sentence.';
const output = await hf.textGeneration(input, { model: 't5-base' });
console.log(output);
