import { DBTransaction } from "./db/DBTransactionOLD.js";
import { DBTransaction as Transaction } from "./db/DBTransaction.js";
import { DBEngine } from "./db/db.js";
import { InfoElement, Element } from "./element.js";
import { Store } from "./store.js";
import { JWT } from "./JWT.js";
enum ModeForm {
  INSERT = 1,
  UPDATE,
  DELETE,
  AUTO,
}

type FormFieldInfo = {
  id: string;
  component: string;
  label: string;
  className: string;
  input: string;
  type: string;
  name: string;
  cell: string;
  required: { message: string };
  rules: any;

  events: any;
  propertys: any;
  attributes: any;
};

type FieldComponent = {
  component: "field";
  id: string;
  label: string;
  className: string;
  input: string;
  type: string;
  name: string;

  required?: { message: string };
  rules: any;
  events: any;
  propertys: any;
  attributes: any;
};

type InfoDataList =
  | { sql: string; params?: (string | number)[] }
  | (string | number)[][];

type ElementType = {
  component: string;
  label?: string;
  className?: string;
  elements: ElementType[];
};

interface IRecordKey {
  [key: string]: any;
}

interface IRecord {
  [key: string]: any;
}

interface FormInfo {
  connection: string;
  label: string;
  className: string;
  form: {
    label: string;
    className: string;
    nav: string;
    sections?: {
      name: string;
      label?: string;
      className?: string;
      elements: ElementType[];
    }[];
    tabs?: {
      name: string;
      label?: string;
      className?: string;
      elements: any[];
    }[];
    layout: any;
    recordData: any;
  };
  fields: FormFieldInfo[];
  dataLists: {
    name: string;
    data: InfoDataList[];
    childs?: boolean;
    parent: string;
    mode: "fetch";
  }[];

  defaultData: { [key: string]: any };

  fixedData: { [key: string]: any };

  nav: { [key: string]: any };
}

export class Model {
  name: string;
  mode: string;
  response;
}

export class Form extends Element {
  private _config: FormInfo;

  private method: string;

  public panel: string;
  public id: string;
  public name: string;
  public element: string = "wh-html";
  public className: string | string[];
  public setPanel: string;
  public appendTo: string;

  private templateFile: string;

  private response: object = {};

  store: Store = null;

  private query: string;
  private db: DBEngine;

  private connection: string = "mysql";
  private _info: any;
  private fields;
  private layout: any;

  private data;
  private datafields;
  private dataFetch;
  private dataLists;

  private _data;
  private params: any = {};

  private record;
  private mode;
  private scheme;
  private keyToken;
  private dataRecord;
  private recordKey;
  private to;

  private state: {
    page?: number;
    filter?: string;
    key?: string;
    record?: any;
    mode?: number;
  };

  keySecret = "Robin Williams";
  setStore(store: Store) {
    this.store = store;
  }

  init(info: any /*: InfoElement*/) {
    this._config = info;
    this._info = info;
    //this._info = this.store.loadJsonFile(info.source) || {};

    for (const [key, value] of Object.entries(info)) {
      this[key] = value;
    }
  }

  async evalMethod(method: string) {
    this.method = method;
    if (this._info.methods && this._info.methods[method]) {
      this._info = { ...this._info, ...this._info?.methods[method] };
    }

    this.state = {
      page: this.params["page"] || this.store.getSes("__page_") || "1",
      filter: this.params["filter"] || this.store.getReq("__filter_"),
      key: this.store.getReq("__key_") || this.store.getSes("__key_"),
      record:
        this.params.__record_ ||
        this.store.getReq("__record_") ||
        this.store.getSes("__record_"),
    };

    switch (method) {
      case "load-form":
        this.state.key = null;
        await this.loadForm(ModeForm.INSERT);
        break;
      case "list":
        const page = this.store.getSes("__page_") || "1";
        await this.doGrid(Number(page));
        break;
      case "new-record":
        this.state.key = null;
        await this.loadForm(ModeForm.INSERT);
        break;
      case "request":
        await this.loadForm(ModeForm.INSERT);
        break;
      case "load-record":
        await this.loadForm(ModeForm.UPDATE);
        break;
      case "request2":
        await this.evalFields();
        break;
      case "find":
        await this.find();
        break;
      case "data-fields":
        await this.doDataFields(this.params?.parent);
        break;
      case "save":
        await this.saveRecord();
        break;

      case "load-page":
        await this.loadPageInfo();
    }
  }

