using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service.Models.Request;
using service.Models.Responses;
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
    IGroupRealtimeManager groupManager) : RealtimeControllerBase(backplane)
{
    [HttpGet(nameof(ConnectToAllTurbines))]
    public async Task ConnectToAllTurbines(string connectionId){
        throw new NotImplementedException();
    }
    
    [HttpGet(nameof(ConnectToTurbine))]
    public async Task ConnectToTurbine(string connectionId, string turbineId){
        throw new NotImplementedException();
    }

    [HttpGet(nameof(GetTurbines))]
    public async Task<TurbineResponse> GetTurbines()
    {
        throw new NotImplementedException();
    }


    [HttpPost(nameof(ExecuteCommand))]
    public async Task<CommandResponse> ExecuteCommand([FromBody] CommandRequest request)
    {
        throw new NotImplementedException();
    }


    private async Task ConnectToGroup(string connectionId, string name)
    {
        
    }
}