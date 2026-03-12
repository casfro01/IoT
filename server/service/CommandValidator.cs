using dataaccess;
using Microsoft.EntityFrameworkCore;
using service.Models.Request;

namespace service;

public class CommandValidator(MyDbContext ctx)
{
    public async Task<ValidateResponse> ValidateCommand(string sensorId, CommandRequest command)
    {
        var turbine = ctx.Turbines.Include(t => t.Commandhistories.OrderByDescending(c => c.Timeexecuted).Take(35)).FirstOrDefault(t => t.Id == sensorId)
                      ?? null;
        if (turbine == null)
            return new ValidateResponse()
            {
                Valid = false,
                Message = "Could not find turbine."
            };

        // Java enum > C# enum
        if (command.Action.Name == CommandRequest.ActionType.START.Name)
        {
            var startStopList = turbine.Commandhistories
                .Where(c => c.Action == CommandRequest.ActionType.START.Id || c.Action == CommandRequest.ActionType.STOP.Id)
                .OrderByDescending(c => c.Timeexecuted)
                .ToList();
            // tillad hvis den ikke har været startet før / hvis den sideste kommando var start
            var isOn = startStopList.Count != 0 && startStopList.First().Action == CommandRequest.ActionType.START.Id;
            return new ValidateResponse
            {
                Valid = !isOn,
                Message = isOn ? "Turbine is already running" : "Turbine is not running"
            };
        }
        if (command.Action.Name == CommandRequest.ActionType.STOP.Name) {
            var startStopList = turbine.Commandhistories
                .Where(c => c.Action == CommandRequest.ActionType.START.Id || c.Action == CommandRequest.ActionType.STOP.Id)
                .OrderByDescending(c => c.Timeexecuted)
                .ToList();
            // tillad hvis den ikke har været stoppet før / hvis den sideste kommando var stop
            var isOff = startStopList.Count != 0 && startStopList.First().Action == CommandRequest.ActionType.STOP.Id;
            return new ValidateResponse()
            {
                Valid = !isOff,
                Message = isOff ? "Turbine is already stopped" : "Turbine is running"
            };
        }
        if (command.Action.Name == CommandRequest.ActionType.SET_PITCH.Name || command.Action.Name == CommandRequest.ActionType.SET_INTERVAL.Name) {
            return new ValidateResponse()
            {
                Valid = true,
                Message = "Accepted because lack of logic"
            };
        }
        return new ValidateResponse()
        {
            Valid = false,
            Message = "Invalid command name."
        };
    }
    
    public class ValidateResponse{
        public bool Valid {get; set;}
        public string Message { get; set; } = null!;
    }
}