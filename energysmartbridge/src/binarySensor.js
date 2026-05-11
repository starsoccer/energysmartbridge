import { BaseEntity } from './baseEntity.js';

export class BinarySensor extends BaseEntity {
    sensorType = "binary_sensor";

    inverse;
    
    constructor (name, waterHeater, value, mqtt, config = {}, inverse = false) {
        super(name, waterHeater, value, mqtt, config);
        this.inverse = inverse || false;
        this.value = this.convertValue(this.value);
    }

    convertValue (value) {
        switch (value.toUpperCase()) {
            case 'DISABLED':
            case 'FALSE':
            case 'NONE':
            case 'NOTDETECTED':
                return (this.inverse ? 'ON' : 'OFF');
            case 'ENABLED':
            case 'TRUE':
            case 'OK':
            case 'DETECTED':
                return (this.inverse ? 'OFF' : 'ON');
            default:
                // log unknown value
                return value;
        }
    }

    async updateValue (value) {
        await super.updateValue(this.convertValue(value));
    }
}