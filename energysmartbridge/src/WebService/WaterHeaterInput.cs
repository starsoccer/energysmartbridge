namespace EnergySmartBridge.WebService
{
    public class WaterHeaterInput
    {
        public string DeviceText { get; set; } // *MAC address*
        public string Password { get; set; } // *Random string*
        public string ModuleApi { get; set; } // 1.5
        public string ModFwVer { get; set; } // 3.1
        public string MasterFwVer { get; set; } // 06.03
        public string MasterModelId { get; set; } // B1.00
        public string DisplayFwVer { get; set; } // 03.04
        public string WifiFwVer { get; set; } // C2.4.0.3.AO7
        public int UpdateRate { get; set; } // 300
        public string Mode { get; set; } // EnergySmart
        public int SetPoint { get; set; } // 120
        public string Units { get; set; } // F
        public string LeakDetect { get; set; } // NotDetected
        public int MaxSetPoint { get; set; } // 120
        public string Grid { get; set; } // Enabled
        public string AvailableModes { get; set; } // Standard,Vacation,EnergySmart
        public bool SystemInHeating { get; set; } // False
        public string HotWaterVol { get; set; } // High
        public string Leak { get; set; } // None
        public string DryFire { get; set; } // None
        public string ElementFail { get; set; } // None
        public string TankSensorFail { get; set; } // None
        public bool EcoError { get; set; } // False
        public string MasterDispFail { get; set; } // None
        public int UpperTemp { get; set; } // 122
        public int LowerTemp { get; set; } // 104
        public string FaultCodes { get; set; } // 0
        public string UnConnectNumber { get; set; } // 0
        public string AddrData { get; set; } // *Two strings*
        public string SignalStrength { get; set; } // -46

        public string? AirFilterStatus { get; set; } // OK
        public bool? CondensePumpFail { get; set; } // False
        public string? CompSensorFail { get; set; } // None
        public string? SysSensorFail { get; set; } // None
        public string? SystemFail { get; set; } // None
    }
}
