type TemplateRenderResult = {
    value: string;
    missing: string[];
};
export declare function renderTemplate(template: string, variables: Record<string, string | number | boolean>): TemplateRenderResult;
export declare function extractTemplateKeys(template: string): string[];
export {};
