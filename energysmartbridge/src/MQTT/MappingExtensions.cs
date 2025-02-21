using EnergySmartBridge.WebService;
using System.Collections.Generic;
using System.Linq;

namespace EnergySmartBridge.MQTT
{
    public static class MappingExtensions
    {
        public static string ToTopic(this WaterHeaterInput waterHeater, Topic topic)
        {
            return $"{Global.mqtt_prefix}/{waterHeater.DeviceText}/{topic}";
        }
        
        public static string GetDisplayName(this WaterHeaterInput waterHeater)
        {
            return waterHeater.DeviceText.Substring(waterHeater.DeviceText.Length - 4) + " Water Heater";
        }

        public static List<string> GetSupportedModes(this WaterHeaterInput waterHeater)
        {
            return waterHeater.AvailableModes.Split(',').ToList();
        }

        public static Climate ToThermostatConfig(this WaterHeaterInput waterHeater)
        {
            Climate ret = new Climate
            {
                name = waterHeater.GetDisplayName(),

                action_template = "{% if value == 'ON' %} heating {%- else -%} off {%- endif %}",
                action_topic = waterHeater.ToTopic(Topic.systeminheating_state),
                current_temperature_topic = waterHeater.ToTopic(Topic.uppertemp_state),

                temperature_state_topic = waterHeater.ToTopic(Topic.setpoint_state),
                temperature_command_topic = waterHeater.ToTopic(Topic.setpoint_command),

                max_temp = waterHeater.MaxSetPoint.ToString(),

                mode_state_topic = waterHeater.ToTopic(Topic.mode_state),
                mode_command_topic = waterHeater.ToTopic(Topic.mode_command),
                modes = new List<string> { "eco", "heat_pump", "electric", "off" },

                unique_id = waterHeater.DeviceText + "_water_heater",
            };

            return ret;
        }
        
        public static BinarySensor ToInHeatingConfig(this WaterHeaterInput waterHeater)
        {
            BinarySensor ret = new BinarySensor
            {
                name = waterHeater.GetDisplayName() + " Element",
                state_topic = waterHeater.ToTopic(Topic.systeminheating_state),
                unique_id = waterHeater.DeviceText + "_is_heating",
            };
            return ret;
        }

