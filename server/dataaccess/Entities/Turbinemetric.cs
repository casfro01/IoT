using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities;

public partial class Turbinemetric
{
    public string Id { get; set; } = null!;
    
    public string Turbineid { get; set; } = null!;

    public DateTime Timestamputc { get; set; }

    public decimal? Windspeed { get; set; }

    public decimal? Winddirection { get; set; }

    public decimal? Ambienttemperature { get; set; }

    public decimal? Rotorspeed { get; set; }

    public decimal? Poweroutput { get; set; }

    public decimal? Nacelledirection { get; set; }

    public decimal? Baldepitch { get; set; }

    public decimal? Generatortemp { get; set; }

    public decimal? Gearboxtemp { get; set; }

    public decimal? Vibration { get; set; }

    public bool? Status { get; set; }

    public virtual Turbine Turbine { get; set; } = null!;
}
