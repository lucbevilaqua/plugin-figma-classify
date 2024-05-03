import React, { useEffect, useState } from 'react';

import './styles.css'
import { PluginMessage } from '@typings/pluginMessages';
import { CodegenProps } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import CodeBlock from '@/ui/components/ui/codeblock';
import { Alert, AlertDescription, AlertTitle } from '@/ui/components/ui/alert';
import { FigmaToCodeResponse } from '@typings/figma';

const Codegen = ({ }: CodegenProps) => {
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    function handleComponentData(event: MessageEvent) {
      const { action, payload } = event.data.pluginMessage as PluginMessage<FigmaToCodeResponse>;

      if (action === 'selectionChange' && payload?.tag) {
        setCode(payload?.tag)
      }
    }

    window.addEventListener('message', handleComponentData);

    return () => window.removeEventListener('message', handleComponentData);
  }, []);

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
          code ?
            <CodeBlock value={code} /> :
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
