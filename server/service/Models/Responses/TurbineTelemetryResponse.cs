namespace service.Models.Responses;

public class TurbineTelemetryResponse(
    string TurbineName,
    DateTime Timestamp,
    double WindSpeed,
    double WindDirection,
    double AmbientTemperature,
    double RotorSpeed,
    double PowerOutput,
    double NacelleDirection,
    double BladePitch,
    double GeneratorTemp,
    double GearboxTemp,
    double Vibration,
    string Status);