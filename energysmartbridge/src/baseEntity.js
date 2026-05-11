import { CONFIG } from './config.js';
import { LOGGER } from "./logger.js";
import { DEVICE_CLASS_MAPPING, READABLE_MAPPING } from './mappings.js';

export class BaseEntity {
    name;
    value;
    waterHeater;
    diagnostic;

    sensorType;

    constructor (name, waterHeater, value, mqtt, config = {}) {
        this.name = name;
        this.waterHeater = waterHeater;
        this.value = value;
        this.mqtt = mqtt;
        this.config = config;
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

    composeConfig (entityConfig = {}) {
        const payload = {
            state_topic: this.createStateTopic(),
            unique_id: `${this.waterHeater.deviceId}-${this.name}`,
            name: READABLE_MAPPING[this.name],
            default_entity_id: `${this.waterHeater.deviceId}_${READABLE_MAPPING[this.name].replaceAll(" ", "_")}`,
            ...entityConfig,
            ...this.waterHeater.generateDeviceConfig(),
        };

        if (this.name in DEVICE_CLASS_MAPPING) {
            payload.device_class = DEVICE_CLASS_MAPPING[this.name];
        }

        return {...payload, ...this.config};
    }

    async publishConfig () {
        const topic = this.createConfigTopic();
        
        LOGGER.trace({message: "Publishing config", topic, name: this.name});

        await this.mqtt.publish(topic, JSON.stringify(this.composeConfig()));
    }

    async publishState () {
        const topic = this.createStateTopic();
        LOGGER.trace({message: "Publishing state", topic, name: this.name, value: this.value});
        await this.mqtt.publish(topic, this.value);
    }
}