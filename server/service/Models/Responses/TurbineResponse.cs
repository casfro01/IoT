using DataAccess.Entities;

namespace service.Models.Responses;

public class TurbineResponse(Turbine t)
{
    public string Id { get; set; } = t.Id;
    public string Displayname { get; set; } = t.Displayname;
    public List<TurbineTelemetryResponse> Metrics { get; set; } = new();
    public List<AlertResponse> Alerts { get; set; } = new();
}