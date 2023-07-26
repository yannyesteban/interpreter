import "./Designer/Container.js";
import "./Designer/FieldDesigner.js";
import "./Designer/FormDesigner.js";
import "./Designer/SectionDesigner.js";
import "./Designer/TabDesigner.js";
import "./Designer/TableMenu.js";
import "./Designer/Toolbox.js";
import "./Designer/LastActiveExt.js";
import "./Designer/CaptionDesigner.js";
import "./Designer/ButtonDesigner.js";
import "./Designer/ToolExt.js";
import "./Window.js";
import "./Field.js";
import "./Section.js";
import "./GTForm.js";
class FieldInfo {
    constructor(info) {
        for (const [key, value] of Object.entries(info)) {
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        }
    }
}
const tableMenu = {
    person: ["id", "name", "lastname", "age", "birth"],
};
const form1 = {
    name: "persons",
    caption: "Personas 2023",
    className: "whendy",
    query: "SELECT * FROM person",
    table: "person",
    fields: [
        {
            name: "id",
            caption: "ID",
            input: "input",
            type: "text",
        },
        {
            name: "name",
            caption: "Nombre:",
            input: "input",
            type: "text",
        },
        {
            name: "lastname",
            caption: "Apellido",
            input: "input",
            type: "text",
        },
    ],
};
const Menu1 = {
    name: "persons",
    caption: "Personas 2023",
    className: "whendy",
    groups: [
        {
            name: "person",
            items: [
                {
                    name: "id",
                    caption: "ID",
                    input: "input",
                    type: "text",
                },
                {
                    name: "name",
                    caption: "Nombre:",
                    input: "input",
                    type: "text",
                },
                {
                    name: "lastname",
                    caption: "Apellido",
                    input: "input",
                    type: "text",
                },
            ],
        },
        {
            name: "jobs",
            items: [
                {
                    name: "jobId",
                    caption: "JOB ID",
                    input: "input",
                    type: "text",
                },
                {
                    name: "Job",
                    caption: "JOB:",
                    input: "input",
                    type: "text",
                },
                {
                    name: "location",
                    caption: "Location",
                    input: "input",
                    type: "text",
                },
                {
                    name: "depart",
                    caption: "Depart",
                    input: "input",
                    type: "text",
                },
            ],
        },
    ],
    fields: [
        {
            name: "id",
            caption: "ID",
            input: "input",
            type: "text",
        },
        {
            name: "name",
            caption: "Nombre:",
            input: "input",
            type: "text",
        },
        {
            name: "lastname",
            caption: "Apellido",
            input: "input",
            type: "text",
        },
    ],
};
const tool1 = {
    caption: "tool",
    items: [
        {
            title: "Tab Container",
            element: "tab-designer",
            text: "Tab",
            className: "",
        },
    ],
};
/*
const tableMenu = $(this).create("table-menu").get() as TableMenu;
        tableMenu.dataSource = Menu1;
        return;
*/
//# sourceMappingURL=Designer.js.map