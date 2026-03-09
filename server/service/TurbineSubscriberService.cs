using System.Text.Json;
using dataaccess;
using service.Models.Responses;
using StateleSSE.AspNetCore;

namespace service;

public class TurbineSubscriberService(MyDbContext ctx, ISseBackplane backplane)
{
    
    public async Task ConnectToGroup(string connectionId, string turbineId)
    {
        //realtimeManager.UnsubscribeAll(connectionId);
        // unsub alle turbiner
        await backplane.Groups.RemoveFromGroupAsync(connectionId, "all");
        foreach (var t in ctx.Turbines.ToList())
        {
            await backplane.Groups.RemoveFromGroupAsync(connectionId, t.Id);
        }
        
        // sub til turbine
        await backplane.Groups.AddToGroupAsync(connectionId, turbineId);
        /*
        realtimeManager.Subscribe<MyDbContext>(connectionId, turbineId, 
            criteria: changes =>
            {
                var change = changes.HasAdded<Turbinemetric>();
                foreach (ChangeEntry entry in changes.Entries)
                {
                    if (entry.Entity is Turbinemetric t)
                    {
                        change = t.Id == turbineId || turbineId == "all";
                    }
                }
                return change;
            },
            query: async c =>
            {
                var res = await c.Turbinemetrics
                    .Include(t => t.Turbine)
                    .Where(t => turbineId == "all" || t.Turbineid == turbineId)
                    .OrderByDescending(t => t.Timestamputc)
                    .Take(1)
                    .ToListAsync();
                return (from t in res select new TurbineTelemetryResponse(t)).ToList();
            }
        );*/
    }


    public async Task NotifySubscriber(string turbineId, TurbineTelemetryResponse data)
    {
        var jsonData = JsonSerializer.Serialize(data);
        await backplane.Clients.SendToGroupsAsync(["all",  turbineId], jsonData);
    }
    
}