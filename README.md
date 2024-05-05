# Figma CodeGen Plugin

**Transform your Figma designs into fully functional code with ease using the Figma CodeGen Plugin.** This tool is indispensable for automating the generation of HTML tags, CSS classes, and instance directives directly from your Figma components. It seamlessly bridges the gap between design and development, ensuring a fluid transition of your visual components into executable code.

## Please support the development by donating.
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/gbraad)

## Access Figma Plugin

This repository contains the source code for [🔗Figma CodeGen Plugin](https://www.figma.com/community/plugin/1314693808615895175/figma-codegen). Enhance your design-to-code workflows by utilizing our plugin directly within Figma. Click the image below to visit the plugin page and start using it today!

[![Explore Figma CodeGen Plugin](https://github.com/lucbevilaqua/plugin-figma-codegen/assets/77061281/c150569c-9268-4170-b208-60a41a62e92f)](https://www.figma.com/community/plugin/1314693808615895175/figma-codegen)

## Key Features

- **Customizable UI**: A user-friendly interface with tailored screens allows precise code generation:
  - **General Settings**: Set code prefixes and establish property masks for CSS class names and directives, which are replaced by actual values from your design tokens. For example, a logo with a 'direction' property as 'is-$value' will correctly reflect its orientation in the code.
  - **Component-Specific Customization**: Customize individual components to meet specific requirements, ensuring every component is treated uniquely.
  - **File-Level Configuration**: Enhances collaboration by saving configurations at the project level, ensuring consistent code generation across different team members.

- **Versatile Application**: Ideal for web component design systems, but adaptable to a variety of project needs, enhancing any design-to-development workflow.

## Installation

Ensure you have [Node.js](https://nodejs.org/), [yarn](https://yarnpkg.com/), and [Figma Desktop App](https://www.figma.com/downloads/) installed before starting.

To install project dependencies, execute the following command in your terminal at the project root:

```bash
npm install
```

## How to Use

For detailed guidance, refer to the [Figma Plugin Quickstart Guide](https://www.figma.com/plugin-docs/plugin-quickstart-guide/).

**Steps to run the plugin in Figma**:

1. Execute `npm run watch` in your project’s terminal.
2. Open Figma, navigate to `Plugins -> Manage Plugins...` and switch to development mode.
3. Click “New” or “+” to add a plugin, then select “Import plugin from manifest…”
4. Navigate to your project folder and select the manifest file.
5. Launch the plugin and set the desired prefix for code generation in the configuration settings.

## Project Structure
```
├───dist
├───src
│ ├───ui
│ │ ├───components
│ │ ├───containers
│ │ ├───pages
│ │ └───hooks
│ └───utils
└───types
```

- **dist/**: Contains the built JavaScript plugin.
- **src/**: Source files for the plugin.
- **ui/**: React application for the UI in Figma normal mode.
  - **components/**: Reusable UI components.
  - **containers/**: Larger UI blocks that may contain multiple components.
- **types/**: TypeScript type definitions used across the application.

## Styling

This project utilizes the [uishadcn](https://ui.shadcn.com/) library for styling.

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
