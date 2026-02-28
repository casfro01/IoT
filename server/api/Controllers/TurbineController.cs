using System.Text.Json;
using dataaccess;
using DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;
using NLog.LayoutRenderers.Wrappers;
using service;
using service.Models.Request;
using service.Models.Responses;
using Sieve.Models;
using StateleSSE.AspNetCore;
using StateleSSE.AspNetCore.EfRealtime;
using StateleSSE.AspNetCore.GroupRealtime;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Operator")]
public class TurbineController(
    ISseBackplane backplane, 
    IRealtimeManager realtimeManager, 
    IGroupRealtimeManager groupManager,
    ITurbineService turbineService,
    IMqttClientService mqtt) : RealtimeControllerBase(backplane)
{
    [HttpGet(nameof(ConnectToAllTurbines))]
    public async Task ConnectToAllTurbines(string connectionId)
    {
        await ConnectToGroup(connectionId, "all");
    }
    
    [HttpGet(nameof(ConnectToTurbine))]
    public async Task ConnectToTurbine(string connectionId, string turbineId){
        await ConnectToGroup(connectionId, turbineId);
    }

    [HttpGet(nameof(GetTurbines))]
    public async Task<List<TurbineResponse>> GetTurbines(int metricAmount)
    {
        return await turbineService.GetTurbines(metricAmount);
    }


    [HttpPost("{sensorId}/command")]
    // tilføj CommandResponse return her igen måske i stedet for void
    public async Task ExecuteCommand(string sensorId, [FromBody] CommandRequest request)
    {
        // dette skal ændres med en enum i commandrequest eller sådan noget, det hele er faktisk ret most
        var payload = new Dictionary<string, object?>
        {
            ["action"] = request.Action
        };

        switch (request.Action)
        {
            case "setPitch":
                payload["angle"] = request.Value;
                break;
            case "start":
                break;
            case "stop":
                payload["reason"] = request.Value;
                break;
            case "setInterval":
                payload["value"] = request.Value;
                break;
        }
        
        string json = JsonSerializer.Serialize(payload);
        
        await mqtt.PublishAsync($"farm/29c129fe-d28e-4a12-810e-af5ac7456fad/windmill/{sensorId}/command", json);
    }


    private async Task ConnectToGroup(string connectionId, string turbineId)
    {
        realtimeManager.UnsubscribeAll(connectionId);
        await backplane.Groups.AddToGroupAsync(connectionId, turbineId);
        realtimeManager.Subscribe<MyDbContext>(connectionId, turbineId, 
            criteria: changes =>
            {
                var change = changes.HasAdded<Turbinemetric>();
                return change;
            },
            query: async c => await c.Turbinemetrics
                .Where(t => turbineId == "all" || t.Turbineid == turbineId)
                .OrderByDescending(t => t.Timestamputc)
                .ToListAsync());
    }
}