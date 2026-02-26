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
        await ctx.SaveChangesAsync();

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