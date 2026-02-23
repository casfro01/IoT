using Microsoft.EntityFrameworkCore;

namespace dataaccess;

public class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }
    
}