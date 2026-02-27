namespace service.Models.Responses;

public class TurbineResponse
{
    public string Id { get; set; }
    public string Displayname { get; set; }
    public List<TurbineTelemetryResponse> Metrics { get; set; } = new();
}