  private doFormElements() {
    const config = this._config;

    if (config.form.layout) {
      return config.form.layout;
    }

    let section = {};

    if ("sections" in config.form) {
      section = config.form.sections.reduce((a, s) => {
        a[s.name] = {
          component: "section",
          label: s.label,
          className: s.className,
          elements: [],
        };
        return a;
      }, {});
    }

    let pages: {
      [key: string]: { page: ElementType; parent: any };
    } = {};
    let tabPages: any = {};

    if ("tabs" in config.form) {
      for (const tab of config.form.tabs) {
        tabPages[tab.name] = {
          component: "tab",
          label: tab.label,
          className: tab.className,
          elements: tab.elements.map((e) => {
            const _page = {
              component: "tabPage",
              label: e.label,
              className: e.className,
              elements: [],
            };

            pages[e.name] = {
              page: _page,
              parent: tabPages[tab.name],
            };
            return _page;
          }),
        };
      }
    }

    let elements: any[] = [];
    let page = elements;

    for (const field of config.fields) {
      const f: FieldComponent = {
        id: field.id,
        component: "field",
        name: field.name,
        label: field.name,
        className: field.className,
        input: field.input,
        type: field.type,
        required: field.required,
        rules: field.rules,
        events: field.events,
        propertys: field.propertys,
        attributes: field.attributes,
      };

      if (field.name in tabPages) {
        elements.push(tabPages[field.name]);
      }

      if (field.name in pages) {
        page = pages[field.name].page.elements;
      }

      if (field.name in section) {
        page.push(section[field.name]);
        page = section[field.name].elements;
      }

      page.push(f);
    }

    this.configInputs().forEach((item) => elements.push(item));
    return elements;
  }

  private async getRecordData(mode: number) {
    const config = this._config;
    const connection = this._config.connection || this.connection;

    let data = config.defaultData || {};

    data.__page_ = this.state.page;
    data.__filter_ = this.state.filter;

    const key: IRecordKey = this.getRecordKey();

    if (key) {
      const db = this.store.db.get<DBEngine>(connection);
      data = { ...data, ...(await db.getRecord(config.form.recordData, key)) };
    }

    data = { ...data, __mode_: mode, ...(this._info.fixedData || {}) };

    if (+mode != ModeForm.INSERT) {
      data.__key_ = this.genToken(key);
    }
    return data;
  }

  private async loadForm(mode: number) {
    const config = this._config;
    const form = this._config.form;

    const values = await this.getRecordData(mode);

    const dataSource = {
      caption: form.label || config.label,
      className: form.className || config.className,
      elements: this.doFormElements(),
      nav: config.nav[form.nav],
      dataLists: await this.getDataList(config.dataLists, values),
      values,
      appRequests: await this.appRequests("list"),
    };

    this.doResponse({
      element: "form",
      propertys: {
        dataSource,
        log: {},
      },
    });
  }

  private async doGrid(page: number) {
    const fields = this._info.fields.map((field) => ({
      name: field.name,
      label: field.label,
      type: field.cellType,
      cellWidth: field.cellWidth,
    }));

    const { label, gridData, gridOptions, errorMessages, nav } = this._info;

    if (this.params.page === null) {
      gridData.page =
        this.store.getReq("__page_") || this.store.getSes("__page_");
    }

    const info = await this._pageData(gridData);
    const appRequests = this.appRequests();

    this.doResponse({
      element: "grid",
      propertys: {
        dataSource: {
          caption: label,
          fields,
          data: info.data,
          limit: +gridData.limit,
          page: +info.page,
          records: +info.totalRecords,
          maxPages: +(info.totalPages || gridOptions.maxPages || 6),
          filter: gridData.filter,
          nav,
          errorMessages,
          appRequests,
        },
        output: info.data,
      },
      log: "yanny esteban",
    });
  }

