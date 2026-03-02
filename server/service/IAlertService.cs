using service.Models;
using service.Models.Responses;

namespace service;

public interface IAlertService
{
    Task<AlertResponse> Create(string turbineId, AlertPayload payload);

    Task<List<AlertResponse>> GetAlerts(int amount);
}
