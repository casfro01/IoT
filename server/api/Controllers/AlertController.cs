using dataaccess;
using DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;
using service;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;
using StateleSSE.AspNetCore.GroupRealtime;

namespace api.Controllers;

[ApiController]
[Route("api/alerts")]
[Authorize(Roles = "Operator")]
public class AlertController(ISseBackplane backplane, 
    IRealtimeManager realtimeManager, 
    IGroupRealtimeManager groupManager,
    ITurbineService turbineService,
    IMqttClientService mqtt): RealtimeControllerBase(backplane)
{
    [HttpGet(nameof(ConnectToAlerts))]
    public async Task ConnectToAlerts(string connectionId)
    {
        await backplane.Groups.AddToGroupAsync(connectionId, "alerts");
        realtimeManager.Subscribe<MyDbContext>(connectionId, "alerts", 
            criteria: changes =>
            {
                var change = changes.HasAdded<Alert>();
                return change;
            },
            query: async c => await c.Alerts
                .OrderByDescending(a => a.Alerted)
                .Take(10)
                .ToListAsync());
    }
}