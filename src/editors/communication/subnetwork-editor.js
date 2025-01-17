var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorate = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
import {
  LitElement,
  customElement,
  html,
  property,
  css
} from "../../../_snowpack/pkg/lit-element.js";
import {translate} from "../../../_snowpack/pkg/lit-translate.js";
import "../../../_snowpack/pkg/@material/mwc-icon-button.js";
import "./connectedap-editor.js";
import {
  newWizardEvent,
  newActionEvent,
  compareNames
} from "../../foundation.js";
import {createConnectedApWizard} from "../../wizards/connectedap.js";
import {wizards} from "../../wizards/wizard-library.js";
export let SubNetworkEditor = class extends LitElement {
  get name() {
    return this.element.getAttribute("name") ?? "UNDEFINED";
  }
  get desc() {
    return this.element.getAttribute("desc") ?? null;
  }
  get type() {
    return this.element.getAttribute("type") ?? null;
  }
  get bitrate() {
    const bitRate = this.element.querySelector("BitRate");
    if (bitRate === null)
      return null;
    const bitRateValue = bitRate.textContent ?? "";
    const m = bitRate.getAttribute("multiplier");
    const unit = m === null ? "b/s" : " " + m + "b/s";
    return bitRateValue ? bitRateValue + unit : null;
  }
  openConnectedAPwizard() {
    this.dispatchEvent(newWizardEvent(createConnectedApWizard(this.element)));
  }
  openEditWizard() {
    const wizard = wizards["SubNetwork"].edit(this.element);
    if (wizard)
      this.dispatchEvent(newWizardEvent(wizard));
  }
  remove() {
    if (this.element)
      this.dispatchEvent(newActionEvent({
        old: {
          parent: this.element.parentElement,
          element: this.element,
          reference: this.element.nextSibling
        }
      }));
  }
  renderIedContainer() {
    return Array.from(this.element.querySelectorAll(":scope > ConnectedAP")).map((connAP) => connAP.getAttribute("iedName")).filter((v, i, a) => a.indexOf(v) === i).sort(compareNames).map((iedName) => html` <action-pane id="iedSection" label="${iedName}">
          ${Array.from(this.element.parentElement?.querySelectorAll(`:scope > SubNetwork > ConnectedAP[iedName="${iedName}"]`) ?? []).map((connectedAP) => html`<connectedap-editor
                class="${connectedAP.parentElement !== this.element ? "disabled" : ""}"
                .element=${connectedAP}
              ></connectedap-editor>`)}
        </action-pane>`);
  }
  subNetworkSpecs() {
    if (!this.type && !this.bitrate)
      return "";
    return `(${this.type}${this.type && this.bitrate ? ` — ${this.bitrate}` : ``})`;
  }
  header() {
    return ` ${this.name} ${this.desc === null ? "" : `— ${this.desc}`}
    ${this.subNetworkSpecs()}`;
  }
  render() {
    return html`<action-pane label="${this.header()}">
      <abbr slot="action" title="${translate("edit")}">
        <mwc-icon-button
          icon="edit"
          @click=${() => this.openEditWizard()}
        ></mwc-icon-button>
      </abbr>
      <abbr slot="action" title="${translate("remove")}">
        <mwc-icon-button
          icon="delete"
          @click=${() => this.remove()}
        ></mwc-icon-button> </abbr
      ><abbr slot="action" title="${translate("add")}">
        <mwc-icon-button
          icon="playlist_add"
          @click="${() => this.openConnectedAPwizard()}"
        ></mwc-icon-button>
      </abbr>
      <div id="iedContainer">${this.renderIedContainer()}</div>
    </action-pane> `;
  }
};
SubNetworkEditor.styles = css`
    #iedContainer {
      display: grid;
      box-sizing: border-box;
      gap: 12px;
      padding: 8px 12px 16px;
      grid-template-columns: repeat(auto-fit, minmax(150px, auto));
    }

    #iedSection:not(:focus):not(:focus-within) .disabled {
      display: none;
    }

    #iedSection .disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    abbr {
      text-decoration: none;
      border-bottom: none;
    }
  `;
__decorate([
  property({attribute: false})
], SubNetworkEditor.prototype, "element", 2);
__decorate([
  property()
], SubNetworkEditor.prototype, "name", 1);
__decorate([
  property()
], SubNetworkEditor.prototype, "desc", 1);
__decorate([
  property()
], SubNetworkEditor.prototype, "type", 1);
__decorate([
  property()
], SubNetworkEditor.prototype, "bitrate", 1);
SubNetworkEditor = __decorate([
  customElement("subnetwork-editor")
], SubNetworkEditor);
