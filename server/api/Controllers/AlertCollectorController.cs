using Microsoft.AspNetCore.Mvc;
using Mqtt.Controllers;
using service;
using service.Models;

namespace api.Controllers;

public class AlertCollectorController(IAlertService alertService, AlertSubscriberService subscriberService) : MqttController
{
    [MqttRoute("farm/29c129fe-d28e-4a12-810e-af5ac7456fad/windmill/{turbineId}/alert")]
    public async Task CollectAlert(string turbineId, AlertPayload payload)
    {
        var res = await alertService.Create(turbineId, payload);
        await subscriberService.NotifySubscriber(res);
    }
}
