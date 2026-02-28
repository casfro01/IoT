using DataAccess.Entities;

namespace service.Models.Responses;

public class AlertResponse
{
    public string Id { get; set; } = null!;
    public string? TurbineId { get; set; }
    public DateTime Alerted { get; set; }
    public string? Message { get; set; }
    public int Severity { get; set; }

    public AlertResponse(Alert entity)
    {
        Id = entity.Id;
        TurbineId = entity.Turbineid;
        Alerted = entity.Alerted;
        Message = entity.Message;
        Severity = entity.Severity;
    }
}
