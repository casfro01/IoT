using dataaccess;
using DataAccess.Entities;
using Microsoft.AspNetCore.Identity;

namespace api.Seeders;
/// <summary>
/// Sletter alle brugere og tilføjer 3 bestemte brugere
/// </summary>
/// <param name="ctx">Database context</param>
public class UserSeeder(MyDbContext ctx, IPasswordHasher<User> hasher) : ISeeder
{
    public async Task Seed()
    {
        await ctx.Database.EnsureCreatedAsync();
        ctx.Users.RemoveRange(ctx.Users);
        ctx.Turbines.RemoveRange(ctx.Turbines);
        await ctx.SaveChangesAsync();

        Turbine t1 = new Turbine()
        {
            Alerts = new List<Alert>(),
            Displayname = "Alpha",
            Id = "turbine-alpha",
            Turbinemetrics = new List<Turbinemetric>(),
        };
        Turbine t2 = new Turbine()
        {
            Alerts = new List<Alert>(),
            Displayname = "Beta",
            Id = "turbine-beta",
            Turbinemetrics = new List<Turbinemetric>(),
        };
        Turbine t3 = new Turbine()
        {
            Alerts = new List<Alert>(),
            Displayname = "Gamma",
            Id = "turbine-gamma",
            Turbinemetrics = new List<Turbinemetric>(),
        };
        Turbine t4 = new Turbine()
        {
            Alerts = new List<Alert>(),
            Displayname = "Delta",
            Id = "turbine-delta",
            Turbinemetrics = new List<Turbinemetric>(),
        };

        ctx.Turbines.Add(t1);
        ctx.Turbines.Add(t2);
        ctx.Turbines.Add(t3);
        ctx.Turbines.Add(t4);
        
        
        User user1 = new User()
        {
            Id  = Guid.NewGuid().ToString(),
            Email = "Jens@gmail.com",
            Role = 0,
            Createdat = DateTime.UtcNow
        };
        user1.Passwordhash = hasher.HashPassword(user1, "Password");
        
        User user2 = new User()
        {
            Id  = Guid.NewGuid().ToString(),
            Email = "Lars@gmail.com",
            Role = 0,
            Createdat = DateTime.UtcNow
        };
        user2.Passwordhash = hasher.HashPassword(user2, "Password");
        
        User user3 = new User()
        {
            Id  = Guid.NewGuid().ToString(),
            Email = "Bob@gmail.com",
            Role = 0,
            Createdat = DateTime.UtcNow
        };
        user3.Passwordhash = hasher.HashPassword(user3, "Password");
        Console.WriteLine("here " + ctx);
        ctx.Users.Add(user1);
        ctx.Users.Add(user2);
        ctx.Users.Add(user3);
        await ctx.SaveChangesAsync();
        ctx.ChangeTracker.Clear();
    }
}