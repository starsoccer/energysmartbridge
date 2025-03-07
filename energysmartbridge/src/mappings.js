export const MODE_MAPPING = {
    'Electric': 'electric',
    'Standard': "electric",
    'Efficiency': "heat_pump",
    'EnergySmart': "eco",
    'Hybrid': "eco",
    'Vacation': "off",
};

export const MAPPING = {
    DeviceText: 'deviceId',
    Password: 'password',
    ModuleApi: 'moduleAPI',
    ModFwVer: 'moduleFirmwareVersion',
    MasterFwVer: 'masterFirmwareVersion',
    MasterModelId: 'masterModelId',
    DisplayFwVer: 'displayFirmwareVersion',
    WifiFwVer: 'wifiFirmwareVersion',
    UpdateRate: 'updateRate',
    Mode: 'mode',
    SetPoint: 'setPoint',
    Units: 'units',
    LeakDetect: 'leakDetected',
    MaxSetPoint: 'maxSetPoint',
    Grid: 'grid',
    AirFilterStatus: 'airFilterStatus',
    CondensePumpFail: 'condensePumpFail',
    AvailableModes: 'availableModes',
    SystemInHeating: 'heating',
    HotWaterVol: 'hotWaterVolume',
    Leak: 'leak',
    DryFire: 'dryFire',
    ElementFail: 'elementFail',
    TankSensorFail: 'tankSensorFail',
    EcoError: 'ecoError',
    MasterDispFail: 'masterDisplayFail',
    CompSensorFail: 'systemSensorFail',
    SysSensorFail: 'systemSensorFail',
    SystemFail: 'systemFail',
    UpperTemp: 'upperTemperature',
    LowerTemp: 'lowerTemperature',
    FaultCodes: 'faultCodes',
    UnConnectNumber: 'unConnectNumber',
    AddrData: 'addressData',
    SignalStrength: 'signalStrength',
    Units: 'units',
};

export const READABLE_MAPPING = {
    dryFire: 'Dry Fire Detected',
    ecoError: 'Eco Error Detected',
    elementFail: 'Element Failed',
    faultCodes: 'Fault Codes',
    grid: 'Grid RA Enabled',
    heating: 'Is Heating',
    hotWaterVolume: 'Hot Water Volume',
    leak: 'Leak Detected',
    leakDetected: 'Leak Detection Enabled',
    masterDisplayFail: 'Master Display Failed',
    tankSensorFail: 'Tank Sensor Failed',
    upperTemperature: 'Upper Temperature',
    lowerTemperature: 'Lower Temperature',
    maxSetPoint: 'Max Set Point',
    moduleAPI: 'Module API',
    moduleFirmwareVersion: 'Module Firmware Version',
    masterFirmwareVersion: 'Master Firmware Version',
    masterModelId: 'Master Model Id',
    displayFirmwareVersion: 'Display Firmware Version',
    wifiFirmwareVersion: 'Wifi Firmware Version',
    updateRate: 'Update Rate',
    addressData: 'Address Data',
    signalStrength: 'Signal Strength',
    unConnectNumber: 'UnConnect Number',
};

export const DEVICE_CLASS_MAPPING = {
    heating: 'heat',
    elementFail: 'problem',
    grid: 'connectivity',
    dryFire: 'problem',
    ecoError: 'problem',
    leak: 'moisture',

    masterDisplayFail: 'problem',
    tankSensorFail: 'problem',
    upperTemperature: 'temperature',
    lowerTemperature: 'temperature',
    maxSetPoint: 'temperature',

    hotWaterVolume: 'enum',

    updateRate: 'duration',
    signalStrength: 'signal_strength',
};