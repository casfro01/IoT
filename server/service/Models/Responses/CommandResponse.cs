using System.ComponentModel.DataAnnotations;

namespace api.Controllers;

public class CommandResponse
{
    [Required] public DateTime TimeOfExecution { get; set; }
    [Required] public string Action { get; set; } = null!;
    public string Value { get; set; }
}