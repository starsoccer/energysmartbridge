import { BinarySensor } from "./binarySensor.js";
import { LOGGER } from "./logger.js";
import { Sensor } from "./sensor.js";
import { MAPPING, MODE_MAPPING } from './mappings.js';
import { NumberSensor } from "./numberSensor.js";

export const COMMAND_MAPPING = {
    mode: 'Mode',
    updateRate: 'UpdateRate',
    temperature: 'SetPoint',
}

export class WaterHeater {
    mqtt;
    pendingCommands;
    sensors = {};


    moduleAPI;
    moduleFirmwareVersion; 
    masterFirmwareVersion; 
    masterModelId;
    displayFirmwareVersion;
    wifiFirmwareVersion;
    updateRate;
    mode;
    setPoint;
    units;
    leakDetected;
    maxSetPoint;
    grid;
    airFilterStatus;
    condensePumpFail;
    availableModes;
    heating;
    hotWaterVolume;
    leak;
    dryFire;
    elementFail;
    tankSensorFail;
    ecoError;
    masterDisplayFail;
    systemSensorFail;
    systemSensorFail;
    systemFail;
    upperTemperature;
    lowerTemperature;
    faultCodes;
    unConnectNumber;
    addressData;
    signalStrength;

    constructor (mqtt) {
        this.mqtt = mqtt;
    }

    async bootstrap (queryParams) {
        await this.convertQueryParams(queryParams);
        await this.createHomeAssistantConfig();
        await this.listenForCommands();
    }

    async createUpdateSensor (queryParams, key, type, options = {}) {
        LOGGER.trace({message: "Converting key to sensor", key});

        if (MAPPING[key] in this.sensors) {
            await this.sensors[MAPPING[key]].updateValue(queryParams[key]);
        } else {
            this.sensors[MAPPING[key]] = new type(MAPPING[key], this, queryParams[key], this.mqtt, options);
            await this.sensors[MAPPING[key]].bootstrap();
        }
    }

    async convertQueryParams (queryParams) {
        const keys = Object.keys(queryParams);

        // Do device id first since we need it to create all the other sensors
        if (keys.includes('DeviceText')) {
            LOGGER.trace({message: 'Setting device id', deviceId: queryParams['DeviceText']});
            this[MAPPING['DeviceText']] = queryParams['DeviceText'];
        }

        const unit = ('Units' in queryParams ? `°${queryParams['Units']}` : '°F');
        LOGGER.trace({message: 'Got Unit', unit});

        for (const key of keys) {
            LOGGER.trace({message: "Converting key", key});

            if (key in MAPPING) {
                switch (key) {
                    case 'AvailableModes':
                        this[MAPPING[key]] = queryParams[key].split(',');
                        break;
                    case 'SetPoint':
                        this[MAPPING[key]] = parseInt(queryParams[key]);
                        break;
                    case 'Mode':
                        this[MAPPING[key]] = queryParams[key];
                        break;
                    case 'Grid':
                    case 'SystemInHeating':
                    case 'Leak':
                    case 'LeakDetect':
                    case 'DryFire':
                    case 'ElementFail':
                    case 'TankSensorFail':
                    case 'EcoError':
                    case 'MasterDispFail':
                    case 'CompSensorFail':
                    case 'SysSensorFail':
                    case 'SystemFail':
                    case 'CondensePumpFail':
                        await this.createUpdateSensor(queryParams, key, BinarySensor, {isDiagnostic: false});
                        break;
                    case 'AirFilterStatus':
                        await this.createUpdateSensor(queryParams, key, BinarySensor, {isDiagnostic: false, inverse: true});
                        break;
                    case 'FaultCodes':
                    case 'HotWaterVol':
                        await this.createUpdateSensor(queryParams, key, Sensor, {isDiagnostic: false});
                        break;
                    case 'LowerTemp':
                    case 'UpperTemp':
                    case 'MaxSetPoint':
                        await this.createUpdateSensor(queryParams, key, Sensor, {isDiagnostic: false, unit});
                        break;
                    case 'ModuleApi':
                    case 'ModFwVer':
                    case 'MasterFwVer':
                    case 'MasterModelId':
                    case 'DisplayFwVer':
                    case 'WifiFwVer':
                    case 'UnConnectNumber':
                    case 'AddrData':
                    case 'SignalStrength':
                        await this.createUpdateSensor(queryParams, key, Sensor, {isDiagnostic: true});
                        break;
                    case 'UpdateRate':
                        await this.createUpdateSensor(queryParams, key, NumberSensor, {isDiagnostic: true, max: 600, min: 30});
                        break;
                    default:
                        //convertedParams[MAPPING[key]] = queryParams[key];
                }
            }
        }

        await this.updateMQTTData()
    }


