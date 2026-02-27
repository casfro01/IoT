using System.ComponentModel.DataAnnotations;
using dataaccess;
using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using service.Models;
using service.Models.Request;
using service.Models.Responses;
using Sieve.Models;

namespace service;

public interface ITurbineService : IService<TurbineTelemetryResponse, TurbineTelemetry, CommandRequest>
{
    public Task<List<TurbineResponse>> GetTurbines(int includeMetrics);
}

/// <summary>
/// Idk, måske skal denne service laves om, men den ser sådan ud nu
/// </summary>
public class TurbineService(MyDbContext db) : ITurbineService
{
    /// <summary>
    /// Hent data
    /// </summary>
    /// <param name="model">Søge model</param>
    /// <returns>List med data, over x peride, som defineres i søge modellen</returns>
    public Task<List<TurbineTelemetryResponse>> Get(SieveModel model)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Tilføj et datapunkt
    /// </summary>
    /// <param name="request">Datapunkt</param>
    /// <returns>Datapunkt</returns>
    /// <exception cref="KeyNotFoundException">Hvis turbinen ikke findes</exception>>
    public async Task<TurbineTelemetryResponse> Create(TurbineTelemetry request)
    {
        if (!db.Turbines.Any(t => t.Id == request.TurbineId))
            throw new KeyNotFoundException("Turbine not found");

        var turbine = MapToMetric(request);
        db.Turbinemetrics.Add(turbine);
        await db.SaveChangesAsync();
        return new TurbineTelemetryResponse(turbine);
    }

    private Turbinemetric MapToMetric(TurbineTelemetry data)
    {
        var turbine = db.Turbines.First(t => t.Id == data.TurbineId);
        return new Turbinemetric()
        {
            Id = Guid.NewGuid().ToString(),
            Turbineid = data.TurbineId,
            Timestamputc = data.Timestamp,
            Windspeed = (decimal) data.WindSpeed,
            Winddirection = (decimal) data.WindDirection,
            Ambienttemperature = (decimal) data.AmbientTemperature,
            Rotorspeed = (decimal) data.RotorSpeed,
            Poweroutput = (decimal) data.PowerOutput,
            Nacelledirection = (decimal) data.NacelleDirection,
            Baldepitch = (decimal) data.BladePitch,
            Generatortemp = (decimal) data.GeneratorTemp,
            Gearboxtemp = (decimal) data.GearboxTemp,
            Vibration = (decimal) data.Vibration,
            Status = data.Status == "running",
            Turbine = turbine
        };
    }

    /// <summary>
    /// Udfører en kommando til at justere på turbinenen - bliver nok flyttet, lucas hvad synes du?
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public Task<TurbineTelemetryResponse> Update(CommandRequest request)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Ja, idk, slette data er vel no-go, hehe
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    /// <exception cref="UnauthorizedAccessException"></exception>
    public Task<TurbineTelemetryResponse> Delete(string id)
    {
        throw new UnauthorizedAccessException("Kun kommunen må gøre dette, fordi de er seje");
    }

    public async Task<List<TurbineResponse>> GetTurbines(int includeMetrics)
    {
        if (includeMetrics > 100) throw new ValidationException("Too many metrics; max 100");
        var turbines = await db.Turbines.ToListAsync();
        List<TurbineResponse> list = new();
        foreach (Turbine t in turbines)
        {
            var reponsetype = new TurbineResponse(t);
            var mLst = await db.Turbinemetrics
                .OrderByDescending(m => m.Timestamputc)
                .Take(includeMetrics)
                .ToListAsync();
            reponsetype.Metrics = mLst
                .Select(tm => new TurbineTelemetryResponse(tm))
                .ToList();
            
            list.Add(reponsetype);
        }

        return list;
    }
}