  private async loadPageInfo() {
    const { gridData, fields } = this._info;

    if (this.params?.filter) {
      gridData.filter = this.params.filter;
    }

    const pageData = await this._pageData(gridData);
    this.doResponse({
      element: "grid",
      propertys: {
        pageData: { ...pageData, fields },
      },
    });
  }

  private doKeyRecord(record1, data) {
    const record = ["employeeNumber"];

    const key = record.reduce((acc, e) => ((acc[e] = data[e]), acc), {});

    return key;
  }

  private async _pageData(info) {
    let data: any[] = [];
    const db = this.store.db.get<DBEngine>(this.connection);

    let result = await db.query(info);

    if (result.rows) {
      data = result.rows.map((row, index) => ({
        ...row,
        __mode_: 2,
        __key_: this.genToken(this.doKeyRecord({}, row)),
      }));
    }

    return {
      data,
      totalRecords: result.totalRecords || 0,
      totalPages: result.totalPages || 0,
      page: result.page || 1,
      limit: info.limit,
      filter: info.filter,
    };
  }

   addRequest(type, info) {}

  private async getDataRecord(info) {
    //info = JSON.parse(this.store.evalSubData(JSON.stringify(info), this._data));

    if (info.sql) {
      const rows = (await this.db.query(info.sql, info.params ?? undefined))
        .rows;
      if (rows.length > 0) {
        return rows[0];
      }
    }

    return {};
  }

  private async find() {
    const db = (this.db = this.store.db.get<DBEngine>(this.connection));
    let data = await this.getDataRecord(this.dataRecord);
    this._data = data;
    let key;

    if (this.recordKey) {
      key = {
        record: this.recordKey.reduce(
          (a: object, fieldName: string) => (
            (a[fieldName] = data[fieldName]), a
          ),
          {}
        ),
      };
    }

    const jwt = new JWT({ key: "yanny" });
    const token = jwt.generate(key);

    data["__key_"] = token;
    data["__mode_"] = 2;

    //this._data["__key_"] = JSON.stringify(this.record);
    this.layout.data = data;
    if (this.datafields) {
      //this.layout.dataLists = await this.evalDataFields(this.datafields);
    }
    const output = [];
    if (this.dataLists) {
      for (const d of this.dataLists) {
        output.push({
          name: d.name,
          data: await this.evalData(d.data, this._data),
          childs: d.childs,
          parent: d.parent,
          mode: d.mode,
          value: data[d.name],
        });
      }

      this.layout.dataLists = output;
    }

    this.layout.appRequests = this.appRequests("list");

    this.layout.elements.push(
      {
        component: "field",
        label: "__mode_",
        input: "input",
        name: "__mode_",
      },
      {
        component: "field",
        label: "__key_",
        input: "input",
        name: "__key_",
      },
      {
        component: "field",
        label: "__key_",
        input: "input",
        name: "__key_",
      }
    );
    this.doResponse({
      element: "form",
      propertys: {
        dataSource: this.layout,
        //f: await this.evalDataFields(this.datafields),
        output,
      },
    });
  }
  private async saveRecord() {
    const db = this.store.db.get<DBEngine>(this.connection);

    const key = this.getRecordKey();
    //const mode = +this.store.getReq("__mode_");
    const data = { ...this.store.getVReq(), __key_: key };
    const scheme = this._info.scheme;

    const config = {
      transaction: true,
    };

    const transaction = new Transaction(config, db);
    const result = await transaction.save(scheme, [data], {});

    let message = "";
    let keyToken = "";
    if (result.error) {
      message = result.error;
      this.store.setSes("__error_", true);
    } else {
      this.store.setSes("__error_", false);
      message = "record was saved correctly!";
      if (result.recordId) {
        keyToken = this.genToken(result.recordId);
      }
    }

    this.store.setSes("__key_", keyToken);
    this.doResponse({
      /*
                  element: "form",
                  propertys: {
                      //f: await this.evalDataFields(this.datafields),
                      output: "SAVE FORM",
                  },
                  */
      log: { ...result },

      message,
    });
  }
  
/*
  private async getDataFields(list) {
    const output = [];
    for (const info of list) {
      output.push(await this.getDataField(info));
    }
    return output;
  }

  private async getDataField(info) {
    return {
      name: info.name,
      data: await this.evalData(info.data, this._data),
      childs: info.childs,
      parent: info.parent,
      mode: info.mode,
    };
  }
*/
  private async getDataList(dataLists, values?) {
    const dataList = [];
    if (dataLists) {
      for (const list of dataLists) {
        dataList.push({
          name: list.name,
          data: await this.evalData(list.data, values),
          childs: list.childs,
          parent: list.parent,
          mode: list.mode,
          value: values[list.name],
        });
      }
    }
    return dataList;
  }
  private async doDataFields(parent) {




    const values = this.store.getVReq();

    //const db = (this.db = this.store.db.get<DBEngine>(connection));

    const list = this.dataLists.filter((data) => data.parent == parent);

    this.doResponse({
      element: "form",
      propertys: {
        dataFields: await this.getDataList(list, values)
      },
    });
  }

 

