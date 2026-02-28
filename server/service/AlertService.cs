using dataaccess;
using DataAccess.Entities;
using service.Models;
using service.Models.Responses;

namespace service;

public class AlertService(MyDbContext db) : IAlertService
{
    public async Task<AlertResponse> Create(string turbineId, AlertPayload payload)
    {
        var turbine = await db.Turbines.FindAsync(turbineId)
            ?? throw new KeyNotFoundException("Turbine not found");

        var alert = new Alert
        {
            Id = Guid.NewGuid().ToString(),
            Turbineid = turbineId,
            Alerted = DateTime.UtcNow,
            Message = payload.Message,
            Severity = payload.Severity,
            Turbine = turbine
        };
        db.Alerts.Add(alert);
        await db.SaveChangesAsync();
        return new AlertResponse(alert);
    }
}
