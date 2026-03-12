using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace dataaccess;

public partial class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Alert> Alerts { get; set; }

    public virtual DbSet<Commandhistory> Commandhistories { get; set; }

    public virtual DbSet<Turbine> Turbines { get; set; }

    public virtual DbSet<Turbinemetric> Turbinemetrics { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Alert>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("alerts_pkey");

            entity.ToTable("alerts", "iot");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Alerted).HasColumnName("alerted");
            entity.Property(e => e.Message).HasColumnName("message");
            entity.Property(e => e.Severity).HasColumnName("severity");
            entity.Property(e => e.Turbineid).HasColumnName("turbineid");

            entity.HasOne(d => d.Turbine).WithMany(p => p.Alerts)
                .HasForeignKey(d => d.Turbineid)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("alerts_turbineid_fkey");
        });

        modelBuilder.Entity<Commandhistory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("commandhistory_pkey");

            entity.ToTable("commandhistory", "iot");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Action).HasColumnName("action");
            entity.Property(e => e.Timeexecuted).HasColumnName("timeexecuted");
            entity.Property(e => e.Turbineid).HasColumnName("turbineid");
            entity.Property(e => e.Value).HasColumnName("value");

            entity.HasOne(d => d.Turbine).WithMany(p => p.Commandhistories)
                .HasForeignKey(d => d.Turbineid)
                .HasConstraintName("commandhistory_turbineid_fkey");
        });

        modelBuilder.Entity<Turbine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("turbines_pkey");

            entity.ToTable("turbines", "iot");

            entity.HasIndex(e => e.Displayname, "turbines_displayname_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Displayname).HasColumnName("displayname");
        });

        modelBuilder.Entity<Turbinemetric>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("turbinemetric_pkey");

            entity.ToTable("turbinemetric", "iot");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Ambienttemperature)
                .HasPrecision(4, 1)
                .HasColumnName("ambienttemperature");
            entity.Property(e => e.Baldepitch)
                .HasPrecision(3, 1)
                .HasColumnName("baldepitch");
            entity.Property(e => e.Gearboxtemp)
                .HasPrecision(4, 1)
                .HasColumnName("gearboxtemp");
            entity.Property(e => e.Generatortemp)
                .HasPrecision(3, 1)
                .HasColumnName("generatortemp");
            entity.Property(e => e.Nacelledirection)
                .HasPrecision(4, 1)
                .HasColumnName("nacelledirection");
            entity.Property(e => e.Poweroutput)
                .HasPrecision(5, 1)
                .HasColumnName("poweroutput");
            entity.Property(e => e.Rotorspeed)
                .HasPrecision(4, 1)
                .HasColumnName("rotorspeed");
            entity.Property(e => e.Status)
                .HasDefaultValue(false)
                .HasColumnName("status");
            entity.Property(e => e.Timestamputc).HasColumnName("timestamputc");
            entity.Property(e => e.Turbineid).HasColumnName("turbineid");
            entity.Property(e => e.Vibration)
                .HasPrecision(3, 2)
                .HasColumnName("vibration");
            entity.Property(e => e.Winddirection)
                .HasPrecision(4, 1)
                .HasColumnName("winddirection");
            entity.Property(e => e.Windspeed)
                .HasPrecision(3, 1)
                .HasColumnName("windspeed");

            entity.HasOne(d => d.Turbine).WithMany(p => p.Turbinemetrics)
                .HasForeignKey(d => d.Turbineid)
                .HasConstraintName("turbinemetric_turbineid_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_pkey");

            entity.ToTable("user", "iot");

            entity.HasIndex(e => e.Email, "user_email_key").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Createdat).HasColumnName("createdat");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Passwordhash).HasColumnName("passwordhash");
            entity.Property(e => e.Role).HasColumnName("role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
