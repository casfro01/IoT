using dataaccess;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
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

    public async Task<List<AlertResponse>> GetAlerts(int amount)
    {
        if (amount > 100) throw new ArgumentException("Amount too large. Must be 100 or below");
        
        var res = await db.Alerts
            .OrderByDescending(a => a.Alerted)
            .Take(amount)
            .ToListAsync();
        
        return (from t in res select new AlertResponse(t)).ToList();
    }
}
