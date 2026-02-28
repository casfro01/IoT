using System.ComponentModel.DataAnnotations;

namespace service.Models.Request;

public class CommandRequest
{
    [Required] public string Action { get; set; } = null!;
    public string? Value { get; set; }
}