using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace EnergySmartBridge.MQTT
{
    public class Sensor : Device
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public enum DeviceClass
        {
            temperature,
            @enum,
            signal_strength,
        }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public DeviceClass? device_class { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string unit_of_measurement { get; set; }
    }
}
