import axios from 'axios';

const openaiClient = () => {
  const OPENAI_API_KEY = process.env.OPENAI_TOKEN;
  
  return axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
};

export default openaiClient();
