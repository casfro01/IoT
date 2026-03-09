using dataaccess;
using DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;
using service;
using service.Models.Responses;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;
using StateleSSE.AspNetCore.GroupRealtime;

namespace api.Controllers;

[ApiController]
[Route("api/alerts")]
[Authorize(Roles = "Operator")]
public class AlertController(ISseBackplane backplane, 
    /*IRealtimeManager realtimeManager, 
    IGroupRealtimeManager groupManager,*/
    IAlertService alertService,
    AlertSubscriberService subscriberService): RealtimeControllerBase(backplane)
{
    [AllowAnonymous]
    [HttpGet(nameof(Connect))]
    public new async Task Connect()
    {
        await base.Connect();
    }
    /// <summary>
    /// Forbind til alerts; få vigtige opdateringer
    /// </summary>
    /// <param name="connectionId">Dit forbindelses id ;P</param>
    [HttpGet(nameof(ConnectToAlerts))]
    public async Task ConnectToAlerts(string connectionId)
    {
        await subscriberService.ConnectToAlerts(connectionId);
    }
    
    /// <summary>
    /// Henter x antal alerts sorteret efter tidsstempel
    /// </summary>
    /// <param name="amount">Mængde alerts</param>
    /// <returns></returns>
    [HttpGet(nameof(GetAlerts))]
    public async Task<List<AlertResponse>> GetAlerts(int amount)
    {
        return await alertService.GetAlerts(amount);
    }
    
    /*
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
     */
}