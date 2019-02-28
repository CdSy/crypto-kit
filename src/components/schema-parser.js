import React from 'react';
import AppDatePicker from "./app-form/app-datepicker";
import AppInput from "./app-form/app-input";
import NumberInput from "./app-form/number-input";
import AppSelect from "./app-form/app-select";
import SelectCell from "./select-cell";

const widgetMap = {
    string: {
        text: AppInput,
        select: AppSelect,
        "datetime-local": AppDatePicker,
    },
    number: {
        text: NumberInput,
    },
    integer: {
        text: NumberInput,
    },
};

class JsonSchemaParser {
    parse(schema) {
        if (!schema) {
            return {};
        }

        const props = this.getProperties(schema);
        const map = Object.keys(props).reduce((MAP, key) => {
            const ref = props[key].$ref;
            const type = props[key].type;
            const options = props[key].enum && props[key].enum.map(value => ({value, label: value}));
            const format = props[key].format;
            let widget;

            if (ref) {
                MAP[key] = {
                    type: 'string',
                    component: <AppInput />
                };

                return MAP;
            }

            if (type === 'string' && options) {
                MAP[key] = {
                    type: 'string',
                    component: <AppSelect options={options} />
                };

                return MAP;
            }

            if (type === 'string' && format) {
                MAP[key] = {
                    type: 'string',
                    component: <AppDatePicker />
                };

                return MAP;
            }

            if (type === 'string') {
                MAP[key] = {
                    type: 'string',
                    component: <AppInput />
                };

                return MAP;
            }

            if (type === 'boolean') {
                MAP[key] = {
                    type: 'boolean',
                    component: <SelectCell />
                };

                return MAP;
            }

            if (type === 'number' || type === 'integer') {
                MAP[key] = {
                    type: 'number',
                    component: <NumberInput value={''} onChange={() => {}}/>
                };

                return MAP;
            }
        }, {});

        return map;
    }

    getProperties(schema) {
        return schema.properties;
    }
}

export const JsonSchema = new JsonSchemaParser;
