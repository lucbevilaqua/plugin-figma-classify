import React, { useEffect, useState } from 'react';

import './styles.css'
import { PluginMessage } from '@typings/pluginMessages';
import { CodegenProps } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card';
import CodeBlock from '@/ui/components/ui/codeblock';
import { Alert, AlertDescription, AlertTitle } from '@/ui/components/ui/alert';

const Codegen = ({ }: CodegenProps) => {
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    function handleComponentData(event: MessageEvent) {
      const msg = event.data.pluginMessage as PluginMessage;
      if (msg.action === 'selectionChange') {
        setCode(msg.payload.code)
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
