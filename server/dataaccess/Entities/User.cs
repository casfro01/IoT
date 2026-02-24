using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities;

public partial class User
{
   public string Id { get; set; } = null!;

    [EmailAddress]
    [MaxLength(1000)]
    public string Email { get; set; } = null!;

    public int Role { get; set; }

    [MinLength(6)]
    [MaxLength(10000)]
    public string Passwordhash { get; set; } = null!;

    public DateTime Createdat { get; set; }
}
