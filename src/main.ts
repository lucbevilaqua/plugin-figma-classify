import { handleGenerateCodeSession } from './handlers/generatesCode';

// Listerners
figma.codegen.on("generate", () => generateCodeSession());

//Handlers
const generateCodeSession = (): CodegenResult[] => {
  const selection = figma.currentPage.selection[0];

  return handleGenerateCodeSession(selection);
}

