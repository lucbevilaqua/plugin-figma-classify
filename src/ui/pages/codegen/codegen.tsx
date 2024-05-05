import React, { useEffect, useState } from 'react';

import './styles.css'
import { PluginMessage } from '@typings/pluginMessages';
import { CodegenProps } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import CodeBlock from '@/ui/components/ui/codeblock';
import { Alert, AlertDescription, AlertTitle } from '@/ui/components/ui/alert';
import { FigmaToCodeResponse } from '@typings/figma';
import { postCompletions } from '@/ui/requests/openai/completions';
import { Skeleton } from '@/ui/components/ui/skeleton';

const Codegen = ({ }: CodegenProps) => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    function handleComponentData(event: MessageEvent) {
      const { action, payload } = event.data.pluginMessage as PluginMessage<FigmaToCodeResponse>;

      if (action === 'selectionChange' && payload?.tag) {
        generateHtmlFromFigmaData(payload)
      }
    }

    window.addEventListener('message', handleComponentData);

    return () => window.removeEventListener('message', handleComponentData);
  }, []);

  async function generateHtmlFromFigmaData(figmaData: FigmaToCodeResponse) {
    try {
      setLoading(true);
      const messages = [
        {
          role: "system",
          content: process.env.OPENAI_FIGMA_TO_CODE_PROMPT
        },
        {
          role: "user",
          content: JSON.stringify(figmaData)
        }
      ];

      const response = await postCompletions({
        model: 'gpt-4-turbo',
        messages
      });

      setLoading(false);
      setCode(response.data.choices[0].message.content)
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      setLoading(false);
      throw error;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Component code
        </CardTitle>
        <CardDescription>
          Now just copy the generated code from the component
        </CardDescription>
      </CardHeader>
      <CardContent>
        {
          loading ? <Skeleton className="h-[125px] w-[250px] rounded-xl" /> :
            code ?
              <CodeBlock value={code} />
              :
              <Alert>
                <AlertTitle>No code available :(.</AlertTitle>
                <AlertDescription>
                  Have you already made the settings?
                </AlertDescription>
              </Alert>
        }
      </CardContent>
    </Card>
  );
};

export default Codegen;
