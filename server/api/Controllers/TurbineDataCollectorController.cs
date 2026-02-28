using Microsoft.AspNetCore.Mvc;
using Mqtt.Controllers;
using service;
using service.Models;

namespace api.Controllers;

public class TurbineDataCollectorController(ITurbineService service) : MqttController
{
    [MqttRoute("farm/29c129fe-d28e-4a12-810e-af5ac7456fad/windmill/{turbineId}/telemetry")]
    public async Task CollectSensorData(string turbineId, TurbineTelemetry data)
    {
        await service.Create(data);
        // TODO : måske noget som kan notify ting og sager? idk, måske ikke nødvendig hvis man subber til changetracker
    }
}