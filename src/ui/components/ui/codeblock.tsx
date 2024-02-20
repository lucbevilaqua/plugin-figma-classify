import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ value }: { value: string }) => {
  return (
    <SyntaxHighlighter language="html" style={dracula} wrapLines wrapLongLines>
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
