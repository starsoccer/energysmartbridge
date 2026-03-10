import { CONFIG } from './config.js';
import { LOGGER } from "./logger.js";
import { DEVICE_CLASS_MAPPING, READABLE_MAPPING } from './mappings.js';

export class BaseSensor {
    name;
    value;
    waterHeater;
    diagnostic;
    inverse;

    sensorType;

    constructor (name, waterHeater, value, mqtt, options = {}) {
        this.name = name;
        this.waterHeater = waterHeater;
        this.value = value;
        this.mqtt = mqtt;
        this.diagnostic = options.isDiagnostic || false;
        this.inverse = options.inverse || false;
    }

    async bootstrap () {
        await this.publishConfig();
        await this.publishState();
    }

    async updateValue (value) {
        this.value = value;
        await this.publishState();
    }

    createConfigTopic () {
        const { mqtt_homeassistant_prefix } = CONFIG();
        return `${mqtt_homeassistant_prefix}/${this.sensorType}/${this.waterHeater.deviceId}/${this.name}/config`
    }

    createStateTopic () {
        const { mqtt_prefix } = CONFIG();
        return `${mqtt_prefix}/${this.waterHeater.deviceId}/${this.name}`
    }

    async publishConfig () {
        const payload = {
            state_topic: this.createStateTopic(),
            unique_id: `${this.waterHeater.deviceId}-${this.name}`,
            name: READABLE_MAPPING[this.name],
            default_entity_id: `${this.waterHeater.deviceId}_${READABLE_MAPPING[this.name].replaceAll(" ", "_")}`,
            ...this.waterHeater.generateDeviceConfig(),
        };

        if (this.diagnostic) {
            payload.entity_category = 'diagnostic'
        }

        if (this.name in DEVICE_CLASS_MAPPING) {
            payload.device_class = DEVICE_CLASS_MAPPING[this.name];
        }

        const topic = this.createConfigTopic();
        
        LOGGER.trace({message: "Publishing config", topic, name: this.name});

        await this.mqtt.publish(topic, JSON.stringify(payload));
    }

    async publishState () {
        const topic = this.createStateTopic();
        LOGGER.trace({message: "Publishing state", topic, name: this.name, value: this.value});
        await this.mqtt.publish(topic, this.value);
    }
}