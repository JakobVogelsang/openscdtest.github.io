import {html} from "../../../_snowpack/pkg/lit-element.js";
import {get, translate} from "../../../_snowpack/pkg/lit-translate.js";
import {
  getReference,
  getValue,
  identity,
  newActionEvent,
  newWizardEvent,
  patterns,
  selector
} from "../../foundation.js";
import {
  addReferencedDataTypes,
  allDataTypeSelector,
  unifyCreateActionArray,
  updateIDNamingAction
} from "./foundation.js";
import {createBDAWizard, editBDAWizard} from "../../wizards/bda.js";
export function editDaTypeWizard(dATypeIdentity, doc) {
  const datype = doc.querySelector(selector("DAType", dATypeIdentity));
  if (!datype)
    return void 0;
  const id = datype.getAttribute("id");
  const desc = datype.getAttribute("desc");
  return [
    {
      title: get("datype.wizard.title.edit"),
      element: datype ?? void 0,
      primary: {
        icon: "",
        label: get("save"),
        action: updateIDNamingAction(datype)
      },
      content: [
        html`<mwc-button
          icon="delete"
          trailingIcon
          label="${translate("remove")}"
          @click=${(e) => {
          e.target.dispatchEvent(newWizardEvent());
          e.target.dispatchEvent(newActionEvent({
            old: {
              parent: datype.parentElement,
              element: datype,
              reference: datype.nextSibling
            }
          }));
        }}
          fullwidth
        ></mwc-button> `,
        html`<wizard-textfield
          label="id"
          helper="${translate("scl.id")}"
          .maybeValue=${id}
          required
          maxlength="127"
          minlength="1"
          pattern="${patterns.nmToken}"
          dialogInitialFocus
        ></wizard-textfield>`,
        html`<wizard-textfield
          label="desc"
          helper="${translate("scl.desc")}"
          .maybeValue=${desc}
          nullable
          pattern="${patterns.normalizedString}"
        ></wizard-textfield>`,
        html`<mwc-button
            slot="graphic"
            icon="playlist_add"
            trailingIcon
            label="${translate("scl.DA")}"
            @click=${(e) => {
          if (datype)
            e.target.dispatchEvent(newWizardEvent(createBDAWizard(datype)));
          e.target.dispatchEvent(newWizardEvent());
        }}
          ></mwc-button>
          <mwc-list
            style="margin-top: 0px;"
            @selected=${(e) => {
          const bdaIdentity = e.target.selected.value;
          const bda = doc.querySelector(selector("BDA", bdaIdentity));
          if (bda)
            e.target.dispatchEvent(newWizardEvent(editBDAWizard(bda)));
          e.target.dispatchEvent(newWizardEvent());
        }}
          >
            ${Array.from(datype.querySelectorAll("BDA")).map((bda) => html`<mwc-list-item
                  twoline
                  tabindex="0"
                  value="${identity(bda)}"
                  ><span>${bda.getAttribute("name")}</span
                  ><span slot="secondary"
                    >${bda.getAttribute("bType") === "Enum" || bda.getAttribute("bType") === "Struct" ? "#" + bda.getAttribute("type") : bda.getAttribute("bType")}</span
                  ></mwc-list-item
                >`)}
          </mwc-list> `
      ]
    }
  ];
}
function addPredefinedDAType(parent, templates) {
  return (inputs) => {
    const id = getValue(inputs.find((i) => i.label === "id"));
    if (!id)
      return [];
    const existId = Array.from(templates.querySelectorAll(allDataTypeSelector)).some((type) => type.getAttribute("id") === id);
    if (existId)
      return [];
    const desc = getValue(inputs.find((i) => i.label === "desc"));
    const values = inputs.find((i) => i.label === "values");
    const selectedElement = values.selected ? templates.querySelector(`DAType[id="${values.selected.value}"]`) : null;
    const element = values.selected ? selectedElement.cloneNode(true) : parent.ownerDocument.createElement("DAType");
    element.setAttribute("id", id);
    if (desc)
      element.setAttribute("desc", desc);
    const actions = [];
    if (selectedElement)
      addReferencedDataTypes(selectedElement, parent).forEach((action) => actions.push(action));
    actions.push({
      new: {
        parent,
        element,
        reference: getReference(parent, element.tagName)
      }
    });
    return unifyCreateActionArray(actions);
  };
}
export function createDATypeWizard(parent, templates) {
  return [
    {
      title: get("datype.wizard.title.add"),
      primary: {
        icon: "add",
        label: get("add"),
        action: addPredefinedDAType(parent, templates)
      },
      content: [
        html`<mwc-select
          fixedMenuPosition
          outlined
          icon="playlist_add_check"
          label="values"
          helper="Default enumerations"
        >
          ${Array.from(templates.querySelectorAll("DAType")).map((datype) => html`<mwc-list-item
                graphic="icon"
                hasMeta
                value="${datype.getAttribute("id") ?? ""}"
                ><span
                  >${datype.getAttribute("id")?.replace("OpenSCD_", "")}</span
                >
                <span slot="meta"
                  >${datype.querySelectorAll("BDA").length}</span
                >
              </mwc-list-item>`)}
        </mwc-select>`,
        html`<wizard-textfield
          label="id"
          helper="${translate("scl.id")}"
          .maybeValue=${""}
          required
          maxlength="255"
          minlength="1"
          pattern="${patterns.nmToken}"
          dialogInitialFocus
        ></wizard-textfield>`,
        html`<wizard-textfield
          label="desc"
          helper="${translate("scl.desc")}"
          .maybeValue=${null}
          nullable
          pattern="${patterns.normalizedString}"
        ></wizard-textfield>`
      ]
    }
  ];
}