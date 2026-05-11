import mqtt from 'mqtt';
import { CONFIG } from './config.js';
import { LOGGER } from './logger.js';

export class MQTT {
    connection;
    optimistic;

    constructor (WATER_HEATERS) {
        const { mqtt_host, mqtt_port, mqtt_username, mqtt_password, mqtt_optimistic } = CONFIG();

        this.connection = mqtt.connect(`mqtt://${mqtt_host}:${mqtt_port}`, {
            username: mqtt_username,
            password: mqtt_password,
            reconnectPeriod: 60000
        });
        this.connection.on('message', (topic, message) => this.onMessage(WATER_HEATERS, topic, message));
        this.connection.on('error', this.onError);

        this.optimistic = mqtt_optimistic;
    }

    onError (error) {
        LOGGER.error({message: "MQTT Error Occured", error});
    }

    onMessage (WATER_HEATERS, topic, message) {
        LOGGER.trace({message: "Got MQTT Message", topic, message});

        const [prefix, deviceId, commands, commandType] = topic.split('/');
    
        // Make sure we are on the commands topic
        if (commands !== 'commands') {
            return;
        }
    
        if (deviceId in WATER_HEATERS) {
            WATER_HEATERS[deviceId].updatePendingCommands(commandType, message.toString());
        }
    }

    async publish (topic, payload) {
        return await this.connection.publishAsync(topic, payload, {retain: true});
    }

    async subscribe (topic) {
        return await this.connection.subscribeAsync(topic);
    }
}