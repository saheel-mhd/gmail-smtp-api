"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;
exports.extractTemplateKeys = extractTemplateKeys;
const tokenRegex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
function renderTemplate(template, variables) {
    const missing = new Set();
    const value = template.replace(tokenRegex, (_match, key) => {
        if (!(key in variables)) {
            missing.add(key);
            return "";
        }
        const raw = variables[key];
        return raw === null || raw === undefined ? "" : String(raw);
    });
    return { value, missing: Array.from(missing) };
}
function extractTemplateKeys(template) {
    const keys = new Set();
    let match;
    while ((match = tokenRegex.exec(template)) !== null) {
        keys.add(match[1]);
    }
    return Array.from(keys);
}
//# sourceMappingURL=template.js.map