  private async evalData(dataField, values) {
    dataField = JSON.parse(
      this.store.evalSubData(JSON.stringify(dataField), values)
    );

    let info = [];
    const db = this.store.db.get<DBEngine>(this.connection);
    for (const data of dataField) {
      if (Array.isArray(data)) {
        info.push({
          value: data[0],
          text: data[1],
          level: data[2] ?? undefined,
        });
      } else if (typeof data === "object") {
        if (data.sql) {
          const result = (await db.query(data.sql, data.params ?? undefined))
            .rows;
          info = [...info, ...result];
        } else if (data.value && data.text) {
          info.push(data);
        }
      }
    }

    return info;
  }

  private async evalFields() {
    const mainElements = [];
    const fields = this.fields;

    let tab = null;
    let section = {};

    if ("sections" in this._info) {
      section = this._info.sections.reduce((a, s) => {
        a[s.from] = {
          element: "section",
          title: s.title,
          elements: [],
        };
        return a;
      }, {});
    }

    if ("tabs" in this._info) {
      tab = this._info.tabs.reduce((tab, s) => {
        tab[s.from] = {
          element: "tab",
          to: s.to,
          title: s.title,
          page: s.pages.reduce((page, p) => {
            page[p.field] = {
              element: "section",
              title: p.title,
              elements: [],
            };
            return page;
          }, {}),
        };
        return tab;
      }, {});
    }

    let elements = mainElements;
    let infoTab = null;
    let lastTab = null;
    for (const field of fields) {
      if (field.name in tab) {
        lastTab = {
          element: "tab",
          title: tab[field.name].title,
          pages: [],
        };
        mainElements.push(lastTab);
        infoTab = tab[field.name];
      }

      if (infoTab) {
        if (field.name in infoTab.page) {
          elements = [];
          lastTab.pages.push(elements);
        }
      }

      if (field.name in section) {
        mainElements.push(section[field.name]);
        elements = section[field.name].elements;
      }

      elements.push(field);
    }
  }

  private genToken(payload) {
    if (!payload) {
      return "";
    }

    const jwt = new JWT({ key: this.keySecret });
    return jwt.generate(payload);
  }

  private decodeToken(token) {
    const jwt = new JWT({ key: this.keySecret });
    return jwt.verify(token);
  }

