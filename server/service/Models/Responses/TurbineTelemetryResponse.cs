using DataAccess.Entities;

namespace service.Models.Responses;

public class TurbineTelemetryResponse
{

    public string TurbineName { get; set; }
    public DateTime Timestamp { get; set; }
    public double WindSpeed { get; set; }
    public double WindDirection { get; set; }
    public double AmbientTemperature { get; set; }
    public double RotorSpeed { get; set; }
    public double PowerOutput { get; set; }
    public double NacelleDirection { get; set; }
    public double BladePitch { get; set; }
    public double GeneratorTemp { get; set; }
    public double GearboxTemp { get; set; }
    public double Vibration { get; set; }
    public string Status { get; set; }
    
    public TurbineTelemetryResponse(Turbinemetric data)
    {
        TurbineName = data.Turbine.Displayname;
        Timestamp = data.Timestamputc;
        WindSpeed = data.Windspeed == null ? 0 : (double) data.Windspeed;
        WindDirection = data.Winddirection == null ? 0 : (double) data.Winddirection;
        AmbientTemperature = data.Ambienttemperature == null ? 0 : (double) data.Ambienttemperature;
        RotorSpeed = data.Rotorspeed == null ? 0 : (double) data.Rotorspeed;
        PowerOutput = data.Poweroutput == null ? 0 : (double) data.Poweroutput;
        NacelleDirection = data.Nacelledirection == null ? 0 : (double) data.Nacelledirection;
        BladePitch = data.Baldepitch == null ? 0 : (double) data.Baldepitch;
        GeneratorTemp = data.Generatortemp == null ? 0 : (double) data.Generatortemp;
        GearboxTemp = data.Gearboxtemp == null ? 0 : (double) data.Gearboxtemp;
        Vibration = data.Vibration == null ? 0 : (double) data.Vibration;
        Status = (data.Status ?? false) ? "running" : "stopped";
    }
}