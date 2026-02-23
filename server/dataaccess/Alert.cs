using System;
using System.Collections.Generic;

namespace dataaccess;

public partial class Alert
{
    public string Id { get; set; } = null!;

    public string? Turbineid { get; set; }

    public DateTime Alerted { get; set; }

    public string? Message { get; set; }

    public int Severity { get; set; }

    public virtual Turbine? Turbine { get; set; }
}
