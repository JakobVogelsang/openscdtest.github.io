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
  css,
  customElement,
  html,
  LitElement,
  property,
  query
} from "../../_snowpack/pkg/lit-element.js";
import {newWizardEvent} from "../foundation.js";
import {createClientLnWizard} from "../wizards/clientln.js";
import {selectGseControlWizard} from "../wizards/gsecontrol.js";
import {gooseIcon} from "../icons.js";
export let IedEditor = class extends LitElement {
  get name() {
    return this.element.getAttribute("name") ?? "";
  }
  openCommunicationMapping() {
    const sendingIeds = Array.from(this.element.closest("SCL")?.querySelectorAll("IED") ?? []);
    const wizard = createClientLnWizard(sendingIeds, this.element);
    if (wizard)
      this.dispatchEvent(newWizardEvent(wizard));
  }
  openGseControlSelection() {
    const wizard = selectGseControlWizard(this.element);
    if (wizard)
      this.dispatchEvent(newWizardEvent(wizard));
  }
  render() {
    return html`
      <div id="container" tabindex="0">
        <abbr title="${this.name}">
          <mwc-icon class="icon">developer_board</mwc-icon></abbr
        >
        <mwc-fab
          id="connectreport"
          mini
          class="menu-item right"
          @click="${() => this.openCommunicationMapping()}"
          icon="add_link"
        ></mwc-fab>
        <mwc-fab
          id="connectreport"
          mini
          class="menu-item left"
          @click="${() => this.openGseControlSelection()}"
          ><mwc-icon slot="icon">${gooseIcon}</mwc-icon></mwc-fab
        >
      </div>
      <h4>${this.name}</h4>
    `;
  }
};
IedEditor.styles = css`
    #container {
      color: var(--mdc-theme-on-surface);
      width: 50px;
      height: 50px;
      margin: auto;
      position: relative;
      transition: all 200ms linear;
      user-select: none;
    }

    #container:focus {
      outline: none;
    }

    .icon {
      color: var(--mdc-theme-on-surface);
      --mdc-icon-size: 50px;
      transition: transform 150ms linear, box-shadow 200ms linear;
      outline-color: var(--mdc-theme-primary);
      outline-style: solid;
      outline-width: 0px;
    }

    #container > .icon {
      color: var(--mdc-theme-on-surface);
      width: 50px;
      height: 50px;
      transition: transform 150ms linear, box-shadow 200ms linear;
      outline-color: var(--mdc-theme-primary);
      outline-style: solid;
      outline-width: 0px;
    }

    #container:focus > .icon {
      box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
        0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
    }

    #container:hover > .icon {
      outline: 2px dashed var(--mdc-theme-primary);
      transition: transform 200ms linear, box-shadow 250ms linear;
    }

    #container:focus-within > .icon {
      outline: 2px solid var(--mdc-theme-primary);
      background: var(--mdc-theme-on-primary);
      transform: scale(0.8);
      transition: transform 200ms linear, box-shadow 250ms linear;
    }

    .menu-item {
      color: var(--mdc-theme-on-surface);
      transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
        opacity 200ms linear;
      position: absolute;
      top: 2px;
      left: 2px;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
    }

    #container:focus-within > .menu-item {
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
        opacity 250ms linear;
      pointer-events: auto;
      opacity: 1;
    }

    #container:focus-within > .menu-item.up {
      transform: translate(0px, -60px);
    }

    #container:focus-within > .menu-item.down {
      transform: translate(0px, 60px);
    }

    #container:focus-within > .menu-item.right {
      transform: translate(60px, 0px);
    }

    #container:focus-within > .menu-item.left {
      transform: translate(-60px, 0px);
    }

    h4 {
      color: var(--mdc-theme-on-surface);
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0px;
      opacity: 1;
      transition: opacity 200ms linear;
      text-align: center;
      direction: rtl;
    }

    :host(.moving) #container,
    :host(.moving) h4 {
      opacity: 0.3;
    }
  `;
__decorate([
  property({type: Element})
], IedEditor.prototype, "element", 2);
__decorate([
  property({type: String})
], IedEditor.prototype, "name", 1);
__decorate([
  query("#connectreport")
], IedEditor.prototype, "connectReport", 2);
IedEditor = __decorate([
  customElement("ied-editor")
], IedEditor);