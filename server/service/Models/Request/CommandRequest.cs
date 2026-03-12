using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace service.Models.Request;

// prøvede at bruge en constructor,
// men den lavede bare et interface til ActionTypeData istedet for at basere den på den constructor som klassen havde
public class CommandRequestDto
{
    [Required] public string Action { get; set; } = null!;
    public string? Value { get; set; }

    public CommandRequest ToCommandRequest()
    {
        return new CommandRequest(Action, Value);
    }
}

public class CommandRequest
{
    public CommandRequest(string action, string? value)
    {
        Value = value;
        Action = ActionType.GetAction(action) ?? ActionType.START;
    }
    [Required] public ActionTypeData Action { get; set; } = null!;
    public string? Value { get; set; }
    public static class ActionType
    {
        public static readonly ActionTypeData START = new ActionTypeData(0, "start");
        public static readonly ActionTypeData STOP = new ActionTypeData(1, "stop");
        public static readonly ActionTypeData SET_PITCH = new ActionTypeData(2, "setPitch");
        public static readonly ActionTypeData SET_INTERVAL = new ActionTypeData(0, "setInterval");

        public static readonly List<ActionTypeData> Items = [START, STOP, SET_PITCH, SET_INTERVAL];

        public static ActionTypeData? GetAction(string name)
        {
            return Items.FirstOrDefault(a => a.Name.Equals(name, StringComparison.CurrentCultureIgnoreCase));
        }
        public static ActionTypeData? GetAction(int id)
        {
            return Items.FirstOrDefault(a => a.Id == id);
        }
    }

    public record ActionTypeData(int Id, string Name);
}

public class ExtendedCommandRequest : CommandRequest
{
    public ExtendedCommandRequest(CommandRequest baseClass, string sensorId) : base(baseClass.Action.Name, baseClass.Value)
    {
        SensorId = sensorId;
        Action = baseClass.Action;
        Value = baseClass.Value;
    }
    
    [Required] public string SensorId {get; set;}
}