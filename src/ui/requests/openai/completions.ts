import openaiClient from "./openaiClient";

export interface PostCompletionsData {
  model: string,
  messages: Array<any>,
}

export type PostCompletionsResponse = {
  data: {
     "id": string,
    "object": string,
    "created": number,
    "model":string,
    "choices": [
      {
        "index": number,
        "message": {
          "role": string,
          "content": string
        },
        "logprobs": any,
        "finish_reason": string
      }
    ],
    "usage": {
      "prompt_tokens": number,
      "completion_tokens": number,
      "total_tokens": number
    },
    "system_fingerprint": string
  }
}


// SERVICE
export const postCompletions = (body: PostCompletionsData): Promise<PostCompletionsResponse> =>
  openaiClient.post('/chat/completions', { ...body })
