using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities;

public partial class Alert
{
    public string Id { get; set; } = null!;

    [MaxLength(32)]public string? Turbineid { get; set; }

    public DateTime Alerted { get; set; }

    [MaxLength(1000)] public string? Message { get; set; }

    public int Severity { get; set; }

    public virtual Turbine? Turbine { get; set; }
}
