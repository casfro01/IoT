using Microsoft.AspNetCore.Mvc;
using Mqtt.Controllers;
using service;
using service.Models;
using service.Models.Responses;

namespace api.Controllers;

public class TurbineDataCollectorController(ITurbineService service, TurbineSubscriberService subscriberService) : MqttController
{
    [MqttRoute("farm/29c129fe-d28e-4a12-810e-af5ac7456fad/windmill/{turbineId}/telemetry")]
    public async Task CollectSensorData(string turbineId, TurbineTelemetry data)
    {
        var res = await service.Create(data);
        await subscriberService.NotifySubscriber(data.TurbineId, res);
    }
}