        public static Sensor ToRawModeConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " Raw Mode",
                state_topic = waterHeater.ToTopic(Topic.raw_mode_state),
                unique_id = waterHeater.DeviceText + "_raw_mode",
            };
            return ret;
        }

        public static BinarySensor ToGridConfig(this WaterHeaterInput waterHeater)
        {
            BinarySensor ret = new BinarySensor
            {
                name = waterHeater.GetDisplayName() + " RA Enabled",
                state_topic = waterHeater.ToTopic(Topic.grid_state),
                unique_id = waterHeater.DeviceText + "_ra_enabled",
            };
            return ret;
        }

        public static BinarySensor ToAirFilterStatusConfig(this WaterHeaterInput waterHeater)
        {
            BinarySensor ret = new BinarySensor
            {
                name = waterHeater.GetDisplayName() + " Air Filter Status",
                state_topic = waterHeater.ToTopic(Topic.air_filter_status_state),
                unique_id = waterHeater.DeviceText + "_air_filter_status",
            };
            return ret;
        }

        public static BinarySensor ToCondensePumpFailConfig(this WaterHeaterInput waterHeater)
        {
            BinarySensor ret = new BinarySensor
            {
                name = waterHeater.GetDisplayName() + " Condense Pump Fail",
                state_topic = waterHeater.ToTopic(Topic.condense_pump_fail_state),
                unique_id = waterHeater.DeviceText + "_condense_pump_fail",
            };
            return ret;
        }

        public static BinarySensor ToLeakDetectConfig(this WaterHeaterInput waterHeater)
        {
            BinarySensor ret = new BinarySensor
            {
                name = waterHeater.GetDisplayName() + " Leak Detect",
                state_topic = waterHeater.ToTopic(Topic.leak_detect_state),
                unique_id = waterHeater.DeviceText + "_leak_detect",
            };
            return ret;
        }

        public static Sensor ToHotWaterVolConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " Volume",
                state_topic = waterHeater.ToTopic(Topic.hotwatervol_state),
                unique_id = waterHeater.DeviceText + "_volume",
            };
            return ret;
        }

        public static Sensor ToUpperTempConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " Upper",
                device_class = Sensor.DeviceClass.temperature,
                state_topic = waterHeater.ToTopic(Topic.uppertemp_state),
                unit_of_measurement = "°" + waterHeater.Units,
                unique_id = waterHeater.DeviceText + "_upper_temp",
            };
            return ret;
        }

        public static Sensor ToLowerTempConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " Lower",
                device_class = Sensor.DeviceClass.temperature,
                state_topic = waterHeater.ToTopic(Topic.lowertemp_state),
                unit_of_measurement = "°" + waterHeater.Units,
                unique_id = waterHeater.DeviceText + "_lower_temp",
            };
            return ret;
        }

        public static BinarySensor ToDryFireConfig(this WaterHeaterInput waterHeater)
        {
            BinarySensor ret = new BinarySensor
            {
                name = waterHeater.GetDisplayName() + " Dry Fire",
                state_topic = waterHeater.ToTopic(Topic.dryfire_state),
                unique_id = waterHeater.DeviceText + "_dry_fire",
            };
            return ret;
        }

        public static BinarySensor ToElementFailConfig(this WaterHeaterInput waterHeater)
        {
            BinarySensor ret = new BinarySensor
            {
                name = waterHeater.GetDisplayName() + " Element Fail",
                state_topic = waterHeater.ToTopic(Topic.elementfail_state),
                unique_id = waterHeater.DeviceText + "_element_fail",
            };
            return ret;
        }

        public static BinarySensor ToTankSensorFailConfig(this WaterHeaterInput waterHeater)
        {
            BinarySensor ret = new BinarySensor
            {
                name = waterHeater.GetDisplayName() + " Tank Sensor Fail",
                state_topic = waterHeater.ToTopic(Topic.tanksensorfail_state),
                unique_id = waterHeater.DeviceText + "_tank_sensor_fail",
            };
            return ret;
        }

        public static BinarySensor ToEcoErrorConfig(this WaterHeaterInput waterHeater)
        {
            BinarySensor ret = new BinarySensor
            {
                name = waterHeater.GetDisplayName() + " Eco Error",
                state_topic = waterHeater.ToTopic(Topic.tanksensorfail_state),
                unique_id = waterHeater.DeviceText + "_eco_error",
            };
            return ret;
        }

        public static Sensor ToLeakConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " Leak",
                state_topic = waterHeater.ToTopic(Topic.leak_state),
                unique_id = waterHeater.DeviceText + "_leak",
            };
            return ret;
        }

        public static Sensor ToMasterDispFailConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " Master Disp Fail",
                state_topic = waterHeater.ToTopic(Topic.master_disp_fail_state),
                unique_id = waterHeater.DeviceText + "_master_disp_fail",
            };
            return ret;
        }

        public static Sensor ToCompSensorFailConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " Comp Sensor Fail",
                state_topic = waterHeater.ToTopic(Topic.comp_sensor_fail_state),
                unique_id = waterHeater.DeviceText + "_comp_sensor_fail",
            };
            return ret;
        }

        public static Sensor ToSysSensorFailConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " Sys Sensor Fail",
                state_topic = waterHeater.ToTopic(Topic.sys_sensor_fail_state),
                unique_id = waterHeater.DeviceText + "_sys_sensor_fail",
            };
            return ret;
        }

        public static Sensor ToSystemFailConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " System Fail",
                state_topic = waterHeater.ToTopic(Topic.system_fail_state),
                unique_id = waterHeater.DeviceText + "_system_fail",
            };
            return ret;
        }

       public static Sensor ToFaultCodesConfig(this WaterHeaterInput waterHeater)
        {
            Sensor ret = new Sensor
            {
                name = waterHeater.GetDisplayName() + " Fault Codes",
                state_topic = waterHeater.ToTopic(Topic.fault_codes_state),
                unique_id = waterHeater.DeviceText + "_fault_codes",
            };
            return ret;
        }
    }
}
