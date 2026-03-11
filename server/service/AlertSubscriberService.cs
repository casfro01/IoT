using System.Text.Json;
using dataaccess;
using service.Models.Responses;
using StateleSSE.AspNetCore;

namespace service;

public class AlertSubscriberService(MyDbContext ctx, ISseBackplane backplane)
{
    
    public async Task ConnectToAlerts(string connectionId)
    {
        // unsub alle alerts
        await backplane.Groups.RemoveFromGroupAsync(connectionId, "alerts");
        
        // sub til alerts
        await backplane.Groups.AddToGroupAsync(connectionId, "alerts");
    }


    public async Task NotifySubscriber(AlertResponse alert)
    {
        var jsonData = JsonSerializer.Serialize(alert);
        await backplane.Clients.SendToGroupAsync("alerts", jsonData);
    }
    
}