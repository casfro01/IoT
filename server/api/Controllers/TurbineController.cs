using dataaccess;
using DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    ITurbineService turbineService) : RealtimeControllerBase(backplane)
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


    [HttpPost(nameof(ExecuteCommand))]
    public async Task<CommandResponse> ExecuteCommand([FromBody] CommandRequest request)
    {
        throw new NotImplementedException();
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