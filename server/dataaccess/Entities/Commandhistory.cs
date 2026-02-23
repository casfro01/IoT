using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities;

public partial class Commandhistory
{
    [MaxLength(32)]
    public string Id { get; set; } = null!;

    public DateTime Timeexecuted { get; set; }

    public int Action { get; set; }

    [MaxLength(50)]
    public string? Value { get; set; }
}
