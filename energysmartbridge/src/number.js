import { BaseEntity } from './baseEntity.js';

export class Number extends BaseEntity {
    sensorType = "number";
    min;
    max;

    constructor (name, waterHeater, value, mqtt, config = {}, min, max) {
        super(name, waterHeater, value, mqtt, config);

        this.max = max;
        this.min = min;
    }

    commandTopic () {
        return `energysmartbridge/${this.waterHeater.deviceId}/commands/${this.name}`;
    }

    async bootstrap () {
        super.bootstrap();
        await this.mqtt.subscribe(this.commandTopic());
    }

    composeConfig () {
        return super.composeConfig({
            command_topic: this.commandTopic(),
            min: this.min,
            max: this.max,
        });
    }
}