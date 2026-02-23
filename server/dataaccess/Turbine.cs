using System;
using System.Collections.Generic;

namespace dataaccess;

public partial class Turbine
{
    public string Id { get; set; } = null!;

    public string Displayname { get; set; } = null!;

    public virtual ICollection<Alert> Alerts { get; set; } = new List<Alert>();

    public virtual ICollection<Turbinemetric> Turbinemetrics { get; set; } = new List<Turbinemetric>();
}
