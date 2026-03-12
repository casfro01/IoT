using System.ComponentModel.DataAnnotations;
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
    TurbineSubscriberService subService,
    ITurbineService turbineService,
    IMqttClientService mqtt,
    CommandValidator validator) : RealtimeControllerBase(backplane)
{
    [HttpGet(nameof(ConnectToAllTurbines))]
    public async Task ConnectToAllTurbines(string connectionId)
    {
        await subService.ConnectToGroup(connectionId, "all");
    }
    
    [HttpGet(nameof(ConnectToTurbine))]
    public async Task ConnectToTurbine(string connectionId, string turbineId){
        await subService.ConnectToGroup(connectionId, turbineId);
    }

    [HttpGet(nameof(GetTurbines))]
    public async Task<List<TurbineResponse>> GetTurbines(int metricAmount)
    {
        return await turbineService.GetTurbines(metricAmount);
    }


    [HttpPost("{sensorId}/command")]
    // tilføj CommandResponse return her igen måske i stedet for void
    public async Task ExecuteCommand(string sensorId, [FromBody] CommandRequestDto requestDto)
    {
        var request = requestDto.ToCommandRequest();
        var valid = await validator.ValidateCommand(sensorId, request);
        if (!valid.Valid) throw new ValidationException(valid.Message);
        // custom enum er lavet i CommandRequest, fordi C# laver og håndterer enums dårligt
        // derfor blev man lige nødt til at rette det
        var payload = new Dictionary<string, object?>
        {
            ["action"] = request.Action.Name
        };

        switch (request.Action.Name)
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
        try
        {
            await mqtt.PublishAsync($"farm/29c129fe-d28e-4a12-810e-af5ac7456fad/windmill/{sensorId}/command", json);
            var res = await turbineService.ExecuteTurbineCommand(new ExtendedCommandRequest(request, sensorId));
        }
        catch
        {
            throw new Exception("Failed to execute command");
        }
    }
}