    updatePendingCommands (key, value) {
        if (key in COMMAND_MAPPING) {
            if (!this.pendingCommands) {
                this.pendingCommands = {};
            }

            switch (key) {
                case 'temperature':
                    this.pendingCommands[COMMAND_MAPPING[key]] = parseInt(value).toFixed(0);
                    break;
                default:
                    this.pendingCommands[COMMAND_MAPPING[key]] = value;
            }
        }

        LOGGER.trace({message: "Updated Pending Commands", pendingCommands: this.pendingCommands});
    }

    toResponse () {
        const response = {
            Success: "0",
            ...this.pendingCommands,
        }

        delete this.pendingCommands;

        return response;
    }

    generateDeviceConfig () {
        return {
            device: {
                "identifiers":[this.deviceId],
                "name":`Hot Water Heater ${this.deviceId}`,
                "model_id": this.masterModelId,
                "serial_number": this.deviceId,
                "sw_version": this.masterFirmwareVersion,
            }
        }
    }

    generateModeMappingTemplate (inverse) {
        const mapping = {};

        for (const mode of this.availableModes) {
            if (mode in MODE_MAPPING) {
                if (inverse) {
                    mapping[MODE_MAPPING[mode]] = mode;
                } else {
                    mapping[mode] = MODE_MAPPING[mode];
                }
            }
        }

        return `{% set lookup = ${JSON.stringify(mapping)} %}{{- lookup[value] -}}`;
    }

    async listenForCommands () {
        await this.mqtt.subscribe(`energysmartbridge/${this.deviceId}/commands/temperature`);
        await this.mqtt.subscribe(`energysmartbridge/${this.deviceId}/commands/mode`);
    }

    async createHomeAssistantConfig () {
        await this.mqtt.publish(`homeassistant/water_heater/${this.deviceId}/config`, JSON.stringify({
            // Mode Config
            mode_state_topic: `energysmartbridge/${this.deviceId}/mode`,
            mode_state_template: this.generateModeMappingTemplate(false),
            modes: this.availableModes.filter(mode => mode in MODE_MAPPING).map(mode => MODE_MAPPING[mode]), // dynamically built list of supported modes

            mode_command_topic: `energysmartbridge/${this.deviceId}/commands/mode`,
            mode_command_template: this.generateModeMappingTemplate(true),

            // Temperature
            temperature_state_topic: `energysmartbridge/${this.deviceId}/set_point`,
            temperature_command_topic: `energysmartbridge/${this.deviceId}/commands/temperature`,
            current_temperature_topic: `energysmartbridge/${this.deviceId}/current_temperature`,
            max_temp: this.maxSetPoint,

            unique_id: `${this.deviceId}_water_heater`,
            ...this.generateDeviceConfig(),
        }), {retain: true});
    }

    async updateMQTTData () {
        //await this.mqtt.publish(`energysmartbridge/${this.deviceId}/upper_temperature`, this.upperTemperature.value);
        //await this.mqtt.publish(`energysmartbridge/${this.deviceId}/lower_temperature`, this.lowerTemperature.value);
        await this.mqtt.publish(`energysmartbridge/${this.deviceId}/current_temperature`, ((parseInt(this.sensors.lowerTemperature.value) + parseInt(this.sensors.upperTemperature.value)) / 2).toFixed(0));

        await this.mqtt.publish(`energysmartbridge/${this.deviceId}/mode`, this.mode);
        await this.mqtt.publish(`energysmartbridge/${this.deviceId}/set_point`, this.setPoint.toString());
    }
}