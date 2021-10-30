import { __decorate } from "../../../_snowpack/pkg/tslib.js";
import { LitElement, property } from '../../../_snowpack/pkg/lit-element.js';
import { get } from '../../../_snowpack/pkg/lit-translate.js';
import { newIssueEvent, newLogEvent } from '../foundation.js';
import { getSchema, isLoadSchemaResult, isValidationError, isValidationResult, } from '../schemas.js';
const validators = {};
export default class ValidateSchema extends LitElement {
    async getValidator(xsd, xsdName) {
        if (!window.Worker)
            throw new Error(get('validator.schema.fatal'));
        if (validators[xsdName])
            return validators[xsdName];
        const worker = new Worker('public/js/worker.js');
        async function validate(xml, xmlName) {
            return new Promise(resolve => {
                worker.addEventListener('message', (e) => {
                    if (isValidationResult(e.data) && e.data.file === xmlName)
                        resolve(e.data);
                });
                worker.postMessage({ content: xml, name: xmlName });
            });
        }
        return new Promise((resolve, reject) => {
            worker.addEventListener('message', (e) => {
                if (isLoadSchemaResult(e.data)) {
                    if (e.data.loaded)
                        resolve(validate);
                    else
                        reject(get('validator.schema.loadEror', { name: e.data.file }));
                }
                else if (isValidationError(e.data)) {
                    const parts = e.data.message.split(': ', 2);
                    const description = parts[1] ? parts[1] : parts[0];
                    const qualifiedTag = parts[1] ? ' (' + parts[0] + ')' : '';
                    document.querySelector('open-scd').dispatchEvent(newIssueEvent({
                        title: description,
                        validatorId: this.pluginId,
                        message: e.data.file +
                            ':' +
                            e.data.line +
                            ' ' +
                            e.data.node +
                            ' ' +
                            e.data.part +
                            qualifiedTag,
                    }));
                }
                else if (!isValidationResult(e.data)) {
                    document.querySelector('open-scd').dispatchEvent(newLogEvent({
                        title: get('validator.schema.fatal'),
                        kind: 'error',
                        message: e.data,
                    }));
                }
            });
            worker.postMessage({ content: xsd, name: xsdName });
        });
    }
    async validate() {
        const fileName = this.docName;
        let version = '2007';
        let revision = 'B';
        let release = '1';
        if (this.doc.documentElement)
            [version, revision, release] = [
                this.doc.documentElement.getAttribute('version') ?? '',
                this.doc.documentElement.getAttribute('revision') ?? '',
                this.doc.documentElement.getAttribute('release') ?? '',
            ];
        const result = await this.getValidator(getSchema(version, revision, release), 'SCL' + version + revision + release + '.xsd').then(validator => validator(new XMLSerializer().serializeToString(this.doc), fileName));
        if (!result.valid) {
            document.querySelector('open-scd').dispatchEvent(newLogEvent({
                kind: 'warning',
                title: get('validator.schema.invalid', { name: result.file }),
            }));
            throw new Error(get('validator.schema.invalid', { name: result.file }));
        }
        document.querySelector('open-scd').dispatchEvent(newLogEvent({
            kind: 'info',
            title: get('validator.schema.valid', { name: result.file }),
        }));
        document.querySelector('open-scd').dispatchEvent(newIssueEvent({
            validatorId: this.pluginId,
            title: get('validator.schema.valid', { name: result.file }),
        }));
    }
}
__decorate([
    property()
], ValidateSchema.prototype, "doc", void 0);
__decorate([
    property()
], ValidateSchema.prototype, "docName", void 0);
__decorate([
    property()
], ValidateSchema.prototype, "pluginId", void 0);
//# sourceMappingURL=ValidateSchema.js.map