# Figma CodeGen Plugin
Elevate your Figma designs to operational excellence with the Figma CodeGen Plugin. This innovative tool is essential for automating the generation of HTML tags, CSS classes, and instance directives from your Figma instances. Designed to bridge the gap between design and development, it ensures a smooth transition of your visual components into executable code.

Customizable UI for Precise Code Generation The plugin boasts a user-friendly interface with two main screens:

General Settings: Set a prefix for your code and establish a mask for properties, CSS class names, and directives that apply across all components. The mask uses placeholders, replaced by actual values from your design tokens. For instance, a logo component with a direction property mapped as 'is-$value' in normal Figma mode will generate in developer mode for an instance with the direction set to vertical. Component-Specific Customization: Tailor individual components with the same personalizations, ensuring each component’s unique requirements are met. File-Level Configuration for Unified Collaboration Configurations are saved at the file level, guaranteeing consistent code generation for anyone accessing the file. This fosters teamwork and consistency, allowing designers and developers to collaborate effectively.

Ideal for Web Component Design Systems The Figma CodeGen Plugin is commonly used for projects featuring design systems composed of web components. It allows you to map Figma components to the code of the created web components seamlessly. However, its versatility means it can be employed for any purpose within the realm of possibility, adapting to various project needs.

Embrace the Figma CodeGen Plugin for an integrated design-development workflow, ensuring your design system is perfectly translated into web component code.

https://github.com/lucbevilaqua/plugin-figma-codegen-mapper/assets/77061281/4dba17a8-c1bc-4d74-9d0b-93d99f48963c


## Folder Structure
```
├───dist
├───src
│   ├───ui
│   │   ├───components
│   │   ├───containers
│   │   ├───pages
│   │   └───hooks
│   └───utils
└───types
```
- **types/***: Contains all types used in our application.
- **dist/**: Contains the entire plugin built for javascript
- **src/***: All plugin files that will be built to the /dist folder.
- **ui/***: React application for creating the UI of our plugin in normal figma mode.
- **components/***: All generic components and sole responsibility.
- **containers/***: Containers are components that call one or more components and that usually have more than one responsibility.

## Install

Before starting the project, make sure you have [Node.js](https://nodejs.org/),  [yarn](https://yarnpkg.com/), and [Figma Desktop](https://www.figma.com/downloads/) installed on your system.

To install the project dependencies, run the following command in the terminal at the project root:

```bash
  npm install
```
    
## How to run the project

You can find more detailed information in the official documentation [plugin-quickstart-guide](https://www.figma.com/plugin-docs/plugin-quickstart-guide/)

**Follow the steps below to run the plugin in Figma:**:

1. Run the following command in your project’s terminal:```bash npm run watch```
2. In your Figma project, click on plugins -> manage plugins… 2.In the plugins section, change the selector to show plugins in development mode
3. Click on the “New” or “+” button to add a new plugin, then select the option “import plugin from manifest…”
4. Navigate to your project folder and select the manifest file
5. Run the plugin in figma -> configuration codegen, enter the desired prefix name (if you have already done this, the same name will be suggested) and press enter.

## Layout
The project uses the styling of the [uishadcn](https://ui.shadcn.com/) library.


## Licença

[MIT](https://choosealicense.com/licenses/mit/)
