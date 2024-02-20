import React, { useEffect, useState } from 'react';

import './styles.css'
import { PluginMessage } from '@typings/pluginMessages';
import { CodegenProps } from './types';
import { Card, CardContent } from '@/ui/components/ui/card';
import CodeBlock from '@/ui/components/ui/codeblock';

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
      <CardContent>
        <CodeBlock value={code ?? ''} />
      </CardContent>
    </Card>
  );
};

export default Codegen;
