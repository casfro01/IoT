using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities;

public partial class Commandhistory
{
    public string Id { get; set; } = null!;
    
    public string? Turbineid { get; set; }

    public DateTime Timeexecuted { get; set; }

    public int Action { get; set; }

    [MaxLength(50)]
    public string? Value { get; set; }
    
    public virtual Turbine? Turbine { get; set; }
}
