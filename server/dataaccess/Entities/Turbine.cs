using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities;

public partial class Turbine
{
    [MaxLength(32)]
    public string Id { get; set; } = null!;

    [MaxLength(100)]
    public string Displayname { get; set; } = null!;

    public virtual ICollection<Alert> Alerts { get; set; } = new List<Alert>();

    public virtual ICollection<Turbinemetric> Turbinemetrics { get; set; } = new List<Turbinemetric>();
}