  private getRecordKey(): IRecordKey {
    if (this.state.key) {
      return this.decodeToken(this.state.key);
    }

    return this.state.record;
  }

  

  

    

  private appRequests(type?: string) {
    const requests = {
      dataField: {
        blockTo: true,
        actions: [
          {
            do: "update",
            to: "{{&TO_}}",
            api: "form",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            method: "data-fields",
            params: {
              parent: "{=parent}",
            },
          },
        ],
      },
      save: {
        blockTo: true,
        confirm: "secure save?",
        reportValidity: true,
        actions: [
          {
            do: "update",
            api: "form",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            method: "save",
          },
          {
            do: "set-panel",
            to: "{{&TO_}}",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            api: "form",
            method: "load-record",
            params: {
              page: 2,
            },
            doWhen: {
              __error_: false,
            },
          },
        ],
      },
      delete: {
        blockTo: true,
        setFormValue: {
          __mode_: "3",
        },
        actions: [
          {
            do: "update",
            api: "form",
            id: null,
            name: "{{&NAME_}}",
            method: "save",
          },
          {
            do: "set-panel",
            to: "{{&TO_}}",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            api: "form",
            method: "load-record",
            params: {
              page: 2,
            },
            doWhen: {
              __error_: false,
            },
          },
        ],
      },
      list: {
        blockTo: true,
        actions: [
          {
            do: "set-panel",
            api: "form",
            to: "{{&TO_}}",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            method: "list",
            params: {
              page: 1,
            },
          },
        ],
      },
      "load-page": {
        blockTo: true,
        actions: [
          {
            do: "update",
            api: "form",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            method: "load-page",
            params: {
              page: "{=page}",
              filter: "{=filter}",
            },
          },
        ],
      },
      "edit-record": {
        validate: "#{{&ID_}}",
        validateOption: "select",
        blockTo: true,
        actions: [
          {
            do: "set-panel",
            api: "form",
            to: "{{&TO_}}",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            method: "load-record",
          },
        ],
      },
      "delete-record": {
        blockTo: true,
        confirm: "borrando!",
        validate: "#{{&ID_}}",
        validateOption: "select",
        setFormValue: {
          __mode_: "3",
        },
        store: {
          __page_: "1",
        },
        actions: [
          {
            do: "update",
            api: "form",
            to: null,
            id: null,
            name: "{{&NAME_}}",
            method: "save",
          },
          {
            do: "set-panel",
            api: "form",
            to: "{{&TO_}}",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            method: "list",
            params: {
              page: null,
            },
          },
        ],
      },
      filter: {
        blockTo: true,
        actions: [
          {
            do: "update",
            api: "form",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            method: "load-page",
            params: {
              page: 1,
              filter: "{=filter}",
            },
          },
        ],
      },
      new: {
        blockTo: true,
        actions: [
          {
            do: "set-panel",
            to: "{{&TO_}}",
            api: "form",
            id: "{{&ID_}}",
            name: "{{&NAME_}}",
            method: "new-record",
          },
        ],
      },
    };

    return JSON.parse(this.store.eval(JSON.stringify(requests)));
  }

  private configInputs() {
    return [
      {
        component: "field",
        label: "__mode_",
        input: "input",
        name: "__mode_",
      },
      {
        component: "field",
        label: "__key_",
        input: "input",
        name: "__key_",
      },
      {
        component: "field",
        label: "__filter_",
        input: "input",
        name: "__filter_",
      },
      {
        component: "field",
        label: "__page_",
        input: "input",
        name: "__page_",
      },
    ];
  }

  test() {
    const DBRequest = {
      sql: "select",
      filter: [],
      params: [],

      select: [["add", "field1", ["mult", 3, 4]]],
      from: "t:t1",
      join: ["inner", "t2:t2", { "t1.a": "t2.a" }],
      where: { "a:>": 2 },
      orderBY: ["desc", "field1"],
      limit: 4,
      offset: 10,
    };
  }
}
