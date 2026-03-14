// This file allows TypeScript to understand side-effect imports of CSS files
declare module "*.css" {
	const content: { [className: string]: string };
	export default content;
}
