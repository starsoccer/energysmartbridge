import { BaseEntity } from './baseEntity.js';

export class Sensor extends BaseEntity {
    sensorType = "sensor";

    constructor (name, waterHeater, value, mqtt, config = {}) {
        super(name, waterHeater, value, mqtt, config);
    }
}