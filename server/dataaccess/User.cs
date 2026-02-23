using System;
using System.Collections.Generic;

namespace dataaccess;

public partial class User
{
    public string Id { get; set; } = null!;

    public string Email { get; set; } = null!;

    public int Role { get; set; }

    public string Passwordhash { get; set; } = null!;

    public DateTime Createdat { get; set; }
}
